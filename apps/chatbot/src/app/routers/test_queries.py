import os
from fastapi.testclient import TestClient
from moto import mock_aws
from src.app.main import app
from src.app.mock_aws_services import mock_signup

cognito_mock = mock_signup()
os.environ["AUTH_COGNITO_USERPOOL_ID"] = cognito_mock["user_pool_id"]
client = TestClient(app)


def post_queries(data: dict):
    response = client.post(
        "/queries",
        json=data,
        headers={"Authorization": f"Bearer {cognito_mock['access_token']}"}
    )
    return response


@mock_aws
def test_post_queries():
    data = {
        "question": "come ti chiami?",
        "queriedAt": "2024-11-11"
    }
    response = post_queries(data)

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
    assert response.status_code == 200
