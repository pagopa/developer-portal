from llama_index.core.llms.llm import LLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.tools import QueryEngineTool

from src.modules.settings import SETTINGS
from src.modules.models import get_llm, get_embed_model
from src.modules.structured_outputs import RAGOutput


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
        similarity_top_k=12,
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

    return QueryEngineTool.from_defaults(
        query_engine=query_engine,
        name=name,
        description=description,
    )
