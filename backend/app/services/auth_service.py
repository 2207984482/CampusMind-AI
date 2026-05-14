from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import Conflict, Unauthorized
from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
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

    async def login(self, data: UserLoginRequest) -> TokenResponse:
        user = await self.db.scalar(select(User).where(User.email == data.email))
        if not user or not verify_password(data.password, user.hashed_password):
            raise Unauthorized("Invalid email or password")
        if not user.is_active:
            raise Unauthorized("Account is disabled")

        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id)),
        )

    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        from app.core.security import decode_token

        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh" or not payload.get("sub"):
            raise Unauthorized("Invalid refresh token")

        user = await self.db.scalar(select(User).where(User.id == payload["sub"]))
        if not user or not user.is_active:
            raise Unauthorized("User not found or disabled")

        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id)),
        )

    async def get_current_user(self, user_id: str) -> UserResponse:
        user = await self.db.scalar(select(User).where(User.id == user_id))
        if not user:
            raise Unauthorized("User not found")
        return UserResponse.model_validate(user)
