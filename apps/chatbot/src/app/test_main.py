import os
import datetime
import requests
import boto3
from requests_auth_aws_sigv4 import AWSSigV4
from jose import jwt
from fastapi.testclient import TestClient
from src.app.main import app
from src.app.mock_cognito_jwt import mock_signup_and_get_jwt

client = TestClient(app)

def get_moto_jwks():
    """Fetch JWKS from Moto using an AWS SigV4 signed request."""
    MOTO_URL = "http://motoserver:3001"

    session = boto3.Session(
        aws_access_key_id="mock_access_key",
        aws_secret_access_key="mock_secret_key",
        region_name="eu-south-1"
    )

    auth = AWSSigV4("cognito-idp", session=session)
    response = requests.get(f"{MOTO_URL}/.well-known/jwks.json", auth=auth)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch JWKS: {response.text}")

def verify_moto_jwt(token: str):
    """Verify JWT against Moto's JWKS."""
    jwks = get_moto_jwks()
    public_keys = {key["kid"]: key for key in jwks["keys"]}

    try:
        headers = jwt.get_unverified_header(token)
        kid = headers["kid"]
        if kid not in public_keys:
            raise HTTPException(status_code=401, detail="Invalid token key")

        public_key = jwt.algorithms.ECAlgorithm.from_jwk(public_keys[kid])
        
        decoded = jwt.decode(token, public_key, algorithms=["ES256"], audience=None)
        return decoded
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def test_get_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"message": "OK"}

def test_post_queries():
    response = client.post(
        "/queries",
        json={
            "question": "come ti chiami?",
            "queriedAt": "2024-11-11"
        }
    )
    # response example
    # {
    #   "id": '8a0f7f9a-b794-483e-9e09-809c31b75334', 
    #   "sessionId": "f163a47d-12b4-483d-9847-df6147a84370", 
    #   "question": "come ti chiami?", 
    #   "answer": "Scusa, non sono riuscito ad elaborare questa domanda.\nChiedimi un'altra domanda.", 
    #   "createdAt": "2024-11-19T10:02:13.348758+00:00", 
    #   "queriedAt": "2024-11-11", 
    #   "badAnswer": False
    # }
    assert response.status_code == 200
    json = response.json()
    assert 'id' in json.keys()
    assert 'sessionId' in json.keys()
    assert 'question' in json.keys()
    assert 'answer' in json.keys()
    assert 'createdAt' in json.keys()
    assert 'queriedAt' in json.keys()
    assert 'badAnswer' in json.keys()

def test_get_queries_no_auth():
    response = client.get(
        "/queries"
    )
    assert response.status_code == 401

def test_get_queries():
    response = client.get(
        "/queries",
        headers={"Authorization": f"Bearer {mock_signup_and_get_jwt()}"}
    )
    # json = response.json()
    assert response.status_code == 200

