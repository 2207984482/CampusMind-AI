from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import router as v1_router
from app.core.config import settings
from app.core.exceptions import AppError
from app.core.redis import close_redis, init_redis
from app.middleware.logging import logging_middleware


@asynccontextmanager
async def lifespan(application: FastAPI):
    await init_redis()
    yield
    await close_redis()


app = FastAPI(
    title="CampusMind AI",
    description="AI-powered campus assistant platform — chat, RAG knowledge base, multi-agent system, PDF analysis",
    version="0.1.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(logging_middleware)


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(status_code=exc.status_code, content=exc.to_dict())


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"code": 50000, "message": "Internal server error", "data": None},
    )


app.include_router(v1_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
