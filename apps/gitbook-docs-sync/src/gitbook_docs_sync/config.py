"""Runtime configuration for GitBook synchronization."""

from __future__ import annotations

from pathlib import Path

from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


ENVIRONMENT_SHORT_NAMES = {"dev": "d", "uat": "u", "prod": "p"}
SITEMAP_URLS = {
    "dev": "https://dev.developer.pagopa.it/sitemap.xml",
    "uat": "https://uat.developer.pagopa.it/sitemap.xml",
    "prod": "https://developer.pagopa.it/sitemap.xml",
}


class SyncSettings(BaseSettings):
    """Settings supplied by the GitHub composite action."""

    model_config = SettingsConfigDict(case_sensitive=False, extra="ignore")

    environment: str
    documentation_path: Path = Path("../../devportal-docs/docs")
    url_parsing_metadata_json_path: Path = Path("../../url-parsing-metadata.json")
    s3_doc_extraction_bucket_name: str = ""
    s3_path_to_gitbook_docs: str = "devportal-docs/docs"
    s3_dirnames_json_path: str = "dirNames.json"
    s3_dirname_metadata_json_path: str = "metadata.json"
    s3_solutions_dirnames_json_path: str = "solutions-dirNames.json"
    s3_release_notes_dirnames_json_path: str = "release-notes-dirNames.json"
    locale: str = ""
    dir_names_filter: str = ""
    incremental_mode: bool = True
    metadata_type: str = "all"
    strapi_endpoint: str
    strapi_api_token: str
    asset_bucket_cloudfront_distribution_id: str = ""
    opennext_cloudfront_distribution_id: str = ""
    invalidate_opennext_cache: bool = False
    invalidate_cloudfront_asset_bucket_cache: bool = True
    generate_and_sync_sitemap: bool = True
    pat_token: str = ""
    documentation_repository: str = "pagopa/devportal-docs"
    documentation_branch: str = "docs/from-gitbook"
    github_repository: str = Field(
        default="pagopa/developer-portal",
        validation_alias=AliasChoices("GITHUB_REPOSITORY", "github_repository"),
    )

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, value: str) -> str:
        if value not in ENVIRONMENT_SHORT_NAMES:
            raise ValueError("environment must be one of dev, uat, or prod")
        return value

    @field_validator("metadata_type")
    @classmethod
    def validate_metadata_type(cls, value: str) -> str:
        normalized = value.lower()
        if normalized not in {"all", "guides", "solutions", "release_notes"}:
            raise ValueError(
                "metadata_type must be all, guides, solutions, or release_notes"
            )
        return normalized

    @property
    def bucket_name(self) -> str:
        return f"devportal-{ENVIRONMENT_SHORT_NAMES[self.environment]}-website-static-content"

    @property
    def sitemap_url(self) -> str:
        return SITEMAP_URLS[self.environment]

    @property
    def filtered_dir_names(self) -> set[str]:
        return {name.strip() for name in self.dir_names_filter.split(",") if name.strip()}

    def localized_key(self, key: str) -> str:
        return f"{self.locale}/{key.lstrip('/')}" if self.locale else key.lstrip("/")
