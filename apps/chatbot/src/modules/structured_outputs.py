from typing import List

from llama_index.core.bridge.pydantic import BaseModel, Field

from src.modules.documents import get_product_list


PRODUCTS = get_product_list() + ["api", "webinars"]


class Reference(BaseModel):
    """a reference that support the generated answer."""

    title: str
    url: str


class FollowUpQuestion(BaseModel):
    """A follow-up question presented to the user to clarify their intent and
    narrow the search space of the RAG tools."""

    label: str = Field(
        ..., description="A label or short text describing the follow-up question."
    )
    question: str = Field(..., description="Follow-up question to present to the user.")
    knowledgeBase: str = Field(
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
        description="list where each element reports the title and the urls of the relative source node.",
    )


class FollowUpQuestionsOutput(BaseModel):
    """A structured output for follow-up questions."""

    follow_up_questions: List[FollowUpQuestion] = Field(
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
        description="list where each element reports the title and the url of the relative source node.",
    )
    follow_up_questions: List[Question] = Field(
        default=[],
        description="Follow-up questions about Developer or Citizen documentation.",
    )
