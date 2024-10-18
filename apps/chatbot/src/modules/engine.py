import os
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.llms.llm import LLM
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.chat_engine import CondenseQuestionChatEngine
from llama_index.core.postprocessor import SimilarityPostprocessor

from dotenv import load_dotenv

load_dotenv()

ENGINE_SIMILARITY_TOPK = os.getenv('CHB_ENGINE_SIMILARITY_TOPK', "5")
ENGINE_SIMILARITY_CUTOFF = os.getenv('CHB_ENGINE_SIMILARITY_CUTOFF', "0.55")
PREFIX_MESSAGE = """\
Ciao! Io sono Discovery, l'assistente virtuale di PagoPA. \
Rispondo solo e soltanto a domande riguardanti la documentazione di PagoPA DevPortal, \
che puoi trovare sul sito: https://dev.developer.pagopa.it!\
"""
USE_ASYNC = True if os.getenv("CHB_ENGINE_USE_ASYNC", "True") == "True" else False,
USE_STREAMING = True if os.getenv("CHB_ENGINE_USE_STREAMING", "False") == "True" else False


def get_automerging_engine(
        index: VectorStoreIndex,
        llm: LLM,
        response_mode: str = "compact",
        text_qa_template: PromptTemplate | None = None,
        refine_template: PromptTemplate | None = None,
        verbose: bool = True
    ) -> CondenseQuestionChatEngine:

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

    memory = ChatMemoryBuffer.from_defaults(
        chat_history=[
            ChatMessage(
                role = MessageRole.ASSISTANT,
                content = PREFIX_MESSAGE
            )
        ],
        chat_store=None,
        chat_store_key="None",
        token_limit=llm.metadata.context_window - llm.max_tokens
    )

    query_engine = RetrieverQueryEngine.from_args(
        retriever, 
        llm=llm, 
        response_mode=response_mode,
        node_postprocessors=[
            similarity_postprocessor
        ],
        text_qa_template=text_qa_template,
        refine_template=refine_template,
        use_async=USE_ASYNC,
        streaming=USE_STREAMING
    )

    automerging_engine = CondenseQuestionChatEngine.from_defaults(
        query_engine = query_engine,
        memory = memory
    )

    return automerging_engine
