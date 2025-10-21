import os
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.utils import get_ssm_parameter


CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))


class ChatbotSettings(BaseSettings):
    """Settings for the chatbot evaluation."""

    # api keys
    aws_access_key_id: str = os.getenv(
        "AWS_ACCESS_KEY_ID", os.getenv("CHB_AWS_ACCESS_KEY_ID")
    )
    aws_default_region: str = os.getenv(
        "AWS_REGION", os.getenv("CHB_AWS_DEFAULT_REGION")
    )
    aws_endpoint_url: str | None = os.getenv("CHB_AWS_SSM_ENDPOINT_URL")
    aws_secret_access_key: str = os.getenv(
        "AWS_SECRET_ACCESS_KEY", os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
    )
    google_api_key: str = get_ssm_parameter(
        os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
        os.getenv("CHB_AWS_GOOGLE_API_KEY"),
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

    # models settings
    embed_batch_size: int = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))
    embed_dim: int = int(os.getenv("CHB_EMBEDDING_DIM", "768"))
    embed_model_id: str = os.getenv("CHB_EMBED_MODEL_ID", "gemini-embedding-001")
    embed_task_type: str = "SEMANTIC_SIMILARITY"
    max_tokens: int = int(os.getenv("CHB_MODEL_MAXTOKENS", "2048"))
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    provider: str = os.getenv("CHB_PROVIDER", "google")
    temperature: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.0"))

    # prompts
    condense_prompt_str: str = PROMPTS["condense_prompt_str"]


SETTINGS = ChatbotSettings()
