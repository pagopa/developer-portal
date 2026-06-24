from llama_index.core.tools import FunctionTool


IDENTITY_TOOL_NAME = "IdentityTool"


def get_identity() -> str:
    """
    Use this tool when a user asks about your identity, your name,
    who you are, who made you, or any question about yourself.
    Returns the assistant's identity information.
    """

    return (
        "I am Discovery, the official virtual assistant for PagoPA S.p.A. "
        "I am designed to provide factual, helpful, and concise information "
        "regarding PagoPA documentation."
    )


def identity_tool() -> FunctionTool:
    """A tool that returns the chatbot's identity."""

    return FunctionTool.from_defaults(
        fn=get_identity,
        name=IDENTITY_TOOL_NAME,
        description=(
            "Tool to retrieve identity information. "
            "Use this tool when the user asks who you are, what your name is, "
            "who created you, or any question about your identity. "
            "This tool takes no parameters."
        ),
    )
