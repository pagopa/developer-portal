import os
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.llms.llm import LLM
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor

from dotenv import load_dotenv

load_dotenv()

ENGINE_SIMILARITY_TOPK = os.getenv('CHB_ENGINE_SIMILARITY_TOPK', "5")
ENGINE_SIMILARITY_CUTOFF = os.getenv('CHB_ENGINE_SIMILARITY_CUTOFF', "0.55")
ENGINE_USE_ASYNC = os.getenv('CHB_ENGINE_USE_ASYNC', "True")
ENGINE_USE_STREAMING = os.getenv('CHB_ENGINE_USE_STREAMING', "False")


def get_automerging_query_engine(
        index: VectorStoreIndex,
        llm: LLM,
        response_mode: str = "compact",
        text_qa_template: PromptTemplate | None = None,
        refine_template: PromptTemplate | None = None,
        verbose: bool = True
    ) -> RetrieverQueryEngine:

    base_retriever = index.as_retriever(
        similarity_top_k=int(ENGINE_SIMILARITY_TOPK)
    )
    retriever = AutoMergingRetriever(
        base_retriever, 
        index.storage_context, 
        verbose=verbose
    )
    similarity_postprocessor = SimilarityPostprocessor(
        similarity_cutoff=float(ENGINE_SIMILARITY_CUTOFF)
    )

    automerging_engine = RetrieverQueryEngine.from_args(
        retriever, 
        llm=llm, 
        response_mode=response_mode,
        node_postprocessors=[
            similarity_postprocessor
        ],
        text_qa_template=text_qa_template,
        refine_template=refine_template,
        use_async=True if ENGINE_USE_ASYNC == "True" else False,
        streaming=True if ENGINE_USE_STREAMING == "True" else False
    )

    return automerging_engine
