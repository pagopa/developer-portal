from botocore.exceptions import BotoCoreError, ClientError  # noqa: F401
from boto3.dynamodb.conditions import Key  # noqa: F401

from src.modules import AWS_SESSION, SETTINGS

dynamodb = AWS_SESSION.resource("dynamodb")

tables = {
    "queries": dynamodb.Table(f"{SETTINGS.query_table_prefix}-queries"),
    "sessions": dynamodb.Table(f"{SETTINGS.query_table_prefix}-sessions"),
    "salts": dynamodb.Table(f"{SETTINGS.query_table_prefix}-salts"),
}
