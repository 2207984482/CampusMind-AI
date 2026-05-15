from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.user import (
    RefreshTokenRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=APIResponse[UserResponse])
async def register(data: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    user = await service.register(data)
    return APIResponse(data=user)


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(data: UserLoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    tokens = await service.login(data, request=request)
    return APIResponse(data=tokens)


@router.post("/refresh", response_model=APIResponse[TokenResponse])
async def refresh(data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    tokens = await service.refresh_token(data.refresh_token)
    return APIResponse(data=tokens)


@router.get("/me", response_model=APIResponse[UserResponse])
async def me(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    user = await service.get_current_user(user_id)
    return APIResponse(data=user)
