import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class AgentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    agent_type: str = Field(..., pattern=r"^(study_assistant|resume_helper|code_assistant|custom)$")
    system_prompt: str | None = None
    config: dict = Field(default_factory=dict)
    is_public: bool = False


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    system_prompt: str | None = None
    config: dict | None = None
    is_public: bool | None = None


class AgentResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    agent_type: str
    system_prompt: str | None
    config: dict
    is_public: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AgentListResponse(BaseModel):
    agents: list[AgentResponse]
    total: int


class AgentChatRequest(BaseModel):
    agent_id: uuid.UUID
    message: str = Field(..., min_length=1, max_length=10000)
    conversation_id: uuid.UUID | None = None
