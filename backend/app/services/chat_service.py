from typing import Any

from fastapi import BackgroundTasks
from openai import AsyncOpenAI

from app.core.config import settings
from app.models.chat import Conversation, Message
from app.schemas.chat import ChatRequest, ChatResponse


def get_llm_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.DEEPSEEK_API_KEY, base_url=settings.DEEPSEEK_BASE_URL)


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
    response = await client.chat.completions.create(
        model=request.model, messages=messages, temperature=0.7
    )
    assistant_content = response.choices[0].message.content or ""

    assistant_message = await _save_message(conversation.id, "assistant", assistant_content, db_session)
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
        from sqlalchemy import select
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


async def _save_message(conversation_id, role: str, content: str, db) -> Message:
    msg = Message(conversation_id=conversation_id, role=role, content=content)
    db.add(msg)
    await db.flush()
    return msg


async def _build_context(conversation_id, db) -> list[dict]:
    from sqlalchemy import select
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
            model=settings.DEEPSEEK_MODEL,
            messages=[
                {"role": "system", "content": "Generate a short title (max 6 words) for this conversation."},
                {"role": "user", "content": first_message},
            ],
            max_tokens=20,
            temperature=0.3,
        )
        title = response.choices[0].message.content.strip().strip('"')
        if title:
            from sqlalchemy import select, update
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
