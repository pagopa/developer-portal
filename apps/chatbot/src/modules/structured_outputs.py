from typing import List

from llama_index.core.bridge.pydantic import BaseModel, Field

from src.modules.documents import get_product_list


PRODUCTS = get_product_list() + ["api", "webinars"]


class Reference(BaseModel):
    """a reference that support the generated answer."""

    title: str
    filepath: str


class RAGOutput(BaseModel):
    """A structured output for a RAG query."""

    response: str = Field(..., description="The generated answer to the user's query.")
    products: List[str] = Field(
        ...,
        description=(
            "A list of products. The list contains one or more of the PagoPA products: "
            f"{PRODUCTS}"
        ),
    )
    references: List[Reference] = Field(
        ...,
        description="list where each element reports the title and the filepaths of the relative source node.",
    )


class DiscoveryOutput(BaseModel):
    """A structured output for a RAG query."""

    response: str = Field(..., description="The generated answer to the user's query.")
    products: List[str] = Field(
        default=[],
        description=(
            "A list of products. The list contains one or more of the PagoPA products."
        ),
    )
    references: List[Reference] = Field(
        default=[],
        description="list where each element reports the title and the filepaths of the relative source node.",
    )
