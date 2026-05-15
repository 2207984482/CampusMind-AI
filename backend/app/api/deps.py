from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import Forbidden, Unauthorized
from app.core.security import decode_token
from app.models.user import User


async def get_current_user_id(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise Unauthorized("Missing or invalid authorization header")

    token = auth.split(" ", 1)[1]
    payload = decode_token(token)
    if payload.get("type") != "access" or not payload.get("sub"):
        raise Unauthorized("Invalid or expired access token")

    return payload["sub"]


async def get_current_admin_user(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> str:
    user = await db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise Unauthorized("User not found")
    if user.role != "admin" and not user.is_superuser:
        raise Forbidden("Admin access required")
    return user_id
