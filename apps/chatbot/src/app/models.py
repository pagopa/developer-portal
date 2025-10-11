import boto3

from decimal import Decimal
from pydantic import BaseModel, Field
from typing import List

from src.modules.settings import SETTINGS


class QueryFromThePast(BaseModel):
    id: str | None = None
    question: str = Field(max_length=800)
    answer: str | None = None


class Query(BaseModel):
    question: str = Field(max_length=800)
    queriedAt: str | None = None
    history: List[QueryFromThePast] | None = None


class Feedback(BaseModel):
    user_response_relevancy: Decimal | None = None
    user_faithfullness: Decimal | None = None
    user_comment: str | None = None


class QueryFeedback(BaseModel):
    badAnswer: bool = False
    feedback: Feedback | None = None


boto3_session = boto3.session.Session(region_name=SETTINGS.aws_default_region)

dynamodb = boto3_session.resource(
    "dynamodb",
    region_name=SETTINGS.aws_default_region,
    endpoint_url=SETTINGS.dynamodb_url,
)


tables = {
    "queries": dynamodb.Table(f"{SETTINGS.table_prefix}-queries"),
    "sessions": dynamodb.Table(f"{SETTINGS.table_prefix}-sessions"),
    "salts": dynamodb.Table(f"{SETTINGS.table_prefix}-salts"),
}
