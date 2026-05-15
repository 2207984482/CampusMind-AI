import time
from collections.abc import Callable

from fastapi import Request, Response
from loguru import logger


async def logging_middleware(request: Request, call_next: Callable) -> Response:
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} ({elapsed:.3f}s)"
    )
    return response
