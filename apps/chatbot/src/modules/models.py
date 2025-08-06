import os

from llama_index.core.llms.llm import LLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.llms import MockLLM
from llama_index.core import MockEmbedding

from src.modules.logger import get_logger
from src.modules.utils import get_ssm_parameter


LOGGER = get_logger(__name__)
PROVIDER = os.getenv("CHB_PROVIDER", "google")
MODEL_ID = os.getenv("CHB_MODEL_ID", "gemini-2.0-flash")
MODEL_TEMPERATURE = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))
MODEL_MAXTOKENS = int(os.getenv("CHB_MODEL_MAXTOKENS", "768"))
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID", "text-embedding-004")
EMBED_BATCH_SIZE = int(os.getenv("CHB_EMBED_BATCH_SIZE", "100"))


def get_llm(
    provider: str | None = None,
    model_id: str | None = None,
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> LLM:
    """
    Returns an instance of the LLM based on the provider specified in the environment variable.
    The provider can be either 'aws', 'google', or 'mock'. The function initializes the LLM with the model ID,
    temperature, and max tokens specified in the environment variables.
    Args:
        provider (str | None): The provider to use for the LLM. Defaults to the value of the `CHB_PROVIDER` environment variable.
        model_id (str | None): The model ID to use for the LLM. Defaults to the value of the `CHB_MODEL_ID` environment variable.
        temperature (float | None): The temperature to use for the LLM. Defaults to the value of the `CHB_MODEL_TEMPERATURE` environment variable.
        max_tokens (int | None): The maximum number of tokens to generate for the LLM. Defaults to the value of the `CHB_MODEL_MAXTOKENS` environment variable.
    Returns:
        LLM: An instance of the LLM class configured with the specified model ID, temperature, and max tokens.
    Raises:
        AssertionError: If the provider is not 'aws', 'google', or 'mock'.
    """

    provider = provider or PROVIDER
    model_id = model_id or MODEL_ID
    temperature = temperature or MODEL_TEMPERATURE
    max_tokens = max_tokens or MODEL_MAXTOKENS

    if provider == "aws":
        from llama_index.llms.bedrock_converse import BedrockConverse

        llm = BedrockConverse(
            model=model_id,
            temperature=temperature,
            max_tokens=max_tokens,
            aws_access_key_id=os.getenv("CHB_AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("CHB_AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("CHB_AWS_BEDROCK_LLM_REGION"),
        )
        LOGGER.info(f"{model_id} LLM loaded successfully from AWS Bedrock!")

    elif provider == "google":
        from llama_index.llms.google_genai import GoogleGenAI

        GOOGLE_API_KEY = get_ssm_parameter(
            name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
            default=os.getenv("CHB_AWS_GOOGLE_API_KEY"),
        )

        llm = GoogleGenAI(
            model=model_id,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=GOOGLE_API_KEY,
        )
        LOGGER.info(f"{model_id} LLM loaded successfully from Google!")

    elif provider == "mock":
        llm = MockLLM(
            max_tokens=5,
        )
        LOGGER.info("Mock LLM loaded successfully!")
    else:
        raise AssertionError(
            f"Provider must be 'aws', 'google', or 'mock'. Given {provider}."
        )

    return llm


def get_embed_model(
    provider: str | None = None,
    model_id: str | None = None,
    embed_batch_size: int | None = None,
) -> BaseEmbedding:
    """
    Returns an instance of the embedding model based on the provider specified in the environment variable.
    The provider can be either 'aws', 'google', or 'mock'. The function initializes the embedding model with the
    model ID specified in the environment variables.
    Args:
        provider (str | None): The provider to use for the embedding model. Defaults to the value of the `CHB_PROVIDER` environment variable.
        model_id (str | None): The model ID to use for the embedding model. Defaults to the value of the `CHB_EMBED_MODEL_ID` environment variable.
        embed_batch_size (int | None): The batch size for embedding. Defaults to the value of the `CHB_EMBED_BATCH_SIZE` environment variable.
    Returns:
        BaseEmbedding: An instance of the BaseEmbedding class configured with the specified model ID.
    Raises:
        AssertionError: If the provider is not 'aws', 'google', or 'mock'.
    """

    provider = provider or PROVIDER
    model_id = model_id or EMBED_MODEL_ID
    embed_batch_size = embed_batch_size or EMBED_BATCH_SIZE

    if provider == "aws":
        from llama_index.embeddings.bedrock import BedrockEmbedding

        embed_model = BedrockEmbedding(
            model_name=model_id,
            aws_access_key_id=os.getenv("CHB_AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("CHB_AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("CHB_AWS_BEDROCK_EMBED_REGION"),
        )
        LOGGER.info(f"{model_id} embedding model loaded successfully from AWS Bedrock!")

    elif provider == "google":
        from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

        GOOGLE_API_KEY = get_ssm_parameter(
            name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"),
            default=os.getenv("CHB_AWS_GOOGLE_API_KEY"),
        )

        embed_model = GoogleGenAIEmbedding(
            model_name=model_id,
            api_key=GOOGLE_API_KEY,
            embed_batch_size=embed_batch_size,
        )
        LOGGER.info(f"{model_id} embedding model loaded successfully from Google!")

    elif provider == "mock":
        embed_model = MockEmbedding(embed_dim=5)
        LOGGER.info("Mock embedding model loaded successfully!")

    else:
        raise AssertionError(
            f"Provider must be 'aws', 'google', or 'mock'. Given {provider}."
        )

    return embed_model
