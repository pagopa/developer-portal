from llama_index.core.tools import FunctionTool

from src.modules.models import get_llm
from src.modules.documents import get_product_list
from src.modules.structured_outputs import FollowUpQuestionsOutput, DiscoveryOutput


DEVPORTAL_PRODUCTS = get_product_list() + ["api", "webinars"]
DEVPORTAL_RAG_TOOL_DESCRIPTION = (
    f"Use this tool for all technical, architectural, and integration-related queries regarding PagoPA Developer Portal products: {DEVPORTAL_PRODUCTS}. "
    "Use this tool when the user is an IT professional or a developer seeking to integrate or manage the PagoPA Developer Portal products. "
    "It contains API specifications, authentication methods, SDKs, technical onboarding for institutions, and backend configuration. "
    "DO NOT use this for general 'how to use' questions from citizens. "
    "Use this tool for API specifications, SDKs, technical onboarding processes for institutions (Ente Creditore) and PSPs, "
    "authentication methods (API Keys), environment configurations (checkout, eCommerce), and technical troubleshooting for developers. "
)
CITTADINO_RAG_TOOL_DESCRIPTION = (
    "Use this tool for all queries related to the end-user (citizen) experience of Italian digital platforms. "
    "This tool contains comprehensive information on the PagoPA products: SEND (Notifiche Digitali), the App IO, and the PagoPA payment ecosystem from a user's perspective. "
    "Consult this tool for questions about receiving digital notifications, using the App IO interface, paying taxes or fines as a citizen, "
    "troubleshooting payment receipts, and general help center inquiries (FAQ). "
    "DO NOT use this for technical integration or API queries. "
)


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
        "Generate a list of questions from user prospective (i.e. 'how do I ...', 'how can I ...', 'what does the service ...') that help him to retrieve "
        "more information from the developer or citizen portal documentation.\n"
        "The current language of the user is: (user's language).\n"
        "Answer: [your answer here (In the same language as the user's question)]"
    )

    response = sllm.complete(prompt)

    return DiscoveryOutput(follow_up_questions=response.raw.follow_up_questions)


def follow_up_questions_tool(name: str) -> FunctionTool:
    """A tool to generate follow-up questions for the user."""

    return FunctionTool.from_defaults(
        async_fn=generate_questions,
        name=name,
        description=(
            "Use this tool as your last one and ONLY when you used BOTH the DevPortalRAGTool and the CittadinoRAGTool.\n"
            "This tool has the aim to generate follow-up questions for the user from its prospective."
            "This tool helps narrow down the user's persona."
        ),
    )
