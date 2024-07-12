import yaml
from fastapi import FastAPI
from pydantic import BaseModel
from src.modules.chatbot import Chatbot

params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))

chatbot = Chatbot(params, prompts)

class Query(BaseModel):
  sessionId: str | None = None
  question: str
  queriedAt: str | None = None

app = FastAPI()

@app.get("/healthz")
async def healthz ():
  return {"message": "OK"}

@app.post("/queries")
async def queryCreation (query: Query):
  response = chatbot.generate(query.question)

  return {"response": response}
