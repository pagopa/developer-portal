import jwt
import datetime
from fastapi.testclient import TestClient
from src.app.main import app

client = TestClient(app)

def create_token():
  with open("private.pem", "r") as f:
    private_key = f.read()

  AWS_REGION = os.getenv('CHB_AWS_DEFAULT_REGION', 'eu-south-1')
  USER_POOL_ID = '1'
  payload = {
    "sub": "test-user-id",
    "event_id": "test-event",
    "token_use": "id",
    "auth_time": int(datetime.datetime.utcnow().timestamp()),
    "iss": f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{USER_POOL_ID}",
    "exp": int((datetime.datetime.utcnow() + datetime.timedelta(hours=16)).timestamp()),
    "iat": int(datetime.datetime.utcnow().timestamp()),
    "email": "test@example.com",
    "username": "testuser"
  }
  token = jwt.encode(payload, private_key, algorithm="RS256")
  return token


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

def test_get_queries():
  response = client.get(
    "/queries"
  )
  # json = response.json()
  assert response.status_code == 200

