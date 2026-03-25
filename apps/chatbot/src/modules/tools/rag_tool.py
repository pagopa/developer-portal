from llama_index.core.llms.llm import LLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.tools import QueryEngineTool

from src.modules.settings import SETTINGS
from src.modules.models import get_llm, get_embed_model
from src.modules.structured_outputs import PRODUCTS
from src.modules.structured_outputs import RAGOutput


DEVPORTAL_TOOL_NAME = "DevPortalRAGTool"
CITTADINO_TOOL_NAME = "CittadinoRAGTool"
DEVPORTAL_RAG_TOOL_DESCRIPTION = (
    "RAG tool designed to benefit IT professionals and developers by retrieving technical, architectural, and integration-related information regarding the PagoPA Developer Portal products. "
    f"Use this tool for all technical, architectural, and integration-related queries regarding PagoPA Developer Portal products: {PRODUCTS}.\n"
    "Use this tool when the user is an IT professional or a developer seeking to integrate or manage the PagoPA Developer Portal products.\n"
    "It contains API specifications, authentication methods, SDKs, technical onboarding for institutions, and backend configuration.\n"
    "DO NOT use this for general 'how to use' questions from citizens.\n"
    "Use this tool for API specifications, SDKs, technical onboarding processes for institutions (Ente Creditore) and PSPs, "
    "authentication methods (API Keys), environment configurations (checkout, eCommerce), and technical troubleshooting for developers."
)
CITTADINO_RAG_TOOL_DESCRIPTION = (
    "RAG tool designed to retrieve information useful for end-users (citizens) with queries related to the use of Italian digital platforms, specifically those involving the PagoPA ecosystem. "
    "Use this tool for all queries related to the end-user (citizen) experience of Italian digital platforms. "
    "This tool contains comprehensive information on the PagoPA products: 'send', 'app-io', and the 'pagopa-payment' ecosystem from a user's perspective.\n"
    "Consult this tool for questions about receiving digital notifications, using the App IO interface, paying taxes or fines as a citizen, "
    "troubleshooting payment receipts, and general help center inquiries (FAQ).\n"
    "DO NOT use this for technical integration or API queries. "
)


def get_query_engine_tool(
    index: VectorStoreIndex,
    name: str,
    description: str,
    llm: LLM | None = None,
    embed_model: BaseEmbedding | None = None,
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

    llm = llm if llm else get_llm(temperature=SETTINGS.temperature_rag)
    embed_model = embed_model if embed_model else get_embed_model()

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
            model_id=SETTINGS.reranker_id,
            location=SETTINGS.vertexai_location,
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

    return QueryEngineTool.from_defaults(
        query_engine=query_engine,
        name=name,
        description=description,
    )
