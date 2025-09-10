import boto3
import os
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger

LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", os.getenv("CHB_AWS_ACCESS_KEY_ID"))
AWS_DEFAULT_REGION = os.getenv("AWS_REGION", os.getenv("CHB_AWS_DEFAULT_REGION"))
AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL")
AWS_SECRET_ACCESS_KEY = os.getenv(
    "AWS_SECRET_ACCESS_KEY", os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
)
SSM_CLIENT = boto3.client(
    "ssm",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_DEFAULT_REGION,
    endpoint_url=AWS_ENDPOINT_URL,
)


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """

    if name is None:
        name = "none-params-in-ssm"
    try:
        response = SSM_CLIENT.get_parameter(Name=name, WithDecryption=True)
        value = response["Parameter"]["Value"]
    except SSM_CLIENT.exceptions.ParameterNotFound:
        return default

    return value


class ChatbotSettings(BaseSettings):
    # AWS SSM based values
    @property
    def langfuse_public_key(self) -> str:
        return get_ssm_parameter(
            name=os.getenv("CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY"),
            default=os.getenv("LANGFUSE_INIT_PROJECT_PUBLIC_KEY"),
        )

    @property
    def langfuse_secret_key(self) -> str:
        return get_ssm_parameter(
            name=os.getenv("CHB_AWS_SSM_LANGFUSE_SECRET_KEY"),
            default=os.getenv("LANGFUSE_INIT_PROJECT_SECRET_KEY"),
        )

    @property
    def index_id(self) -> str:
        return get_ssm_parameter(
            name=os.getenv("CHB_AWS_SSM_LLAMAINDEX_INDEX_ID"),
            default="default-index",
        )

    # general
    environment: str = os.getenv("environment", "dev")
    cors_domains: str = os.getenv("CORS_DOMAINS", '["*"]')
    log_level: str = os.getenv("LOG_LEVEL", "info")

    # api keys
    aws_access_key_id: str = AWS_ACCESS_KEY_ID
    aws_default_region: str = AWS_DEFAULT_REGION
    aws_endpoint_url: str | None = AWS_ENDPOINT_URL
    aws_secret_access_key: str = AWS_SECRET_ACCESS_KEY

    # urls
    dynamodb_url: str = os.getenv("AWS_ENDPOINT_URL_DYNAMODB")
    langfuse_host: str = os.getenv("CHB_LANGFUSE_HOST")

    # controller logic
    max_daily_evaluations: int = int(os.getenv("CHB_MAX_DAILY_EVALUATIONS", "200"))
    session_max_duration_days: float = float(
        os.getenv("CHB_SESSION_MAX_DURATION_DAYS", "1")
    )
    table_prefix: str = os.getenv("CHB_QUERY_TABLE_PREFIX", "chatbot")
    chatbot_generate_lambda_name: str = os.getenv(
        "CHB_CHATBOT_GENERATE_LAMBDA_NAME", "local"
    )
    chatbot_mask_pii_lambda_name: str = os.getenv(
        "CHB_CHATBOT_MASK_PII_LAMBDA_NAME", "local"
    )
    aws_sqs_queue_evaluate_name: str = os.getenv(
        "CHB_AWS_SQS_QUEUE_EVALUATE_NAME", "chatbot-evaluate"
    )
    auth_cognito_userpool_id: str = os.getenv("AUTH_COGNITO_USERPOOL_ID", "")
    auth_cognito_url: str = os.getenv("AUTH_COGNITO_URL", "")

    # database
    expire_days: int = int(os.getenv("EXPIRE_DAYS", 90))


SETTINGS = ChatbotSettings()
