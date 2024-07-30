import yaml
import mangum
import uvicorn
import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.modules.chatbot import Chatbot

logging.basicConfig(level=logging.INFO)

params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))

logging.info(f"os.getenv('CHB_AWS_ACCESS_KEY_ID') -------------->>>> {os.getenv('CHB_AWS_ACCESS_KEY_ID')}")
chatbot = Chatbot(params, prompts)

class Query(BaseModel):
  sessionId: str | None = None
  question: str
  queriedAt: str | None = None

app = FastAPI()


origins = [
  "http://localhost",
  "http://localhost:3000",
]

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
  answer = chatbot.generate(query.question)

  # TODO: dynamoDB integration
  body = {
    "id": "",
    "sessionId": "",
    "question": query.question,
    "answer": answer,
    "createdAt": query.queriedAt,
    "queriedAt": query.queriedAt
  }
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

handler = mangum.Mangum(app)

if __name__ == "__main__":
   uvicorn.run(app, host="0.0.0.0", port=8080)
