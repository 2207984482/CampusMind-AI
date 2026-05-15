from datetime import datetime, timedelta, timezone

from fastapi import Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import Conflict, Unauthorized
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.user import TokenResponse, UserLoginRequest, UserRegisterRequest, UserResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, data: UserRegisterRequest) -> UserResponse:
        exists = await self.db.scalar(
            select(User).where((User.email == data.email) | (User.username == data.username))
        )
        if exists:
            raise Conflict("Email or username already exists")

        user = User(
            email=data.email,
            username=data.username,
            hashed_password=hash_password(data.password),
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return UserResponse.model_validate(user)

    async def login(self, data: UserLoginRequest, request: Request | None = None) -> TokenResponse:
        user = await self.db.scalar(select(User).where(User.email == data.email))
        if not user or not verify_password(data.password, user.hashed_password):
            raise Unauthorized("Invalid email or password")
        if not user.is_active:
            raise Unauthorized("Account is disabled")

        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))

        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        token_record = RefreshToken(
            user_id=user.id,
            token_hash=hash_token(refresh_token),
            expires_at=expires_at,
            user_agent=request.headers.get("User-Agent", "") if request else "",
            ip_address=request.client.host if request and request.client else "",
        )
        self.db.add(token_record)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh" or not payload.get("sub"):
            raise Unauthorized("Invalid refresh token")

        token_hash = hash_token(refresh_token)
        old_record = await self.db.scalar(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.revoked == False,  # noqa: E712
            )
        )
        if not old_record:
            raise Unauthorized("Invalid or revoked refresh token")

        user = await self.db.scalar(select(User).where(User.id == payload["sub"]))
        if not user or not user.is_active:
            raise Unauthorized("User not found or disabled")

        old_record.revoked = True

        new_access_token = create_access_token(str(user.id))
        new_refresh_token = create_refresh_token(str(user.id))

        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        new_record = RefreshToken(
            user_id=user.id,
            token_hash=hash_token(new_refresh_token),
            expires_at=expires_at,
            user_agent=old_record.user_agent,
            ip_address=old_record.ip_address,
        )
        self.db.add(new_record)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
        )

    async def get_current_user(self, user_id: str) -> UserResponse:
        user = await self.db.scalar(select(User).where(User.id == user_id))
        if not user:
            raise Unauthorized("User not found")
        return UserResponse.model_validate(user)
