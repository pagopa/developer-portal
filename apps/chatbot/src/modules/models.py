import os
from logging import getLogger

from llama_index.core.llms.llm import LLM
from llama_index.core.base.embeddings.base import BaseEmbedding

from src.modules.utils import get_ssm_parameter


logger = getLogger(__name__)

PROVIDER = os.getenv("CHB_PROVIDER", "google")
MODEL_ID = os.getenv("CHB_MODEL_ID")
MODEL_TEMPERATURE = float(os.getenv("CHB_MODEL_TEMPERATURE", "0.3"))
MODEL_MAXTOKENS = int(os.getenv("CHB_MODEL_MAXTOKENS", "768"))
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")


def get_llm() -> LLM:

    if PROVIDER == "aws":
        from llama_index.llms.bedrock_converse import BedrockConverse

        AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
        AWS_BEDROCK_LLM_REGION = os.getenv("CHB_AWS_BEDROCK_LLM_REGION")

        llm = BedrockConverse(
            model=MODEL_ID,
            temperature=MODEL_TEMPERATURE,
            max_tokens=MODEL_MAXTOKENS,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_BEDROCK_LLM_REGION,
        )

    elif PROVIDER == "google":
        from llama_index.llms.google_genai import GoogleGenAI

        GOOGLE_API_KEY = get_ssm_parameter(name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"))

        llm = GoogleGenAI(
            model=MODEL_ID,
            temperature=MODEL_TEMPERATURE,
            max_tokens=MODEL_MAXTOKENS,
            api_key=GOOGLE_API_KEY,
        )
    else:
        raise AssertionError(f"Provider must be 'aws' or 'google'. Given {PROVIDER}.")

    logger.info(f"{MODEL_ID} LLM loaded successfully!")

    return llm


def get_embed_model() -> BaseEmbedding:

    if PROVIDER == "aws":
        from llama_index.embeddings.bedrock import BedrockEmbedding

        AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
        AWS_BEDROCK_EMBED_REGION = os.getenv("CHB_AWS_BEDROCK_EMBED_REGION")

        embed_model = BedrockEmbedding(
            model_name=EMBED_MODEL_ID,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_BEDROCK_EMBED_REGION,
        )
    elif PROVIDER == "google":
        from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

        GOOGLE_API_KEY = get_ssm_parameter(name=os.getenv("CHB_AWS_SSM_GOOGLE_API_KEY"))

        embed_model = GoogleGenAIEmbedding(
            model_name=EMBED_MODEL_ID,
            api_key=GOOGLE_API_KEY,
            embed_batch_size=100,
        )
    else:
        raise AssertionError(f"Provider must be 'aws' or 'google'. Given {PROVIDER}.")
    logger.info(f"{EMBED_MODEL_ID} embegging model loaded successfully!")

    return embed_model
