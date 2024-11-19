from fastapi.testclient import TestClient
from src.app.main import app

client = TestClient(app)

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
