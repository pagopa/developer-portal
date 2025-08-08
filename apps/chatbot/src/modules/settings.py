import os
import json
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.utils import get_ssm_parameter

CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))


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

    # api keys
    aws_access_key_id: str = os.getenv("CHB_AWS_ACCESS_KEY_ID")
    aws_default_region: str = os.getenv("CHB_AWS_DEFAULT_REGION")
    aws_endpoint_url: str = os.getenv("CHB_AWS_SSM_ENDPOINT_URL")
    aws_secret_access_key: str = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
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
    embed_task_docs: str = "RETRIEVAL_DOCUMENT"
    embed_task_qa: str = "RETRIEVAL_QUERY"
    max_tokens: int = os.getenv("CHB_MODEL_MAXTOKENS", "768")
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash")
    provider: str = os.getenv("CHB_PROVIDER", "google")
    reranker_id: str = os.getenv("CHB_RERANKER_ID", "semantic-ranker-512-003")
    similarity_topk: int = int(os.getenv("CHB_ENGINE_SIMILARITY_TOPK", "5"))
    temperature_agent: float = 0.7
    temperature_rag: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))
    use_async: bool = os.getenv("CHB_ENGINE_USE_ASYNC", "True").lower() == "true"

    # vector index and docs params
    chunk_overlap: int = PARAMS["vector_index"]["chunk_overlap"]
    chunk_size: int = PARAMS["vector_index"]["chunk_size"]
    index_id: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_LLAMAINDEX_INDEX_ID"), "default-index"
    )
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
