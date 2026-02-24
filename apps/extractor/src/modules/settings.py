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


class ExtractorSettings(BaseSettings):
    """Settings for the extractor application."""

    # I/O Configuration
    input_folder: str = os.getenv("EXT_INPUT_FOLDER")
    output_folder: str = os.getenv("EXT_OUTPUT_FOLDER")

    # Google API Configuration
    google_api_key: str = os.getenv("EXT_AWS_GOOGLE_API_KEY")

    # LLM Model Configuration
    model_id: str = os.getenv("CHB_MODEL_ID", "gemini-2.5-flash-lite")
    temperature: float = float(os.getenv("EXT_MODEL_TEMPERATURE", "0.3"))
    max_tokens: int = int(os.getenv("EXT_MODEL_MAXTOKENS", "2048"))
    provider: str = os.getenv("EXT_PROVIDER", "google")

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
