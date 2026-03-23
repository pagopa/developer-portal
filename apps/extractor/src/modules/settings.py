import boto3
import os
import json
import yaml
from pathlib import Path
from typing import Optional
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from src.modules.logger import get_logger
from src.helpers.url_handling import compute_app_folder

LOGGER = get_logger(__name__, os.getenv("LOG_LEVEL", "info"))

# Get root directory and load config files
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PROMPTS = yaml.safe_load(
    Path(ROOT, "config", "prompts.yaml").read_text(encoding="utf-8")
)
AWS_SESSION = boto3.Session()
AWS_SSM_CLIENT = AWS_SESSION.client("ssm")
TOKEN_BUDGET_DIVISOR = 9  # This is an heuristic, setting it to a smaller value results in MAX_TOKEN errors. As there is no universal way to predict the token count of the response of an arbitrary LLM, this scales down max_tokens to a per-chunk token budget for body text
GOOGLE_SERVICE_ACCOUNT = os.getenv("GOOGLE_SERVICE_ACCOUNT")
if GOOGLE_SERVICE_ACCOUNT is None:
    with open(os.path.join(ROOT, ".google_service_account.json"), "r") as file:
        GOOGLE_JSON_ACCOUNT_INFO = json.load(file)
else:
    GOOGLE_JSON_ACCOUNT_INFO = json.loads(GOOGLE_SERVICE_ACCOUNT)


def get_ssm_parameter(name: str | None, default: str | None = None) -> str | None:
    """
    Retrieves a specific value from AWS Systems Manager's Parameter Store.

    Args:
        name: The name of the parameter to retrieve.
        default: The default value to return if the parameter is not found.
    Returns:
        The value of the requested parameter, or the default value if the parameter is not found or if there is an error accessing SSM.
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
    except Exception as e:
        LOGGER.warning(
            f"Error accessing AWS SSM ({str(e)}), returning default: {default}"
        )
        return default
    return value


class ExtractorSettings(BaseSettings):
    """Settings for the extractor application."""

    model_config = SettingsConfigDict(env_prefix="")

    # URL and index settings used to derive input_folder and output_folder
    url: str = Field(alias="URL")
    chb_index_id: str = Field(alias="CHB_INDEX_ID")
    s3_bucket_name: Optional[str] = Field(default=None, alias="S3_BUCKET_NAME")

    # I/O Configuration – computed in resolve_folders() after env vars are loaded
    input_folder: Optional[str] = None
    output_folder: Optional[str] = None

    # Google Configuration
    google_service_account: dict = GOOGLE_JSON_ACCOUNT_INFO

    # Cosine similarity threshold for validating LLM output against source content
    similarity_threshold: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.8"))

    # LLM Model Configuration
    model_id: str = os.getenv("EXTRACTOR_MODEL_ID", "gemini-2.5-flash-lite")
    temperature: float = float(os.getenv("EXTRACTOR_MODEL_TEMPERATURE", "0.0"))
    max_tokens: int = int(os.getenv("EXTRACTOR_MODEL_MAXTOKENS", "65535"))
    provider: str = os.getenv("EXTRACTOR_PROVIDER", "google")
    vertexai_location: str = os.getenv("EXTRACTOR_VERTEXAI_LOCATION", "europe-west8")

    # Prompts
    content_cleaning_prompt: str = PROMPTS["content_cleaning_prompt"]

    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "info")

    @model_validator(mode="after")
    def resolve_folders(self) -> "ExtractorSettings":
        """Compute input_folder and output_folder from URL + CHB_INDEX_ID.

        Called after all fields are populated with real values so that
        :func:`compute_app_folder` receives strings, not FieldInfo descriptors.
        """
        self.input_folder = compute_app_folder(
            url=self.url,
            index_id=self.chb_index_id,
            s3_bucket=self.s3_bucket_name,
            app_name="parser",
        )
        self.output_folder = compute_app_folder(
            url=self.url,
            index_id=self.chb_index_id,
            s3_bucket=self.s3_bucket_name,
            app_name="extractor",
        )
        LOGGER.info("Input  folder: %s", self.input_folder)
        LOGGER.info("Output folder: %s", self.output_folder)
        return self


# Singleton instance
SETTINGS = ExtractorSettings()
