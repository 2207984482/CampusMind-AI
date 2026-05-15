from fastapi import APIRouter

from app.api.v1 import agents, auth, chat, knowledge, users

router = APIRouter(prefix="/api/v1")
router.include_router(auth.router, prefix="/auth", tags=["Auth"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(chat.router, tags=["Chat"])
router.include_router(knowledge.router, prefix="/knowledge", tags=["Knowledge"])
router.include_router(agents.router, prefix="/agents", tags=["Agents"])
