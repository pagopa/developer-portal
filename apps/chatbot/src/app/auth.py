import logging

from fastapi import HTTPException

from src.app.jwt_check import verify_jwt

LOGGER = logging.getLogger(__name__)


def current_user_id(authorization: str | None = None) -> str:
    if authorization is None:
        LOGGER.error("[current_user_id] Authorization header is missing, exit with 401")
        raise HTTPException(status_code=401, detail="Unauthorized")
    else:
        token = authorization.split(" ")[1]
        decoded = verify_jwt(token)
        if decoded is False:
            LOGGER.error("[current_user_id] decoded is false, exit with 401")
            raise HTTPException(status_code=401, detail="Unauthorized")
        else:
            if "cognito:username" in decoded:
                return decoded["cognito:username"]
            else:
                return decoded["username"]
