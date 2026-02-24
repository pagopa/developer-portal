import boto3
import os
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger

LOGGER = get_logger(__name__)

# Get root directory and load config files
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
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


class ExtractorSettings(BaseSettings):
    """Settings for the extractor application."""

    # I/O Configuration
    input_folder: str = os.getenv("EXT_INPUT_FOLDER")
    output_folder: str = os.getenv("EXT_OUTPUT_FOLDER")

    # Google API Configuration
    google_api_key: str = get_ssm_parameter(
        name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
        default=os.getenv("CHB_AWS_GOOGLE_API_KEY"),
    )

    # LLM Model Configuration
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    temperature: float = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))
    max_tokens: int = int(os.getenv("CHB_MODEL_MAXTOKENS", "2048"))
    provider: str = os.getenv("CHB_PROVIDER", "google")

    # Prompts
    content_cleaning_prompt: str = PROMPTS["content_cleaning_prompt"]

    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "info")


# Singleton instance
SETTINGS = ExtractorSettings()

# Log configuration on module import
LOGGER.info("Extractor settings loaded successfully")
LOGGER.info(f"Input folder: {SETTINGS.input_folder}")
LOGGER.info(f"Output folder: {SETTINGS.output_folder}")
LOGGER.info(f"Model: {SETTINGS.model_id}")
