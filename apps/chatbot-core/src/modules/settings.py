import boto3
import os
import json
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger

from dotenv import load_dotenv

load_dotenv(".env.local")

LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", os.getenv("CHB_AWS_ACCESS_KEY_ID"))
AWS_DEFAULT_REGION = os.getenv("AWS_REGION", os.getenv("CHB_AWS_DEFAULT_REGION"))
AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL")
AWS_SECRET_ACCESS_KEY = os.getenv(
    "AWS_SECRET_ACCESS_KEY", os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
)


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    :param name: The name of the parameter to retrieve.
    :param default: The default value to return if the parameter is not found.
    :return: The value of the requested parameter.
    """
    SSM_CLIENT = boto3.client(
        "ssm",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_DEFAULT_REGION,
        endpoint_url=AWS_ENDPOINT_URL,
    )

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
    def google_api_key(self) -> str:
        return get_ssm_parameter(
            name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
            default=os.getenv("CHB_AWS_GOOGLE_API_KEY"),
        )

    @property
    def google_service_account(self) -> dict:
        return self.get_google_service_account()

    @property
    def strapi_api_key(self) -> str:
        return get_ssm_parameter(
            name=os.getenv("CHB_AWS_SSM_STRAPI_API_KEY"),
            default=os.getenv("CHB_STRAPI_API_KEY", ""),
        )

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

    def get_google_service_account(self):
        GOOGLE_SERVICE_ACCOUNT = get_ssm_parameter(
            os.getenv("CHB_AWS_SSM_GOOGLE_SERVICE_ACCOUNT")
        )
        if GOOGLE_SERVICE_ACCOUNT is None:
            with open(os.path.join(ROOT, ".google_service_account.json"), "r") as file:
                GOOGLE_JSON_ACCOUNT_INFO = json.load(file)
        else:
            GOOGLE_JSON_ACCOUNT_INFO = json.loads(GOOGLE_SERVICE_ACCOUNT)

        return GOOGLE_JSON_ACCOUNT_INFO

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
    website_url: str = os.getenv("CHB_WEBSITE_URL")
    langfuse_host: str = os.getenv("CHB_LANGFUSE_HOST")
    redis_url: str = os.getenv("CHB_REDIS_URL")

    # prompts
    identity_prompt_str: str = PROMPTS["identity_prompt_str"]
    qa_prompt_str: str = PROMPTS["qa_prompt_str"]
    react_system_str: str = PROMPTS["react_system_header_str"]
    refine_prompt_str: str = PROMPTS["refine_prompt_str"]

    # RAG settings
    embed_batch_size: int = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))
    embed_dim: int = int(os.getenv("CHB_EMBEDDING_DIM", "768"))
    embed_model_id: str = os.getenv("CHB_EMBED_MODEL_ID", "gemini-embedding-001")
    embed_retry_min_seconds_docs: float = 1.5
    embed_retry_min_seconds_qa: float = 1
    embed_retries_docs: int = 30
    embed_retries_qa: int = 3
    embed_task_docs: str = "RETRIEVAL_DOCUMENT"
    embed_task_qa: str = "RETRIEVAL_QUERY"
    max_tokens: int = os.getenv("CHB_MODEL_MAXTOKENS", "768")
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    provider: str = os.getenv("CHB_PROVIDER", "google")
    reranker_id: str = os.getenv("CHB_RERANKER_ID", "semantic-ranker-default-004")
    similarity_topk: int = int(os.getenv("CHB_ENGINE_SIMILARITY_TOPK", "5"))
    temperature_agent: float = 0.7
    temperature_rag: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))
    use_async: bool = os.getenv("CHB_ENGINE_USE_ASYNC", "True").lower() == "true"

    # vector index and docs params
    chunk_overlap: int = PARAMS["vector_index"]["chunk_overlap"]
    chunk_size: int = PARAMS["vector_index"]["chunk_size"]
    presidio_config: dict = PARAMS["config_presidio"]
    bucket_static_content: str = os.getenv(
        "CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT", "devportal-d-website-static-content"
    )


SETTINGS = ChatbotSettings()
