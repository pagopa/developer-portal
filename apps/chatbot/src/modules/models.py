import os
from logging import getLogger

from llama_index.llms.bedrock_converse import BedrockConverse
from llama_index.embeddings.bedrock import BedrockEmbedding

from llama_index.llms.gemini import Gemini
from llama_index.embeddings.gemini import GeminiEmbedding
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from dotenv import load_dotenv

from src.modules.utils import get_ssm_parameter

load_dotenv()
logger = getLogger(__name__)

PROVIDER = os.getenv("CHB_PROVIDER", "google")
assert PROVIDER in ["aws", "google"]

GOOGLE_API_KEY = get_ssm_parameter(name=os.getenv("CHB_GOOGLE_API_KEY"))
AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_BEDROCK_REGION = os.getenv("CHB_AWS_BEDROCK_REGION")
AWS_GUARDRAIL_ID = os.getenv("CHB_AWS_GUARDRAIL_ID")
AWS_GUARDRAIL_VERSION = os.getenv("CHB_AWS_GUARDRAIL_VERSION")

MODEL_ID = os.getenv("CHB_MODEL_ID")
MODEL_TEMPERATURE = os.getenv("CHB_MODEL_TEMPERATURE", "0.3")
MODEL_MAXTOKENS = os.getenv("CHB_MODEL_MAXTOKENS", "768")
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")


def get_llm():

    if PROVIDER == "aws":
        
        llm = BedrockConverse(
            model=MODEL_ID,
            temperature=float(MODEL_TEMPERATURE),
            max_tokens=int(MODEL_MAXTOKENS),
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_BEDROCK_REGION
        )

    else:

        llm = Gemini(
            model=MODEL_ID,
            temperature=float(MODEL_TEMPERATURE),
            max_tokens=int(MODEL_MAXTOKENS),
            safety_settings={
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
            },
            api_key=GOOGLE_API_KEY,
        )

    logger.info(f"{MODEL_ID} LLM loaded successfully!")

    return llm


def get_embed_model():

    if PROVIDER == "aws":
        embed_model = BedrockEmbedding(
            model_name = EMBED_MODEL_ID,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_BEDROCK_REGION
        )
    else:
        embed_model = GeminiEmbedding(
            api_key=GOOGLE_API_KEY,
            model_name=EMBED_MODEL_ID,
        )
    logger.info(f"{EMBED_MODEL_ID} embegging model loaded successfully!")

    return embed_model
