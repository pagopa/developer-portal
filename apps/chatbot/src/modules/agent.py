from llama_index.core import VectorStoreIndex, PromptTemplate
from llama_index.core.agent.workflow import ReActAgent

from src.modules.settings import SETTINGS
from src.modules.models import get_llm
from src.modules.agent_tools import get_query_engine_tool, get_identity_tool


def get_agent(
    index: VectorStoreIndex,
    text_qa_template: PromptTemplate | None = None,
    refine_template: PromptTemplate | None = None,
) -> ReActAgent:
    """Creates a ReActAgent with a QueryEngineTool and an identity tool.
    Args:
        react_system_str (str | None): Optional system string for the agent's formatter.
    Returns:
        ReActAgent: The configured ReActAgent instance.
    """

    query_engine_tool = get_query_engine_tool(
        index=index,
        llm=get_llm(),
        text_qa_template=text_qa_template,
        refine_template=refine_template,
    )

    identity_tool = get_identity_tool(
        identity_prompt=SETTINGS.identity_prompt_str,
    )

    agent = ReActAgent(
        name="rag_agent",
        description=(
            "A ReAct agent that uses RAG (Retrieval-Augmented Generation) to answer questions. "
            "It retrieves relevant information from the index and generates a structured response."
        ),
        tools=[query_engine_tool, identity_tool],
        llm=get_llm(temperature=0.7),
    )

    agent.formatter.system_header = SETTINGS.react_system_str

    return agent
