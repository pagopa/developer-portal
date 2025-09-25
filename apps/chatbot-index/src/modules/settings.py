import os
import boto3
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.utils import get_ssm_parameter


CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PARAMS = yaml.safe_load(open(os.path.join(ROOT, "config", "params.yaml"), "r"))
AWS_SESSION = boto3.Session(
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_DEFAULT_REGION", "eu-south-1"),
)


class ChatbotSettings(BaseSettings):
    """Settings for the chatbot application."""

    # api keys
    # aws_endpoint_url: str | None = os.getenv("CHB_AWS_SSM_ENDPOINT_URL")
    google_api_key: str = get_ssm_parameter(
        name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
        default=os.getenv("CHB_AWS_GOOGLE_API_KEY"),
    )
    strapi_api_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_STRAPI_API_KEY"), os.getenv("CHB_STRAPI_API_KEY", "")
    )

    # RAG settings
    embed_batch_size: int = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))
    embed_dim: int = int(os.getenv("CHB_EMBEDDING_DIM", "768"))
    embed_model_id: str = os.getenv("CHB_EMBED_MODEL_ID", "gemini-embedding-001")
    embed_retries: int = int(os.getenv("CHB_EMBED_RETRIES", "30"))
    embed_retry_min_seconds: float = float(
        os.getenv("CHB_EMBED_RETRY_MIN_SECONDS", "1.5")
    )
    embed_task_docs: str = "RETRIEVAL_DOCUMENT"
    max_tokens: int = os.getenv("CHB_MODEL_MAXTOKENS", "2048")
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    provider: str = os.getenv("CHB_PROVIDER", "google")
    temperature_rag: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))

    # vector index and docs params
    chunk_overlap: int = PARAMS["vector_index"]["chunk_overlap"]
    chunk_size: int = PARAMS["vector_index"]["chunk_size"]
    index_id: str = PARAMS["vector_index"]["index_id"]
    bucket_static_content: str = os.getenv(
        "CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT", "devportal-d-website-static-content"
    )

    # urls
    redis_url: str = os.getenv("CHB_REDIS_URL")
    website_url: str = os.getenv("CHB_WEBSITE_URL")


SETTINGS = ChatbotSettings()
