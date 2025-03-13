import os
import datetime
import requests
import boto3
from moto import mock_aws
from requests_auth_aws_sigv4 import AWSSigV4
from jose import jwt, jwk
from jose import exceptions as jwt_exceptions
from jose.utils import base64url_decode
from fastapi.testclient import TestClient
from src.app.main import app
from src.app.mock_cognito import mock_signup

client = TestClient(app)

cognito_mock = mock_signup()
os.environ["AUTH_COGNITO_USERPOOL_ID"] = cognito_mock["user_pool_id"]


def test_get_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"message": "OK"}

@mock_aws
def test_post_queries():
    response = client.post(
        "/queries",
        json={
            "question": "come ti chiami?",
            "queriedAt": "2024-11-11"
        },
        headers={"Authorization": f"Bearer {cognito_mock['access_token']}"}
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
    json = response.json()
    assert response.status_code == 200
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

@mock_aws
def test_get_queries():
    response = client.get(
        "/queries",
        headers={"Authorization": f"Bearer {cognito_mock['access_token']}"}
    )
    # json = response.json()
    assert response.status_code == 200

