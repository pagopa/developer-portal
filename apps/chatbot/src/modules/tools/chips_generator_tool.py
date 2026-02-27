from llama_index.core.tools import FunctionTool

from src.modules.models import get_llm
from src.modules.tools.rag_tool import (
    DEVPORTAL_RAG_TOOL_DESCRIPTION,
    CITTADINO_RAG_TOOL_DESCRIPTION,
)
from src.modules.structured_outputs import FollowUpQuestionsOutput, DiscoveryOutput


async def generate_questions(query_str: str) -> DiscoveryOutput:
    """
    Use this tool when a user's query is ambiguous and could apply to both
    technical developers (DevPortal) and end-users (CittadinoRAGTool).
    It returns two specific questions to help the user choose the right path.
    """

    llm = get_llm()
    sllm = llm.as_structured_llm(output_cls=FollowUpQuestionsOutput)

    prompt = (
        f"given the user query: {query_str}\n\nGiven the DevPortalRAGTool description:\n{DEVPORTAL_RAG_TOOL_DESCRIPTION}\n\n"
        f"Given the CittadinoRAGTool description:\n{CITTADINO_RAG_TOOL_DESCRIPTION}\n\n"
        "Generate a list of questions from user perspective (i.e. 'how do I ...', 'how can I ...', 'what does the service ...') that help him to retrieve "
        "more information from the developer or citizen portal documentation.\n"
        "The current language of the user is: (user's language).\n"
        "Answer: [your answer here (In the same language as the user's question)]"
    )

    response = await sllm.acomplete(prompt)

    return DiscoveryOutput(follow_up_questions=response.raw.follow_up_questions)


def follow_up_questions_tool(name: str) -> FunctionTool:
    """A tool to generate follow-up questions for the user."""

    return FunctionTool.from_defaults(
        async_fn=generate_questions,
        name=name,
        description=(
            "Use this tool ONLY WHEN YOU CALLED BOTH THE DevPortalRAGTool and the CittadinoRAGTool.\n"
            "This tool generates follow-up questions for the user perspective.\n"
            "In this way the user can choose a question to enter in detail in one of the documentations holded by DevPortalRAGTool and the CittadinoRAGTool.\n"
            "If you do not call this tool, do not generate any follow-up questions.\n"
        ),
    )
