from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor


def get_automerging_query_engine(
    index,
    llm,
    similarity_top_k=12,
    similarity_cutoff=0.5,
    response_mode="compact",
    text_qa_template=None,
    refine_template=None,
    verbose=True
):
    base_retriever = index.as_retriever(
        similarity_top_k=similarity_top_k
    )
    retriever = AutoMergingRetriever(
        base_retriever, 
        index.storage_context, 
        verbose=verbose
    )
    postprocessor = SimilarityPostprocessor(similarity_cutoff=similarity_cutoff)

    automerging_engine = RetrieverQueryEngine.from_args(
        retriever, 
        llm=llm, 
        response_mode=response_mode,
        node_postprocessors=[postprocessor],
        text_qa_template=text_qa_template,
        refine_template=refine_template
    )

    return automerging_engine
