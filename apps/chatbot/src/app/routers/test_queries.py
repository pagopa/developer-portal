import os
from fastapi.testclient import TestClient
from src.app.main import app
from src.app.mock_aws_services import mock_signup

cognito_mock = mock_signup()
os.environ["AUTH_COGNITO_USERPOOL_ID"] = cognito_mock["user_pool_id"]

client = TestClient(app)

query_payload = {
    "question": "come ti chiami?",
    "queriedAt": "2024-11-11",
}

query_payload_history = {
    "question": "Cosa sei, una navicella spaziale?",
    "queriedAt": "2026-02-25T16:56:09.255Z",
    "history": [
        {
            "id": "9fc058603875e40643370448712266fc",
            "sessionId": "7ad4164f-33b1-4144-8e78-1602ef91fdf8",
            "question": "come ti chiami?",
            "answer": "Mi chiamo Discovery. Sono l'assistente virtuale di PagoPA S.p.A. per la documentazione per sviluppatori.",
            "createdAt": "2026-02-25T16:55:36.839716+00:00",
            "createdAtDate": "2026-02-25",
            "queriedAt": "2026-02-25T16:55:36.731Z",
            "badAnswer": False,
        }
    ],
}


def post_queries(data: dict) -> dict:
    response = client.post(
        "/queries",
        json=data,
        headers={"Authorization": f"Bearer {cognito_mock['access_token']}"},
    )
    return response


def test_post_queries() -> None:
    response = post_queries(query_payload)

    json = response.json()

    print(response.json())
    assert response.status_code == 200
    assert "id" in json.keys()
    assert "sessionId" in json.keys()
    assert "question" in json.keys()
    assert "answer" in json.keys()
    assert "createdAt" in json.keys()
    assert "queriedAt" in json.keys()
    assert "badAnswer" in json.keys()


def test_post_queries_history() -> None:
    response = post_queries(query_payload_history)

    json = response.json()

    assert response.status_code == 200
    assert "id" in json.keys()
    assert "sessionId" in json.keys()
    assert "question" in json.keys()
    assert "answer" in json.keys()
    assert "createdAt" in json.keys()
    assert "queriedAt" in json.keys()
    assert "badAnswer" in json.keys()


def test_get_queries_no_auth() -> None:
    response = client.get("/queries")
    assert response.status_code == 401


def test_get_queries() -> None:
    response = client.get(
        "/queries", headers={"Authorization": f"Bearer {cognito_mock['access_token']}"}
    )
    assert response.status_code == 200
