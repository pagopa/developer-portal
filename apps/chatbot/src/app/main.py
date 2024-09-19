import yaml
import mangum
import uvicorn
import json
import os
import uuid
import boto3
import datetime
import jwt
from typing import Annotated
from boto3.dynamodb.conditions import Key
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import FastAPI, HTTPException, Header
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.modules.chatbot import Chatbot


params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))

class Query(BaseModel):
  sessionId: str | None = None
  question: str
  queriedAt: str | None = None

if (os.getenv('environment', 'dev') == 'local'):
  profile_name='dummy'
  endpoint_url='http://localhost:8000'

boto3_session = boto3.session.Session(
  profile_name = locals().get('profile_name', None)
)

dynamodb = boto3_session.resource(    
  'dynamodb',
  endpoint_url=locals().get('endpoint_url', None)
)

table_queries = dynamodb.Table(
  f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot-dev')}-queries"
)
table_sessions = dynamodb.Table(
  f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot-dev')}-sessions"
)

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=json.loads(os.getenv("CORS_DOMAINS", "[\"*\"]")),
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/healthz")
async def healthz ():
  return {"message": "OK"}

@app.post("/queries")
async def query_creation (query: Query):
  chatbot = Chatbot(params, prompts)

  answer = chatbot.generate(query.question)

  now = datetime.datetime.now(datetime.timezone.utc).isoformat()
  # TODO: calculate sessionId
  body = {
    "id": f'{uuid.uuid4()}',
    "sessionId": "1",
    "question": query.question,
    "answer": answer,
    "createdAt": now,
    "queriedAt": query.queriedAt
  }

  try:
    table_queries.put_item(Item = body)
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail=f"[POST /queries] error: {e}")
  return body

@app.post("/sessions")
async def sessions_creation (authorization: Annotated[str | None, Header()] = None):
  # TODO: calculate title
  if authorization:
    token = authorization.split(' ')[1]
    decoded = jwt.decode(token, algorithms=["RS256"], options={"verify_signature": False})
    userId = decoded['cognito:username']
  else:
    userId = "-"

  now = datetime.datetime.now(datetime.timezone.utc).isoformat()
  body = {
    "id": f'{uuid.uuid4()}',
    "title": "session",
    "userId": userId,
    "createdAt": now
  }
  try:
    table_sessions.put_item(Item = body)
  except (BotoCoreError, ClientError) as e:
      raise HTTPException(status_code=422, detail=f"[POST /sessions] error: {e}")
  return body

@app.get("/queries/{id}")
async def query_fetching(id: str):
  # TODO: dynamoDB integration
  body = {
    "id": id,
    "sessionId": "",
    "question": "",
    "answer": "",
    "createdAt": "",
    "queriedAt": ""
  }
  return body

# retrieve sessions of current user
@app.get("/sessions")
async def sessions_fetching():
  # TODO: dynamoDB integration
  # TODO: get current user from cognito
  body = [
    {
      "id": "",
      "title": "",
      "createdAt": ""
    }
  ]
  return body

@app.get("/queries")
async def queries_fetching(sessionId: str):
  try:
    db_response = table_queries.query(
      KeyConditionExpression=Key("sessionId").eq(sessionId)
    )
  except (BotoCoreError, ClientError) as e:
    raise HTTPException(status_code=422, detail='db error')
  return db_response['Items']

@app.patch("/queries/{id}")
async def query_feedback (badAnswer: bool):
  # TODO: dynamoDB integration
  body = {
    "id": "",
    "sessionId": "",
    "question": "",
    "answer": "",
    "badAnswer": badAnswer,
    "createdAt": "",
    "queriedAt": ""
  }
  return body

handler = mangum.Mangum(app, lifespan="off")

if __name__ == "__main__":
  uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8080,
    log_level=os.getenv("LOG_LEVEL", "info")
  )
