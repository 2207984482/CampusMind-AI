from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.core.database import get_db
from app.schemas.agent import (
    AgentChatRequest,
    AgentCreate,
    AgentListResponse,
    AgentResponse,
    AgentUpdate,
)

router = APIRouter()


@router.post("", response_model=AgentResponse, status_code=201)
async def create_agent(
    request: AgentCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from app.models.agent import Agent
    agent = Agent(
        user_id=user_id,
        name=request.name,
        description=request.description,
        agent_type=request.agent_type,
        system_prompt=request.system_prompt,
        config=request.config,
        is_public=request.is_public,
    )
    db.add(agent)
    await db.flush()
    await db.commit()
    return AgentResponse.model_validate(agent)


@router.get("", response_model=AgentListResponse)
async def list_agents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    agent_type: str | None = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import func, or_, select
    from app.models.agent import Agent

    conditions = [or_(Agent.user_id == user_id, Agent.is_public == True)]
    if agent_type:
        conditions.append(Agent.agent_type == agent_type)

    count_result = await db.execute(select(func.count()).where(*conditions))
    total = count_result.scalar() or 0
    result = await db.execute(
        select(Agent)
        .where(*conditions)
        .order_by(Agent.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    agents = result.scalars().all()
    return AgentListResponse(
        agents=[AgentResponse.model_validate(a) for a in agents],
        total=total,
    )


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import or_, select
    from app.models.agent import Agent

    result = await db.execute(
        select(Agent).where(
            Agent.id == agent_id,
            or_(Agent.user_id == user_id, Agent.is_public == True),
        )
    )
    agent = result.scalar_one_or_none()
    if not agent:
        return {"code": 40400, "message": "Agent not found"}
    return AgentResponse.model_validate(agent)


@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    request: AgentUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select, update
    from app.models.agent import Agent

    result = await db.execute(select(Agent).where(Agent.id == agent_id, Agent.user_id == user_id))
    agent = result.scalar_one_or_none()
    if not agent:
        return {"code": 40400, "message": "Agent not found"}

    update_data = request.model_dump(exclude_none=True)
    await db.execute(update(Agent).where(Agent.id == agent_id).values(**update_data))
    await db.commit()
    await db.refresh(agent)
    return AgentResponse.model_validate(agent)


@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import delete, select
    from app.models.agent import Agent

    result = await db.execute(select(Agent).where(Agent.id == agent_id, Agent.user_id == user_id))
    if not result.scalar_one_or_none():
        return {"code": 40400, "message": "Agent not found"}
    await db.execute(delete(Agent).where(Agent.id == agent_id))
    await db.commit()
    return {"code": 0, "message": "ok"}


@router.post("/{agent_id}/chat")
async def chat_with_agent(
    agent_id: str,
    request: AgentChatRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    from fastapi import BackgroundTasks
    from app.services.agent_service import run_agent

    request.agent_id = agent_id
    return await run_agent(user_id, request, db, BackgroundTasks())
