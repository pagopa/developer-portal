import os
from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.llms.llm import LLM
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.chat_engine import CondenseQuestionChatEngine
from llama_index.core.postprocessor import SimilarityPostprocessor

from dotenv import load_dotenv


load_dotenv()


SIMILARITY_TOPK = os.getenv('CHB_ENGINE_SIMILARITY_TOPK', "5")
SIMILARITY_CUTOFF = os.getenv('CHB_ENGINE_SIMILARITY_CUTOFF', "0.55")
USE_ASYNC = True if (os.getenv('CHB_ENGINE_USE_ASYNC', "True")).lower() == "true" else False
USE_STREAMING = True if (os.getenv('CHB_ENGINE_USE_STREAMING', "False")).lower() == "true" else False 


def get_automerging_engine(
        index: VectorStoreIndex,
        llm: LLM,
        response_mode: str = "compact",
        text_qa_template: PromptTemplate | None = None,
        refine_template: PromptTemplate | None = None,
        condense_template: PromptTemplate | None = None,
        verbose: bool = True,
    ) -> (RetrieverQueryEngine | CondenseQuestionChatEngine):

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

    automerging_engine = RetrieverQueryEngine.from_args(
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
        query_engine = automerging_engine,
        condense_question_prompt = condense_template
    )

    return automerging_engine