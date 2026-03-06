from llama_index.core.tools import FunctionTool

from src.modules.models import get_llm
from src.modules.structured_outputs import FollowUpQuestionsOutput, DiscoveryOutput


CHIPS_TOOL_NAME = "FollowUpQuestionsTool"


async def generate_questions(
    query_str: str, rag_output_devportal: str, rag_output_cittadino: str
) -> DiscoveryOutput:
    """
    Use this tool when a user's query is ambiguous and could apply to both
    technical developers (DevPortal) and end-users (CittadinoRAGTool).
    It returns two specific questions to help the user choose the right path.
    """

    llm = get_llm()
    sllm = llm.as_structured_llm(output_cls=FollowUpQuestionsOutput)

    prompt = (
        f"Given the user query: {query_str}\n\n"
        f"Given the following context retrieved from the devportal documentation:\n{rag_output_devportal}\n\n"
        f"Given the following context retrieved from the cittadino documentation:\n{rag_output_cittadino}\n\n"
        "Generate a list of questions from the user's perspective (e.g., 'how do I ...', 'how can I ...') "
        "that help them get more detailed information based on the provided context.\n"
        "The questions should be specific and relevant to the information retrieved from both sources, and should help the user explore topics related to the information already retrieved.\n"
        "Answer: [your answer here (in the same language as the user query)]"
    )

    response = await sllm.acomplete(prompt)
    return response.raw


def follow_up_questions_tool(name: str | None = None) -> FunctionTool:
    """A tool to generate follow-up questions for the user."""

    name = name if name else CHIPS_TOOL_NAME

    return FunctionTool.from_defaults(
        async_fn=generate_questions,
        name=name,
        description=(
            "Use this tool AFTER the RAG tools have been used to generate follow-up questions.\n"
            "The 'rag_output_devportal' parameter should contain the observations from the previous DevPortalRAGTool calls.\n"
            "The 'rag_output_cittadino' parameter should contain the observations from the previous CittadinoRAGTool calls.\n"
            "This helps the user explore topics related to the information already retrieved.\n"
            "If you do not call this tool, do not generate any follow-up questions."
        ),
    )
