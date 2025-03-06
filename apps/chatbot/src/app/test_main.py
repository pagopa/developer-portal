from fastapi.testclient import TestClient
from src.app.main import app

client = TestClient(app)

def test_get_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"message": "OK"}

