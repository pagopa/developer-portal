from typing import List

from llama_index.core.bridge.pydantic import BaseModel, Field

from src.modules.documents import get_product_list


PRODUCTS = get_product_list() + ["api", "webinars"]


class Reference(BaseModel):
    """a reference that support the generated answer."""

    title: str
    filepath: str


class Question(BaseModel):
    """a follow-up question to give to the user to use in order to clarify its intent and
    narrow down the search space of the RAG tools."""

    label: str = Field(
        ..., description="A label or a short text for the follow-up question"
    )
    question: str = Field(..., description="follow-up question to return to the user")
    knowledge_base: str = Field(
        ..., description="knowledge base tag: `devportal` or `cittadino`"
    )


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


class FollowUpQuestionsOutput(BaseModel):
    """A structured output for follow-up questions."""

    follow_up_questions: List[Question] = Field(
        description="Follow-up questions about Developer or Citizen documentation.",
        min_length=2,
        max_length=10,
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
    follow_up_questions: List[Question] = Field(
        default=[],
        description="Follow-up questions about Developer or Citizen documentation.",
    )
