from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_get_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"message": "OK"}

def test_post_queries():
    response = client.post("/queries")
    assert response.status_code == 200
    item = {}
    assert response.json() == item
