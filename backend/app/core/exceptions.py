from fastapi import HTTPException, status


class AppException(HTTPException):
    def __init__(self, code: int, message: str, status_code: int = 400):
        self.code = code
        super().__init__(status_code=status_code, detail={"code": code, "message": message, "data": None})


class Unauthorized(AppException):
    def __init__(self, message: str = "Not authenticated"):
        super().__init__(code=40100, message=message, status_code=status.HTTP_401_UNAUTHORIZED)


class Forbidden(AppException):
    def __init__(self, message: str = "Permission denied"):
        super().__init__(code=40300, message=message, status_code=status.HTTP_403_FORBIDDEN)


class NotFound(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(code=40400, message=message, status_code=status.HTTP_404_NOT_FOUND)


class Conflict(AppException):
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(code=40900, message=message, status_code=status.HTTP_409_CONFLICT)


class BadRequest(AppException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(code=40000, message=message, status_code=status.HTTP_400_BAD_REQUEST)
