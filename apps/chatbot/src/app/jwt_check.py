import os
import requests
from jose import jwk, jwt
from jose.utils import base64url_decode
from fastapi import HTTPException

AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION', os.getenv('AWS_DEFAULT_REGION', None))
AUTH_COGNITO_USERPOOL_ID = os.getenv('AUTH_COGNITO_USERPOOL_ID')

def get_jwks():
  KEYS_URL = f"https://cognito-idp.{AWS_DEFAULT_REGION}.amazonaws.com/{AWS_DEFAULT_REGION}_{AUTH_COGNITO_USERPOOL_ID}/.well-known/jwks.json"
  response = requests.get(KEYS_URL)
  if response.status_code == 200:
    return response.json()
  else:
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

        message, encoded_signature = str(token).rsplit('.', 1)
        decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
        if not public_key.verify(message.encode("utf8"), decoded_signature):
            raise HTTPException(status_code=401, detail="error in public_key.verify")

        # since we passed the verification, we can now safely use the unverified claims
        claims = jwt.get_unverified_claims(token)
        return claims
    except jwt_exceptions.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt_exceptions.JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

