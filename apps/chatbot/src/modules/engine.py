import os
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.llms.llm import LLM
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.chat_engine import CondensePlusContextChatEngine
from llama_index.core.postprocessor import SimilarityPostprocessor


PROVIDER = os.getenv("CHB_PROVIDER", "google")
RERANKER_ID = os.getenv("CHB_RERANKER_ID")
SIMILARITY_TOPK = int(os.getenv("CHB_ENGINE_SIMILARITY_TOPK", "5"))


def get_engine(
    index: VectorStoreIndex,
    llm: LLM,
    system_prompt: str | None = None,
    text_qa_template: PromptTemplate | None = None,
    refine_template: PromptTemplate | None = None,
    condense_template: PromptTemplate | None = None,
    verbose: bool = True,
) -> CondensePlusContextChatEngine:
    """
    Creates a CondensePlusContextChatEngine with an AutoMergingRetriever and a reranker.
    Args:
        index (VectorStoreIndex): The vector store index to use for retrieval.
        llm (LLM): The language model to use for generating responses.
        system_prompt (str | None): Optional system prompt for the chat engine.
        text_qa_template (PromptTemplate | None): Optional template for text QA.
        refine_template (PromptTemplate | None): Optional template for refining context.
        condense_template (PromptTemplate | None): Optional template for condensing context.
        verbose (bool): Whether to enable verbose logging.
    Returns:
        CondensePlusContextChatEngine: An instance of the chat engine configured with the provided parameters.
    Raises:
        AssertionError: If the provider is not 'aws' or 'google'.
    """

    base_retriever = index.as_retriever(similarity_top_k=SIMILARITY_TOPK)
    retriever = AutoMergingRetriever(
        base_retriever, index.storage_context, verbose=verbose
    )

    if PROVIDER == "aws":
        from llama_index.postprocessor.bedrock_rerank import AWSBedrockRerank

        AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
        AWS_BEDROCK_RERANKER_REGION = os.getenv("CHB_AWS_BEDROCK_RERANKER_REGION")

        reranker = AWSBedrockRerank(
            top_n=SIMILARITY_TOPK,
            rerank_model_name=RERANKER_ID,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_BEDROCK_RERANKER_REGION,
        )
    elif PROVIDER == "google":
        from src.modules.google_reranker import GoogleRerank

        reranker = GoogleRerank(top_n=SIMILARITY_TOPK, rerank_model_name=RERANKER_ID)
    else:
        raise AssertionError(f"Provider must be 'aws' or 'google'. Given {PROVIDER}.")

    return CondensePlusContextChatEngine.from_defaults(
        retriever=retriever,
        llm=llm,
        system_prompt=system_prompt,
        context_prompt=text_qa_template,
        context_refine_prompt=refine_template,
        condense_prompt=condense_template,
        node_postprocessors=[reranker],
    )
