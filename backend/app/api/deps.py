from fastapi import Request

from app.core.exceptions import Unauthorized
from app.core.security import decode_token


async def get_current_user_id(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise Unauthorized("Missing or invalid authorization header")

    token = auth.split(" ", 1)[1]
    payload = decode_token(token)
    if payload.get("type") != "access" or not payload.get("sub"):
        raise Unauthorized("Invalid or expired access token")

    return payload["sub"]
