import os
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger

LOGGER = get_logger(__name__, os.getenv("LOG_LEVEL", "info"))


class StructuredDataCleanerSettings(BaseSettings):
    """Settings for the structured data cleaner application."""

    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "info")


# Singleton instance
SETTINGS = StructuredDataCleanerSettings()
