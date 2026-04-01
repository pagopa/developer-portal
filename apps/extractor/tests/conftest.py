"""
Pytest configuration for the extractor test suite.

Sets required environment variables before any test module is imported so that
the pydantic-settings singleton (ExtractorSettings) can be instantiated without
real AWS credentials or a live environment.
"""

import os

# These must be set before src.modules.settings is imported (which happens when
# any src module importing SETTINGS is collected), so they are applied at
# conftest load time rather than inside a fixture.
os.environ["URL"] = os.environ.get("URL", "https://example.com")
os.environ["CHB_INDEX_ID"] = os.environ.get("CHB_INDEX_ID", "test-index")
os.environ["CHB_AWS_GOOGLE_API_KEY"] = os.environ.get(
    "CHB_AWS_GOOGLE_API_KEY", "test-google-api-key"
)
