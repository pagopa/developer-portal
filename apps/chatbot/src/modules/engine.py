import os
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.llms.llm import LLM
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.chat_engine import CondensePlusContextChatEngine
from llama_index.core.postprocessor import SimilarityPostprocessor


PROVIDER = os.getenv("CHB_PROVIDER", "google")
RERANKER_ID = os.getenv("CHB_RERANKER_ID")
SIMILARITY_TOPK = int(os.getenv("CHB_ENGINE_SIMILARITY_TOPK", "5"))
SIMILARITY_CUTOFF = float(os.getenv("CHB_ENGINE_SIMILARITY_CUTOFF", "0.25"))


def get_automerging_engine(
    index: VectorStoreIndex,
    llm: LLM,
    system_prompt: str | None = None,
    text_qa_template: PromptTemplate | None = None,
    refine_template: PromptTemplate | None = None,
    condense_template: PromptTemplate | None = None,
    verbose: bool = True,
) -> CondensePlusContextChatEngine:

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

    similarity_postprocessor = SimilarityPostprocessor(
        similarity_cutoff=SIMILARITY_CUTOFF
    )

    return CondensePlusContextChatEngine.from_defaults(
        retriever=retriever,
        llm=llm,
        system_prompt=system_prompt,
        context_prompt=text_qa_template,
        context_refine_prompt=refine_template,
        condense_prompt=condense_template,
        node_postprocessors=[similarity_postprocessor, reranker],
    )
