import json
import requests
from typing import List

from llama_index.core.llms.llm import LLM
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.bridge.pydantic import BaseModel, Field
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.tools import QueryEngineTool, FunctionTool

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.models import get_llm, get_embed_model


LOGGER = get_logger(__name__)


def get_product_list(website_url: str | None = None) -> List[str]:
    """
    Fetches a list of products from the website.
    Args:
        website_url (str | None): The base URL of the website. If None, uses the default WEBSITE_URL.
    Returns:
        List[str]: A list of product slugs. If the request fails, an empty list is returned.
    """
    if website_url is None:
        website_url = SETTINGS.website_url

    url = website_url.replace("https://", "https://cms.")
    url += "/api/products"
    headers = {"Authorization": f"Bearer {SETTINGS.strapi_api_key}"}
    response = requests.get(url, headers=headers)
    product_list = []
    if response.status_code == 200:
        products = json.loads(response.text)

        for product in products["data"]:
            try:
                product_slug = product["attributes"]["slug"]
                product_list.append(product_slug)
            except KeyError as e:
                LOGGER.error(f"Error extracting product slug: {e}")

    else:
        LOGGER.error(f"Failed to fetch product list: {response.status_code}")

    LOGGER.info(f"Found {len(product_list)} products: {product_list}.")
    return product_list


PRODUCTS = get_product_list()


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
        embed_model=get_embed_model(),
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
            "This tool is your primary resource for answering questions about PagoPA products and services. "
            f"Use it to find information on topics like: {PRODUCTS}. "
            "It can also answer general questions about the company and its offerings."
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
