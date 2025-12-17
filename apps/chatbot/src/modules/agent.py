from llama_index.core.llms.llm import LLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core import PromptTemplate
from llama_index.core.agent.workflow import ReActAgent

from src.modules.settings import SETTINGS
from src.modules.vector_index import load_index_redis
from src.modules.models import get_llm, get_embed_model
from src.modules.agent_tools import get_query_engine_tool


def get_agent(
    llm: LLM | None = None,
    embed_model: BaseEmbedding | None = None,
    text_qa_template: PromptTemplate | None = None,
    refine_template: PromptTemplate | None = None,
) -> ReActAgent:
    """Creates a ReActAgent with a QueryEngineTool and an identity tool.
    Args:
        react_system_str (str | None): Optional system string for the agent's formatter.
    Returns:
        ReActAgent: The configured ReActAgent instance.
    """

    llm_rag = llm if llm else get_llm()
    llm_agent = get_llm(temperature=SETTINGS.temperature_agent)
    embed_model = embed_model if embed_model else get_embed_model()

    index = load_index_redis(llm=llm_rag, embed_model=embed_model)
    query_engine_tool = get_query_engine_tool(
        index=index,
        llm=llm_rag,
        embed_model=embed_model,
        text_qa_template=text_qa_template,
        refine_template=refine_template,
    )

    agent = ReActAgent(
        name="rag_agent",
        description=(
            "A ReAct agent that uses RAG (Retrieval-Augmented Generation) to answer questions. "
            "It retrieves relevant information from the index and generates a structured response."
        ),
        tools=[query_engine_tool],
        llm=llm_agent,
    )

    agent.formatter.system_header = SETTINGS.react_system_str

    return agent
