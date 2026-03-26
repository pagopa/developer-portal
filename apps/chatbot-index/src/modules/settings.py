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
PARAMS = yaml.safe_load(
    Path(os.path.join(ROOT, "config", "params.yaml")).read_text(encoding="utf-8")
)
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
    """Settings for the chatbot application."""

    # models settings
    embed_batch_size: int = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))
    embed_dim: int = int(os.getenv("CHB_EMBEDDING_DIM", "768"))
    embed_model_id: str = os.getenv("CHB_EMBED_MODEL_ID", "gemini-embedding-001")
    embed_retries: int = int(os.getenv("CHB_EMBED_RETRIES", "30"))
    embed_retry_min_seconds: float = float(
        os.getenv("CHB_EMBED_RETRY_MIN_SECONDS", "1.5")
    )
    embed_task_docs: str = "RETRIEVAL_DOCUMENT"
    google_service_account: dict = GOOGLE_JSON_ACCOUNT_INFO
    vertexai_location: str = os.getenv("CHB_VERTEXAI_LOCATION", "europe-west8")

    # RAG settings
    max_tokens: int = int(os.getenv("CHB_MODEL_MAXTOKENS", "2048"))
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    provider: str = os.getenv("CHB_PROVIDER", "google")
    temperature_rag: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))

    # vector index and docs params
    chunk_overlap: int = PARAMS["vector_index"]["chunk_overlap"]
    chunk_size: int = PARAMS["vector_index"]["chunk_size"]
    index_id: str = os.getenv("CHB_INDEX_ID", "devportal-index")
    bucket_static_content: str = os.getenv(
        "CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT", "devportal-d-website-static-content"
    )

    # urls
    redis_url: str = os.getenv("CHB_REDIS_URL")
    website_url: str = os.getenv("CHB_WEBSITE_URL")

    # other
    language_code: str = os.getenv("CHB_LANGUAGE_CODE_STATIC_FILES", "it")


SETTINGS = ChatbotSettings()
