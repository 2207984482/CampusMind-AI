from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.core.database import get_db
from app.core.exceptions import NotFound
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.user import UserResponse, UserUpdateRequest

router = APIRouter()


@router.get("/me", response_model=APIResponse[UserResponse])
async def get_me(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise NotFound("User not found")
    return APIResponse(data=UserResponse.model_validate(user))


@router.patch("/me", response_model=APIResponse[UserResponse])
async def update_me(
    data: UserUpdateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise NotFound("User not found")

    if data.username is not None:
        existing = await db.scalar(select(User).where(User.username == data.username, User.id != user_id))
        if existing:
            from app.core.exceptions import Conflict
            raise Conflict("Username already taken")
        user.username = data.username
    if data.avatar_url is not None:
        user.avatar_url = data.avatar_url

    await db.flush()
    await db.refresh(user)
    return APIResponse(data=UserResponse.model_validate(user))
