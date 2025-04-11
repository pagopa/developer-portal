from fastapi.testclient import TestClient
from moto import mock_aws
from src.app.main import app

client = TestClient(app)


@mock_aws
def test_get_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"message": "OK"}