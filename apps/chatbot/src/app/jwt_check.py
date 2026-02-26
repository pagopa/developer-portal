import requests
from jose import jwk, jwt
from jose import exceptions as jwt_exceptions
from jose.utils import base64url_decode
from fastapi import HTTPException
from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def get_jwks():
    REGION = SETTINGS.aws_cognito_region or SETTINGS.aws_region

    # https://docs.getmoto.org/en/latest/docs/services/cognito-idp.html#cognito-idp
    if SETTINGS.environment == "test":
        KEYS_URL = (
            f"{SETTINGS.aws_endpoint_url}/"
            f"{SETTINGS.auth_cognito_userpool_id}/"
            ".well-known/jwks.json"
        )
        headers = {
            "Authorization": (
                "AWS4-HMAC-SHA256 Credential=mock_access_key/20220524/"
                f"{REGION}/cognito-idp/aws4_request, "
                "SignedHeaders=content-length;content-type;host;x-amz-date, Signature=asdf"
            )
        }
    else:
        KEYS_URL = (
            f"https://cognito-idp.{REGION}.amazonaws.com/"
            f"{SETTINGS.auth_cognito_userpool_id}/"
            ".well-known/jwks.json"
        )
        headers = None

    response = requests.get(KEYS_URL, headers=headers)

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
