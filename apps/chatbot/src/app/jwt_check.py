import requests
from jose import jwk, jwt
from jose import exceptions as jwt_exceptions
from jose.utils import base64url_decode
from fastapi import HTTPException

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__)


def get_jwks():
    KEYS_URL = (
        f"{SETTINGS.auth_cognito_url}/"
        f"{SETTINGS.auth_cognito_userpool_id}/"
        ".well-known/jwks.json"
    )
    response = requests.get(KEYS_URL)

    if response.status_code == 200:
        return response.json()
    else:
        LOGGER.error(
            f"[get_jwks] KEYS_URL={KEYS_URL}, Response status code: {response.status_code}"
        )
        raise HTTPException(status_code=401, detail="Auth error")


def verify_jwt(token: str):
    jwks = get_jwks()
    public_keys = {key["kid"]: key for key in jwks["keys"]}

    try:
        headers = jwt.get_unverified_header(token)
        kid = headers["kid"]
        if kid not in public_keys:
            raise HTTPException(status_code=401, detail="Invalid token key")

        public_key = jwk.construct(public_keys[kid])

        message, encoded_signature = str(token).rsplit(".", 1)
        decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))
        if not public_key.verify(message.encode("utf8"), decoded_signature):
            raise HTTPException(status_code=401, detail="error in public_key.verify")

        # since we passed the verification,
        # we can now safely use the unverified claims
        claims = jwt.get_unverified_claims(token)
        return claims
    except jwt_exceptions.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt_exceptions.JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
