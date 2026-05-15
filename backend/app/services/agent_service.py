from app.schemas.agent import AgentChatRequest


async def run_agent(
    user_id: str,
    request: AgentChatRequest,
    db_session,
    background_tasks,
):
    """Execute agent with its system prompt and config."""
    from sqlalchemy import select
    from app.models.agent import Agent
    from app.services.chat_service import _get_or_create_conversation, _save_message, _build_context, get_llm_client
    from app.schemas.chat import ChatResponse, MessageResponse

    result = await db_session.execute(
        select(Agent).where(Agent.id == request.agent_id, Agent.user_id == user_id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise ValueError("Agent not found")

    conversation = await _get_or_create_conversation(user_id, request, db_session)
    user_message = await _save_message(conversation.id, "user", request.message, db_session)

    messages = [{"role": "system", "content": agent.system_prompt or ""}]
    messages += await _build_context(conversation.id, db_session)

    client = get_llm_client()
    response = await client.chat.completions.create(
        model=agent.config.get("model", "deepseek-chat"),
        messages=messages,
        temperature=agent.config.get("temperature", 0.7),
    )
    assistant_content = response.choices[0].message.content or ""
    assistant_message = await _save_message(conversation.id, "assistant", assistant_content, db_session)

    return ChatResponse(
        conversation_id=conversation.id,
        message=MessageResponse.model_validate(user_message),
        response=MessageResponse.model_validate(assistant_message),
    )
