import os
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.llms.llm import LLM
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.chat_engine import CondensePlusContextChatEngine
from llama_index.core.postprocessor import SimilarityPostprocessor


SIMILARITY_TOPK = os.getenv("CHB_ENGINE_SIMILARITY_TOPK", "5")
SIMILARITY_CUTOFF = os.getenv("CHB_ENGINE_SIMILARITY_CUTOFF", "0.55")


def get_automerging_engine(
    index: VectorStoreIndex,
    llm: LLM,
    system_prompt: str | None = None,
    text_qa_template: PromptTemplate | None = None,
    refine_template: PromptTemplate | None = None,
    condense_template: PromptTemplate | None = None,
    verbose: bool = True,
) -> CondensePlusContextChatEngine:

    base_retriever = index.as_retriever(similarity_top_k=int(SIMILARITY_TOPK))
    retriever = AutoMergingRetriever(
        base_retriever, index.storage_context, verbose=verbose
    )
    similarity_postprocessor = SimilarityPostprocessor(
        similarity_cutoff=float(SIMILARITY_CUTOFF)
    )

    return CondensePlusContextChatEngine.from_defaults(
        retriever=retriever,
        llm=llm,
        system_prompt=system_prompt,
        context_prompt=text_qa_template,
        context_refine_prompt=refine_template,
        condense_prompt=condense_template,
        node_postprocessors=[similarity_postprocessor],
    )
