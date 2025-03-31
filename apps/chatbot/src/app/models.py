import boto3
import os

from pydantic import BaseModel, Field
from typing import List


class QueryFromThePast(BaseModel):
    id: str | None = None
    question: str = Field(max_length=800)
    answer: str | None = None


class Query(BaseModel):
    question: str = Field(max_length=800)
    queriedAt: str | None = None
    history: List[QueryFromThePast] | None = None


class QueryFeedback(BaseModel):
    badAnswer: bool


AWS_DEFAULT_REGION = os.getenv(
    'CHB_AWS_DEFAULT_REGION',
    os.getenv('AWS_DEFAULT_REGION', None)
)


boto3_session = boto3.session.Session(
  region_name=AWS_DEFAULT_REGION
)

# endpoint_url is set by AWS_ENDPOINT_URL_DYNAMODB
dynamodb = boto3_session.resource(
    'dynamodb',
    region_name=AWS_DEFAULT_REGION
)


tables = {
    "queries": dynamodb.Table(
        f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot')}-queries"
    ),
    "sessions": dynamodb.Table(
        f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot')}-sessions"
    ),
    "salts": dynamodb.Table(
        f"{os.getenv('CHB_QUERY_TABLE_PREFIX', 'chatbot')}-salts"
    )
}
