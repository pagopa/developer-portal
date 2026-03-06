from typing import Callable, List, Union

from llama_index.core.tools import BaseTool
from llama_index.core.llms.llm import LLM
from llama_index.core.agent.workflow import ReActAgent

from src.modules.settings import SETTINGS
from src.modules.models import get_llm
from src.modules.structured_outputs import DiscoveryOutput


DISCOVERY_NAME = "DiscoveryAgent"
DEFAULT_DESCRIPTION = (
    "This agent is designed to answer questions about the world and perform actions using tools. "
    "It uses a ReAct reasoning process to determine the best course of action based on the input question and the available tools."
)


def get_discovery_agent(
    name: str | None = None,
    description: str | None = None,
    tools: List[Union[BaseTool, Callable]] | None = None,
    llm: LLM | None = None,
) -> ReActAgent:
    """Create and configure a ReActAgent instance.

    Args:
        name: Optional name for the agent. If not provided, ``DEFAULT_NAME`` is used.
        description: Optional description of the agent's role. If not provided,
            ``DEFAULT_DESCRIPTION`` is used.
        tools: Optional list of tools (``BaseTool`` instances or callables) that
            the agent can use. If ``None``, the agent is created without tools.
        llm: Optional LLM to use for the agent. If not provided, a default LLM
            is created using the current settings.
    Returns:
        ReActAgent: The configured ReActAgent instance.
    """

    name = name if name else DEFAULT_NAME
    description = description if description else DEFAULT_DESCRIPTION
    llm = llm if llm else get_llm(temperature=SETTINGS.temperature_agent)

    agent = ReActAgent(
        name=name,
        description=description,
        system_prompt=SETTINGS.discovery_system_prompt_str,
        tools=tools,
        llm=llm,
        output_cls=DiscoveryOutput,
    )

    agent.formatter.system_header = SETTINGS.react_system_str

    return agent
