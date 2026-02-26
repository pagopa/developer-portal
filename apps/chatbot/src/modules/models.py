import os
from google.genai import types

from llama_index.core.llms.llm import LLM
from llama_index.core.base.embeddings.base import BaseEmbedding

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def get_llm(
    provider: str | None = None,
    model_id: str | None = None,
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> LLM:
    """
    Returns an instance of the LLM based on the provider specified in the environment variable.
    The provider can be either 'google' or 'mock'. The function initializes the LLM with the model ID,
    temperature, and max tokens specified in the environment variables.
    Args:
        provider (str | None): The provider to use for the LLM. Defaults to the value of the `CHB_PROVIDER` environment variable.
        model_id (str | None): The model ID to use for the LLM. Defaults to the value of the `CHB_MODEL_ID` environment variable.
        temperature (float | None): The temperature to use for the LLM. Defaults to the value of the `CHB_MODEL_TEMPERATURE` environment variable.
        max_tokens (int | None): The maximum number of tokens to generate for the LLM. Defaults to the value of the `CHB_MODEL_MAXTOKENS` environment variable.
    Returns:
        LLM: An instance of the LLM class configured with the specified model ID, temperature, and max tokens.
    Raises:
        AssertionError: If the provider is not 'google' or 'mock'.
    """

    provider = provider or SETTINGS.provider
    model_id = model_id or SETTINGS.model_id
    temperature = temperature or SETTINGS.temperature_rag
    max_tokens = max_tokens or SETTINGS.max_tokens

    if provider == "google":
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

        llm = MockLLM(
            max_tokens=5,
        )
        LOGGER.info("Mock LLM loaded successfully!")
    else:
        raise AssertionError(f"Provider must be 'google' or 'mock'. Given {provider}.")

    return llm


def get_embed_model(
    provider: str | None = None,
    model_id: str | None = None,
    embed_batch_size: int | None = None,
    embed_dim: int | None = None,
    task_type: str | None = None,
    retries: int | None = None,
    retry_min_seconds: float | None = None,
) -> BaseEmbedding:
    """
    Returns an instance of the embedding model based on the provider specified in the environment variable.
    The provider can be either 'google' or 'mock'. The function initializes the embedding model with the
    model ID specified in the environment variables.
    Args:
        provider (str | None): The provider to use for the embedding model. Defaults to the value of the `CHB_PROVIDER` environment variable.
        model_id (str | None): The model ID to use for the embedding model. Defaults to the value of the `CHB_EMBED_MODEL_ID` environment variable.
        embed_batch_size (int | None): The batch size for embedding. Defaults to the value of the `CHB_EMBED_BATCH_SIZE` environment variable.
    Returns:
        BaseEmbedding: An instance of the BaseEmbedding class configured with the specified model ID.
    Raises:
        AssertionError: If the provider is not 'google' or 'mock'.
    """

    provider = provider or SETTINGS.provider
    model_id = model_id or SETTINGS.embed_model_id
    embed_batch_size = embed_batch_size or SETTINGS.embed_batch_size
    embed_dim = embed_dim or SETTINGS.embed_dim
    task_type = task_type or SETTINGS.embed_task
    retries = retries or SETTINGS.embed_retries
    retry_min_seconds = retry_min_seconds or SETTINGS.embed_retry_min_seconds

    if provider == "google":
        from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

        embed_model = GoogleGenAIEmbedding(
            model_name=model_id,
            api_key=SETTINGS.google_api_key,
            embed_batch_size=embed_batch_size,
            retries=retries,
            retry_min_seconds=retry_min_seconds,
            embedding_config=types.EmbedContentConfig(
                output_dimensionality=embed_dim,
                task_type=task_type,
            ),
        )
        LOGGER.info(f"{model_id} embedding model loaded successfully from Google!")

    elif provider == "mock":
        from llama_index.core import MockEmbedding

        embed_model = MockEmbedding(embed_dim=5)
        LOGGER.info("Mock embedding model loaded successfully!")

    else:
        raise AssertionError(f"Provider must be 'google' or 'mock'. Given {provider}.")

    return embed_model
