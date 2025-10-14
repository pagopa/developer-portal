import os
import boto3
import json
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger


LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
AWS_SESSION = boto3.Session()
SSM_CLIENT = AWS_SESSION.client("ssm")


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """

    LOGGER.info(f"get_ssm_parameter {name}...")

    if name is None:
        name = "/none/param"
    try:
        # Get the requested parameter
        response = SSM_CLIENT.get_parameter(Name=name, WithDecryption=True)
        value = response["Parameter"]["Value"]
    except SSM_CLIENT.exceptions.ParameterNotFound:
        LOGGER.warning(
            f"Parameter {name} not found in SSM, returning default: {default}"
        )
        return default

    return value


def put_ssm_parameter(name: str, value: str) -> None:
    """
    Puts a specific value into AWS Systems Manager's Parameter Store.
    :param name: The name of the parameter to put.
    :param value: The value to store in the parameter.
    """

    LOGGER.debug(f"Putting parameter {name} to SSM")
    try:
        SSM_CLIENT.put_parameter(
            Name=name,
            Value=value,
            Type="String",
            Overwrite=True,
        )
    except Exception as e:
        LOGGER.error(e)


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

    aws_region_cognito: str = os.getenv(
        "CHB_AWS_REGION_COGNITO", os.getenv("AWS_REGION")
    )
    auth_cognito_userpool_id: str = os.getenv("AUTH_COGNITO_USERPOOL_ID", "")

    # api keys
    google_api_key: str = get_ssm_parameter(
        name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
        default=os.getenv("CHB_AWS_GOOGLE_API_KEY"),
    )
    google_service_account: dict = GOOGLE_JSON_ACCOUNT_INFO
    strapi_api_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_STRAPI_API_KEY"), os.getenv("CHB_STRAPI_API_KEY", "")
    )
    langfuse_host: str = os.getenv("CHB_LANGFUSE_HOST")
    langfuse_public_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY"),
        os.getenv("LANGFUSE_INIT_PROJECT_PUBLIC_KEY"),
    )
    langfuse_secret_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_LANGFUSE_SECRET_KEY"),
        os.getenv("LANGFUSE_INIT_PROJECT_SECRET_KEY"),
    )

    # RAG settings
    embed_batch_size: int = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))
    embed_dim: int = int(os.getenv("CHB_EMBEDDING_DIM", "768"))
    embed_model_id: str = os.getenv("CHB_EMBED_MODEL_ID", "gemini-embedding-001")
    embed_retries: int = int(os.getenv("CHB_EMBED_RETRIES", "3"))
    embed_retry_min_seconds: float = float(
        os.getenv("CHB_EMBED_RETRY_MIN_SECONDS", "1")
    )
    embed_task: str = "RETRIEVAL_QUERY"
    max_tokens: int = os.getenv("CHB_MODEL_MAXTOKENS", "2048")
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    provider: str = os.getenv("CHB_PROVIDER", "google")
    reranker_id: str = os.getenv("CHB_RERANKER_ID", "semantic-ranker-default-004")
    similarity_topk: int = int(os.getenv("CHB_ENGINE_SIMILARITY_TOPK", "5"))
    temperature_agent: float = 0.5
    temperature_rag: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))
    use_async: bool = os.getenv("CHB_ENGINE_USE_ASYNC", "True").lower() == "true"

    # vector index and docs params
    chunk_overlap: int = PARAMS["vector_index"]["chunk_overlap"]
    chunk_size: int = PARAMS["vector_index"]["chunk_size"]
    index_id: str = PARAMS["vector_index"]["index_id"]
    presidio_config: dict = PARAMS["config_presidio"]
    bucket_static_content: str = os.getenv(
        "CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT", "devportal-d-website-static-content"
    )

    # prompts
    identity_prompt_str: str = PROMPTS["identity_prompt_str"]
    qa_prompt_str: str = PROMPTS["qa_prompt_str"]
    react_system_str: str = PROMPTS["react_system_header_str"]
    refine_prompt_str: str = PROMPTS["refine_prompt_str"]

    # urls
    redis_url: str = os.getenv("CHB_REDIS_URL")
    website_url: str = os.getenv("CHB_WEBSITE_URL")


SETTINGS = ChatbotSettings()
