import json
import requests
from typing import List

from llama_index.core.llms.llm import LLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.bridge.pydantic import BaseModel, Field
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.tools import QueryEngineTool, FunctionTool

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.documents import get_product_list


LOGGER = get_logger(__name__)
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


def get_query_engine_tool(
    index: VectorStoreIndex,
    llm: LLM,
    embed_model: BaseEmbedding,
    text_qa_template: PromptTemplate | None = None,
    refine_template: PromptTemplate | None = None,
    verbose: bool = False,
) -> QueryEngineTool:
    """
    Creates a QueryEngineTool with an AutoMergingRetriever and a reranker.
    Args:
        index (VectorStoreIndex): The vector store index to use for retrieval.
        llm (LLM): The language model to use for generating responses.
        identity_prompt (str | None): Optional prompt for the agent's identity.
        text_qa_template (PromptTemplate | None): Optional template for text QA.
        refine_template (PromptTemplate | None): Optional template for refining context.
        react_system_str (str | None): Optional system string for the ReAct agent.
        verbose (bool): Whether to enable verbose logging.
    Returns:
        QueryEngineTool: A QA tool that uses RAG (Retrieval-Augmented Generation) to answer questions.
    Raises:
        AssertionError: If the provider is not 'google' or 'mock'.
    """

    base_retriever = index.as_retriever(
        similarity_top_k=SETTINGS.similarity_topk,
        embed_model=embed_model,
    )
    retriever = AutoMergingRetriever(
        base_retriever, index.storage_context, verbose=verbose
    )

    if SETTINGS.provider == "google":
        from src.modules.google_reranker import GoogleRerank

        reranker = GoogleRerank(
            top_n=SETTINGS.similarity_topk,
            rerank_model_name=SETTINGS.reranker_id,
        )
        node_postprocessors = [reranker]
    elif SETTINGS.provider == "mock":
        node_postprocessors = None
    else:
        raise AssertionError(
            f"Provider must be 'google' or 'mock'. Given {SETTINGS.provider}."
        )

    query_engine = RetrieverQueryEngine.from_args(
        retriever=retriever,
        llm=llm,
        output_cls=RAGOutput,
        text_qa_template=text_qa_template,
        refine_template=refine_template,
        node_postprocessors=node_postprocessors,
        use_async=SETTINGS.use_async,
    )

    query_engine_tool = QueryEngineTool.from_defaults(
        query_engine=query_engine,
        name="rag_tool",
        description=(
            "This tool is your primary resource for answering questions about PagoPA Developer Portal."
        ),
    )

    return query_engine_tool


def get_identity_tool(identity_prompt: str) -> FunctionTool:

    async def identity_fn() -> str:
        """Useful to reply questions about the agent identity."""
        return identity_prompt

    identity_tool = FunctionTool.from_defaults(
        fn=identity_fn,
        name="discovery_identity",
        description=(
            "Responds to identity or personality questions like 'Who are you?', "
            "'What is your name?', 'I am ..., and you?', or similar."
        ),
    )

    return identity_tool
