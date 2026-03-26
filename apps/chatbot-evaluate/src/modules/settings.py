import boto3
import os
import json
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger


LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
AWS_SESSION = boto3.Session()
AWS_SSM_CLIENT = AWS_SESSION.client("ssm")


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
        response = AWS_SSM_CLIENT.get_parameter(Name=name, WithDecryption=True)
        value = response["Parameter"]["Value"]
    except AWS_SSM_CLIENT.exceptions.ParameterNotFound:
        LOGGER.warning(
            f"Parameter {name} not found in SSM, returning default: {default}"
        )
        return default

    return value


GOOGLE_SERVICE_ACCOUNT = get_ssm_parameter(
    os.getenv("CHB_AWS_SSM_GOOGLE_SERVICE_ACCOUNT")
)
if GOOGLE_SERVICE_ACCOUNT is None:
    with open(os.path.join(ROOT, ".google_service_account.json"), "r") as file:
        GOOGLE_JSON_ACCOUNT_INFO = json.load(file)
else:
    GOOGLE_JSON_ACCOUNT_INFO = json.loads(GOOGLE_SERVICE_ACCOUNT)


class ChatbotSettings(BaseSettings):
    """Settings for the chatbot evaluation."""

    # api
    environment: str = os.getenv("ENVIRONMENT", os.getenv("environment", "local"))
    aws_endpoint_url: str | None = os.getenv("AWS_ENDPOINT_URL")
    log_level: str = os.getenv("LOG_LEVEL", "info")

    # models settings
    embed_batch_size: int = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))
    embed_dim: int = int(os.getenv("CHB_EMBEDDING_DIM", "768"))
    embed_model_id: str = os.getenv("CHB_EMBED_MODEL_ID", "gemini-embedding-001")
    embed_task_type: str = "SEMANTIC_SIMILARITY"
    google_service_account: dict = GOOGLE_JSON_ACCOUNT_INFO
    max_tokens: int = int(os.getenv("CHB_MODEL_MAXTOKENS", "2048"))
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    provider: str = os.getenv("CHB_PROVIDER", "google")
    temperature: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.0"))
    vertexai_location: str = os.getenv("CHB_VERTEXAI_LOCATION", "europe-west8")

    # prompts
    condense_prompt_str: str = PROMPTS["condense_prompt_str"]

    # ragas settings
    max_retries: int = int(os.getenv("RAGAS_MAX_RETRIES", "3"))
    max_workers: int = int(os.getenv("RAGAS_MAX_WORKERS", "2"))

    # sqs
    aws_sqs_queue_monitor_name: str = os.getenv(
        "CHB_AWS_SQS_QUEUE_MONITOR_NAME", "chatbot-monitor"
    )
    aws_sqs_queue_evaluate_name: str = os.getenv(
        "CHB_AWS_SQS_QUEUE_EVALUATE_NAME", "chatbot-evaluate"
    )


SETTINGS = ChatbotSettings()
