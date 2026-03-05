import os
import boto3
from typing import Optional
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings

from src.modules.logger import get_logger

LOGGER = get_logger(__name__, os.getenv("LOG_LEVEL", "info"))
AWS_SESSION = boto3.Session()


class StructuredDataCleanerSettings(BaseSettings):
    """Settings for the structured data cleaner application."""

    # Comma-separated list of URLs received as a plain string to prevent pydantic-settings
    # from attempting JSON decoding (which it does automatically for `list` fields).
    urls_raw: str = Field(alias="URLS", exclude=True)
    # Parsed list of URLs – populated by the model validator below.
    urls: list[str] = Field(default_factory=list, alias="__URLS_COMPUTED__")
    # Vector index name
    chb_index_id: str = Field(alias="CHB_INDEX_ID")
    # Optional S3 bucket name (required if *should_run_locally* is ``False``)
    s3_bucket_name: Optional[str] = Field(default=None, alias="S3_BUCKET_NAME")

    # Flags for app folder path computation
    should_remove_parser_folder: bool = Field(alias="SHOULD_REMOVE_PARSER_FOLDER")
    should_remove_extractor_folder: bool = Field(alias="SHOULD_REMOVE_EXTRACTOR_FOLDER")

    # Local run flag
    should_run_locally: bool = (
        os.getenv("SHOULD_RUN_LOCALLY", "false").lower() == "true"
    )

    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "info")

    @model_validator(mode="after")
    def parse_urls(self) -> "StructuredDataCleanerSettings":
        """Split the comma-separated URLS env var into a list of stripped URL strings."""
        self.urls = [u.strip() for u in self.urls_raw.split(",") if u.strip()]
        return self


# Singleton instance
SETTINGS = StructuredDataCleanerSettings()
