from fastapi.testclient import TestClient
from src.app.main import app

CLIENT = TestClient(app)


def test_get_healthz() -> None:
    response = CLIENT.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"message": "OK"}
    assert response.headers["Content-Type"] == "application/json"
