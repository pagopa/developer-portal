import os
import boto3
import logging
from dotenv import load_dotenv

load_dotenv()


AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_BEDROCK_REGION = os.getenv("CHB_AWS_BEDROCK_REGION")
AWS_GUARDRAIL_ID = os.getenv("CHB_AWS_GUARDRAIL_ID")
AWS_GUARDRAIL_VERSION = os.getenv("CHB_AWS_GUARDRAIL_VERSION")
BEDROCK_RUNTIME_CLIENT = boto3.client(
    "bedrock-runtime",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_BEDROCK_REGION
)


def safety_check_aws(query_str: str) -> str | None:

    response = BEDROCK_RUNTIME_CLIENT.apply_guardrail(
        guardrailIdentifier=AWS_GUARDRAIL_ID,
        guardrailVersion=AWS_GUARDRAIL_VERSION,
        source='INPUT',
        content=[
            {
                'text': {
                    'text': query_str,
                    'qualifiers': [
                        'grounding_source', 'query', 'guard_content',
                    ]
                }
            },
        ]
    )
    
    latency = response["assessments"][0]["invocationMetrics"]["guardrailProcessingLatency"]
    logging.info(f"[guardrail.py] AWS Guardrail latency [ms]: {latency}")

    if response["action"] == "GUARDRAIL_INTERVENED":
        block_type = response["assessments"][0]["contentPolicy"]["filters"][0]["type"]
        block_confidence = response["assessments"][0]["contentPolicy"]["filters"][0]["confidence"]
        logging.info(f"[guardrail.py] AWS Guardrail blocked query! Detected {block_type} with confidence {block_confidence}.")
        return response["outputs"][0]["text"]
    else:
        return None