import yaml
import mangum
import uvicorn
import json
import logging
import os
import uuid
import boto3
from botocore.config import Config
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.modules.chatbot import Chatbot

# logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logging.getLogger().setLevel(os.getenv("LOG_LEVEL", "INFO"))

params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))

class Query(BaseModel):
  sessionId: str | None = None
  question: str
  queriedAt: str | None = None

dynamodb = boto3.resource(
  'dynamodb',
  region_name=os.getenv('CHB_AWS_DEFAULT_REGION'),
  aws_access_key_id=os.getenv('CHB_AWS_ACCESS_KEY_ID'),
  aws_secret_access_key=os.getenv('CHB_AWS_SECRET_ACCESS_KEY')
)
# TODO: use ENV var for table name
CHATBOT_QUERY_TABLE_NAME = 'chatbot-dev-queries'
chatbot_queries = dynamodb.Table(CHATBOT_QUERY_TABLE_NAME)

# FastAPI config
app = FastAPI()
origins = json.loads(os.getenv("CORS_DOMAINS"))
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
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

  body = {
    "id": f'{uuid.uuid4()}',
    "sessionId": "",
    "question": query.question,
    "answer": answer,
    "createdAt": query.queriedAt,
    "queriedAt": query.queriedAt
  }
  # TODO: body validation
  db_response = chatbot_queries.put_item(Item = body)
  logging.info(f"[query_creation] db response: {db_response['ResponseMetadata']}")
  return body

@app.post("/sessions")
async def sessions_creation ():
  # TODO: dynamoDB integration
  # TODO: get current user from cognito
  body = {
    "id": "",
    "title": "",
    "createdAt": ""
  }
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
  # TODO: dynamoDB integration
  body = [
    {
      "id": "",
      "sessionId": sessionId,
      "question": "",
      "answer": "",
      "createdAt": "",
      "queriedAt": ""
    }
  ]
  return body

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
    uvicorn.run("main:app", host="0.0.0.0", port=8080, log_level="info")
