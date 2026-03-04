from typing import Optional
from pydantic import BaseModel, Field


class InputDocument(BaseModel):
    """Represents the raw input document extracted from a web page.
    This model is used to capture the initial data before any cleaning is applied.
    """
    url: str = Field(..., description="The URL of the web page")
    title: str = Field(..., description="The title of the web page")
    bodyText: str = Field(
        ..., description="The raw body text content extracted from the web page"
    )
    lang: str = Field(
        ..., description="The language code of the page (e.g., 'it', 'en')"
    )
    keywords: Optional[str] = Field(
        None, description="Keywords or tags associated with the page"
    )
    datePublished: Optional[str] = Field(
        None, description="The publication date of the page"
    )
    lastModified: str = Field(
        ..., description="The last modified date of the page in ISO 8601 format"
    )


class CleanedDocument(BaseModel):
    """Represents the cleaned and structured document after processing with the LLM.
    This model is designed to capture the essential information in a structured format, making it easier for downstream applications to consume.
    """
    title: str = Field(..., description="The title of the page")
    text: str = Field(
        ...,
        description="The whole main text content of the page in markdown format, without any truncation. Add newlines, bulletpoints, etc when necessary.",
    )
    language: str = Field(
        ...,
        description="The language of the page content as a standard language code (e.g., 'en' for English, 'it' for Italian, etc.)",
    )
    lastmod: str = Field(
        ..., description="The last modified date of the page in ISO 8601 format"
    )
    url: str = Field(..., description="The URL of the page")
    keywords: Optional[str] = Field(
        None, description="Keywords or tags associated with the page"
    )

    def to_dict(self) -> dict:
        """Convert the model to a dictionary for JSON serialization."""
        return self.model_dump()
