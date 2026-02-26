from llama_index.core.llms.llm import LLM
from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__)


def get_llm(
    provider: str | None = None,
    model_id: str | None = None,
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> LLM:
    """
    Returns an instance of the LLM based on the provider specified in settings.

    Args:
        provider: The provider to use ('google' or 'mock'). Defaults to SETTINGS.provider
        model_id: The model ID to use. Defaults to SETTINGS.model_id
        temperature: The temperature for response generation. Defaults to SETTINGS.temperature
        max_tokens: The maximum number of tokens to generate. Defaults to SETTINGS.max_tokens

    Returns:
        LLM: An instance of the LLM class configured with the specified parameters

    Raises:
        AssertionError: If the provider is not 'google' or 'mock'
        ValueError: If Google API key is missing when using 'google' provider
    """
    provider = provider or SETTINGS.provider
    model_id = model_id or SETTINGS.model_id
    temperature = temperature or SETTINGS.temperature
    max_tokens = max_tokens or SETTINGS.max_tokens
    if provider == "google":
        if not SETTINGS.google_api_key:
            raise ValueError(
                "Google API key is required. Set EXT_AWS_GOOGLE_API_KEY environment variable."
            )
        from llama_index.llms.google_genai import GoogleGenAI

        llm = GoogleGenAI(
            model=model_id,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=SETTINGS.google_api_key,
        )
        LOGGER.info(f"{model_id} LLM loaded successfully from Google!")
    elif provider == "mock":
        from llama_index.core.llms import MockLLM

        llm = MockLLM(max_tokens=max_tokens)
        LOGGER.info("Mock LLM loaded successfully!")
    else:
        raise AssertionError(
            f"Provider must be 'google' or 'mock'. Given '{provider}'."
        )
    return llm
