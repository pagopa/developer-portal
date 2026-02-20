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
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
AWS_SESSION = boto3.Session()


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """

    ssm_client = AWS_SESSION.client("ssm")
    LOGGER.info(f"get_ssm_parameter {name}...")

    if name is None:
        name = "none-params-in-ssm"
    try:
        response = ssm_client.get_parameter(Name=name, WithDecryption=True)
        value = response["Parameter"]["Value"]
    except ssm_client.exceptions.ParameterNotFound:
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


def mock_user_pool_id() -> str:
    client_cognito = AWS_SESSION.client("cognito-idp")
    user_pool_response = client_cognito.create_user_pool(PoolName="test_pool")
    user_pool_id = user_pool_response["UserPool"]["Id"]
    return user_pool_id


class ChatbotSettings(BaseSettings):
    """Settings for the chatbot application."""

    # api
    environment: str = os.getenv("ENVIRONMENT", os.getenv("environment", "local"))
    aws_endpoint_url: str | None = os.getenv("AWS_ENDPOINT_URL")
    aws_cognito_region: str = os.getenv("CHB_AWS_COGNITO_REGION") or os.getenv(
        "AWS_REGION"
    )
    auth_cognito_userpool_id: str = (
        mock_user_pool_id()
        if os.getenv("ENVIRONMENT", "local") in ["test", "local"]
        else os.getenv("AUTH_COGNITO_USERPOOL_ID")
    )
    google_api_key: str = get_ssm_parameter(
        name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
        default=os.getenv("CHB_AWS_GOOGLE_API_KEY"),
    )
    google_service_account: dict = GOOGLE_JSON_ACCOUNT_INFO
    langfuse_host: str = os.getenv("CHB_LANGFUSE_HOST")
    langfuse_public_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY"),
        os.getenv("LANGFUSE_INIT_PROJECT_PUBLIC_KEY"),
    )
    langfuse_secret_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_LANGFUSE_SECRET_KEY"),
        os.getenv("LANGFUSE_INIT_PROJECT_SECRET_KEY"),
    )
    cors_domains: str = os.getenv("CORS_DOMAINS", '["*"]')
    log_level: str = os.getenv("LOG_LEVEL", "info")

    # RAG settings
    embed_batch_size: int = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))
    embed_dim: int = int(os.getenv("CHB_EMBEDDING_DIM", "768"))
    embed_model_id: str = os.getenv("CHB_EMBED_MODEL_ID", "gemini-embedding-001")
    embed_retries: int = int(os.getenv("CHB_EMBED_RETRIES", "3"))
    embed_retry_min_seconds: float = float(
        os.getenv("CHB_EMBED_RETRY_MIN_SECONDS", "1")
    )
    embed_task: str = "RETRIEVAL_QUERY"
    max_tokens: int = int(os.getenv("CHB_MODEL_MAXTOKENS", "2048"))
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
    devportal_index_id: str = os.getenv("CHB_DEVP_INDEX_ID", "devportal-index")
    cittadino_index_id: str = os.getenv("CHB_CITTADINO_INDEX_ID", "cittadino-index")
    presidio_config: dict = PARAMS["config_presidio"]
    bucket_static_content: str = os.getenv(
        "CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT", "devportal-d-website-static-content"
    )

    # prompts
    qa_prompt_str: str = PROMPTS["qa_prompt_str"]
    react_system_str: str = PROMPTS["react_system_header_str"]
    refine_prompt_str: str = PROMPTS["refine_prompt_str"]

    # urls
    redis_url: str = os.getenv("CHB_REDIS_URL")
    website_url: str = os.getenv("CHB_WEBSITE_URL")

    # API
    query_table_prefix: str = os.getenv("CHB_QUERY_TABLE_PREFIX", "chatbot")
    aws_sqs_queue_evaluate_name: str = os.getenv(
        "CHB_AWS_SQS_QUEUE_EVALUATE_NAME", "chatbot-evaluate"
    )

    # other
    language_code: str = os.getenv("CHB_LANGUAGE_CODE_STATIC_FILES", "it")


SETTINGS = ChatbotSettings()
