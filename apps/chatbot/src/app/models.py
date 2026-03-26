from decimal import Decimal
from pydantic import BaseModel, Field
from typing import List
from src.modules.settings import AWS_SESSION, SETTINGS


class QueryFromThePast(BaseModel):
    id: str | None = None
    question: str = Field(max_length=800)
    answer: str | None = None


class Query(BaseModel):
    question: str = Field(max_length=800)
    queriedAt: str | None = None
    history: List[QueryFromThePast] | None = None
    knowledge_base: str | None = None


class Feedback(BaseModel):
    user_response_relevancy: Decimal | None = None
    user_faithfullness: Decimal | None = None
    user_comment: str | None = None


class QueryFeedback(BaseModel):
    badAnswer: bool = False
    feedback: Feedback | None = None


class Chip(BaseModel):
    label: str
    question: str
    knowledgeBase: str


class QueryResponse(BaseModel):
    id: str
    sessionId: str
    question: str
    answer: str
    createdAt: str
    createdAtDate: str
    queriedAt: str
    badAnswer: bool = False
    chips: List[Chip] = Field(default_factory=list)


dynamodb = AWS_SESSION.resource("dynamodb")

tables = {
    "queries": dynamodb.Table(f"{SETTINGS.query_table_prefix}-queries"),
    "sessions": dynamodb.Table(f"{SETTINGS.query_table_prefix}-sessions"),
    "salts": dynamodb.Table(f"{SETTINGS.query_table_prefix}-salts"),
}
