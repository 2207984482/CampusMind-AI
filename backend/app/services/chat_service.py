import json
from typing import Any, AsyncGenerator

from fastapi import BackgroundTasks
from sqlalchemy import select, update

from app.models.chat import Conversation, Message
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm import get_default_model, get_llm_client


# ── streaming chat ──

async def chat_stream(
    user_id: str,
    request: ChatRequest,
    db: Any,
) -> AsyncGenerator[str, None]:
    """Yields SSE-formatted chunks: data: {"delta": "...", "done": false}\n\n"""
    conversation = await _get_or_create_conversation(user_id, request, db)
    await _save_message(conversation.id, "user", request.message, db)

    context = await _build_context(conversation.id, db)
    client = get_llm_client()
    model = request.model or get_default_model()

    full_content = ""
    total_tokens = 0

    stream = await client.chat.completions.create(
        model=model, messages=context, temperature=0.7, stream=True
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            full_content += delta
            yield f"data: {json.dumps({'delta': delta, 'done': False})}\n\n"
        # token usage available in the final chunk for OpenAI-compatible APIs
        if chunk.usage:
            total_tokens = chunk.usage.total_tokens

    # save assistant message with token count
    assistant_msg = await _save_message(
        conversation.id, "assistant", full_content, db, token_count=total_tokens
    )

    # update conversation total_tokens
    if total_tokens:
        await db.execute(
            update(Conversation)
            .where(Conversation.id == conversation.id)
            .values(total_tokens=Conversation.total_tokens + total_tokens)
        )
    await db.commit()

    yield (
        "data: "
        + json.dumps({
            "delta": "",
            "done": True,
            "message_id": str(assistant_msg.id),
            "conversation_id": str(conversation.id),
        })
        + "\n\n"
    )


# ── non-streaming chat (backward compat) ──

async def chat(
    user_id: str,
    request: ChatRequest,
    db_session: Any,
    background_tasks: BackgroundTasks,
) -> ChatResponse:
    conversation = await _get_or_create_conversation(user_id, request, db_session)
    user_message = await _save_message(conversation.id, "user", request.message, db_session)

    client = get_llm_client()
    messages = await _build_context(conversation.id, db_session)
    model = request.model or get_default_model()
    response = await client.chat.completions.create(
        model=model, messages=messages, temperature=0.7
    )
    assistant_content = response.choices[0].message.content or ""
    total_tokens = response.usage.total_tokens if response.usage else 0

    assistant_message = await _save_message(
        conversation.id, "assistant", assistant_content, db_session, token_count=total_tokens
    )

    if total_tokens:
        await db_session.execute(
            update(Conversation)
            .where(Conversation.id == conversation.id)
            .values(total_tokens=Conversation.total_tokens + total_tokens)
        )
    await db_session.commit()

    if conversation.title == "New Chat" and len(messages) <= 1:
        background_tasks.add_task(_auto_title, conversation.id, request.message, db_session)

    return ChatResponse(
        conversation_id=conversation.id,
        message=MessageResponse.model_validate(user_message),
        response=MessageResponse.model_validate(assistant_message),
    )


# ── internal helpers ──

async def _get_or_create_conversation(user_id: str, request: ChatRequest, db) -> Conversation:
    if request.conversation_id:
        result = await db.execute(
            select(Conversation).where(
                Conversation.id == request.conversation_id,
                Conversation.user_id == user_id,
            )
        )
        conv = result.scalar_one_or_none()
        if conv:
            return conv
    conv = Conversation(user_id=user_id, model=request.model)
    db.add(conv)
    await db.flush()
    return conv


async def _save_message(
    conversation_id, role: str, content: str, db, token_count: int | None = None
) -> Message:
    msg = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        token_count=token_count,
    )
    db.add(msg)
    await db.flush()
    return msg


async def _build_context(conversation_id, db) -> list[dict]:
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
        .limit(50)
    )
    return [{"role": m.role, "content": m.content} for m in result.scalars().all()]


async def _auto_title(conversation_id, first_message: str, db) -> None:
    try:
        client = get_llm_client()
        response = await client.chat.completions.create(
            model=get_default_model(),
            messages=[
                {"role": "system", "content": "Generate a short title (max 6 words) for this conversation."},
                {"role": "user", "content": first_message},
            ],
            max_tokens=20,
            temperature=0.3,
        )
        title = response.choices[0].message.content.strip().strip('"')
        if title:
            await db.execute(
                update(Conversation)
                .where(Conversation.id == conversation_id)
                .values(title=title)
            )
            await db.commit()
    except Exception:
        pass


# avoid circular import
from app.schemas.chat import MessageResponse  # noqa: E402
