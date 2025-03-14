import os
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
