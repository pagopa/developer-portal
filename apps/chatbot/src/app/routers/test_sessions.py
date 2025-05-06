import os
from fastapi.testclient import TestClient
from moto import mock_aws
from src.app.main import app
from src.app.mock_aws_services import mock_signup
from src.app.routers.test_queries import post_queries

cognito_mock = mock_signup()
os.environ["AUTH_COGNITO_USERPOOL_ID"] = cognito_mock["user_pool_id"]

client = TestClient(app)


@mock_aws
def test_query_feedback() -> None:
    query_data = {
        "question": "come ti chiami?",
        "queriedAt": "2024-11-11"
    }
    response_queries = post_queries(query_data)
    json_queries = response_queries.json()
    sessionId = json_queries['sessionId']
    id = json_queries['id']

    response = client.patch(
        f"/sessions/{sessionId}/queries/{id}",
        json={
            "badAnswer": True,
            "feedback": {
                "user_response_relevancy": 0.2,
                "user_faithfullness": 0.4,
                "user_comment": "I don't like it"
            }
        },
        headers={"Authorization": f"Bearer {cognito_mock['access_token']}"}
    )

    json = response.json()
    assert response.status_code == 200
    assert 'id' in json.keys()
    assert 'sessionId' in json.keys()
    assert 'question' in json.keys()
    assert 'answer' in json.keys()
    assert 'createdAt' in json.keys()
    assert 'queriedAt' in json.keys()
    assert 'badAnswer' in json.keys()
    assert 'feedback' in json.keys()

@mock_aws
def test_query_feedback_with_null_values() -> None:
    query_data = {
        "question": "come ti chiami?",
        "queriedAt": "2024-11-11"
    }
    response_queries = post_queries(query_data)
    json_queries = response_queries.json()
    sessionId = json_queries['sessionId']
    id = json_queries['id']

    response = client.patch(
        f"/sessions/{sessionId}/queries/{id}",
        json={
            "badAnswer": True,
            "feedback":{
                "user_response_relevancy": None,
                "user_faithfullness": None,
                "user_comment": ""
            }
        },
        headers={"Authorization": f"Bearer {cognito_mock['access_token']}"}
    )

    json = response.json()
    assert response.status_code == 200
    assert 'id' in json.keys()
    assert 'sessionId' in json.keys()
    assert 'question' in json.keys()
    assert 'answer' in json.keys()
    assert 'createdAt' in json.keys()
    assert 'queriedAt' in json.keys()
    assert 'badAnswer' in json.keys()
    assert 'feedback' in json.keys()


@mock_aws
def test_query_feedback_with_only_bad_answer() -> None:
    query_data = {
        "question": "come ti chiami?",
        "queriedAt": "2024-11-11"
    }
    response_queries = post_queries(query_data)
    json_queries = response_queries.json()
    sessionId = json_queries['sessionId']
    id = json_queries['id']

    response = client.patch(
        f"/sessions/{sessionId}/queries/{id}",
        json={
            "badAnswer": True
        },
        headers={"Authorization": f"Bearer {cognito_mock['access_token']}"}
    )

    json = response.json()
    assert response.status_code == 200
    assert 'id' in json.keys()
    assert 'sessionId' in json.keys()
    assert 'question' in json.keys()
    assert 'answer' in json.keys()
    assert 'createdAt' in json.keys()
    assert 'queriedAt' in json.keys()
    assert 'badAnswer' in json.keys()
