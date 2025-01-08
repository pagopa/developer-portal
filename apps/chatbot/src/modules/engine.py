import os
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.llms.llm import LLM
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.chat_engine import CondensePlusContextChatEngine
from llama_index.core.postprocessor import SimilarityPostprocessor

from dotenv import load_dotenv


load_dotenv()


USE_CHAT_ENGINE = True if (os.getenv("CHB_USE_CHAT_ENGINE", "True")).lower() == "true" else False 
SIMILARITY_TOPK = os.getenv("CHB_ENGINE_SIMILARITY_TOPK", "5")
SIMILARITY_CUTOFF = os.getenv("CHB_ENGINE_SIMILARITY_CUTOFF", "0.55")
USE_ASYNC = True if (os.getenv("CHB_ENGINE_USE_ASYNC", "True")).lower() == "true" else False
USE_STREAMING = True if (os.getenv("CHB_ENGINE_USE_STREAMING", "False")).lower() == "true" else False 
SYSTEM_PROMPT = (
    "You are the virtual PagoPA S.p.A. assistant. Your name is Discovery.\n"
    "Your role is to provide accurate, professional, and helpful responses to users' queries regarding "
    "the PagoPA DevPortal documentation available at: https://dev.developer.pagopa.it"
)


def get_automerging_engine(
        index: VectorStoreIndex,
        llm: LLM,
        response_mode: str = "compact",
        text_qa_template: PromptTemplate | None = None,
        refine_template: PromptTemplate | None = None,
        condense_template: PromptTemplate | None = None,
        verbose: bool = True,
        use_chat_engine: bool | None = None
    ) -> (RetrieverQueryEngine | CondensePlusContextChatEngine):

    
    use_chat_engine = use_chat_engine if use_chat_engine else USE_CHAT_ENGINE

    base_retriever = index.as_retriever(
        similarity_top_k=int(SIMILARITY_TOPK)
    )
    retriever = AutoMergingRetriever(
        base_retriever, 
        index.storage_context, 
        verbose=verbose
    )
    similarity_postprocessor = SimilarityPostprocessor(
        similarity_cutoff=float(SIMILARITY_CUTOFF)
    )

    if use_chat_engine:
        return CondensePlusContextChatEngine.from_defaults(
        retriever = retriever,
        llm = llm,
        context_prompt = text_qa_template,
        context_refine_prompt = refine_template,
        condense_prompt = condense_template,
        node_postprocessors = [similarity_postprocessor]
    )
    else:
        return RetrieverQueryEngine.from_args(
        retriever, 
        llm = llm, 
        response_mode = response_mode,
        node_postprocessors = [similarity_postprocessor],
        text_qa_template = text_qa_template,
        refine_template = refine_template,
        use_async = USE_ASYNC,
        streaming = USE_STREAMING
    )
