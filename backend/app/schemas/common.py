from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    code: int = 0
    message: str = "ok"
    data: T | None = None


class PaginatedResponse(APIResponse[T]):
    total: int = 0
    page: int = 1
    page_size: int = 20


class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20
