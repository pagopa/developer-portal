from llama_index.core import PromptTemplate
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor


def get_automerging_query_engine(
    index,
    llm,
    similarity_top_k: int,
    similarity_cutoff: float,
    response_mode: str = "compact",
    text_qa_template: PromptTemplate | None = None,
    refine_template: PromptTemplate | None = None,
    verbose: bool = True
):
    base_retriever = index.as_retriever(
        similarity_top_k=similarity_top_k
    )
    retriever = AutoMergingRetriever(
        base_retriever, 
        index.storage_context, 
        verbose=verbose
    )
    similarity_postprocessor = SimilarityPostprocessor(
        similarity_cutoff=similarity_cutoff
    )

    automerging_engine = RetrieverQueryEngine.from_args(
        retriever, 
        llm=llm, 
        response_mode=response_mode,
        node_postprocessors=[
            similarity_postprocessor
        ],
        text_qa_template=text_qa_template,
        refine_template=refine_template
    )

    return automerging_engine
