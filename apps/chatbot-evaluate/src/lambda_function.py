import os
import yaml
from pathlib import Path

from src.modules.judge import Judge
from src.modules.logger import get_logger

LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.absolute().__str__()
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
JUDGE = Judge(prompts=PROMPTS)


def lambda_handler(event, context):
    LOGGER.debug(f"- - - - - - - - event: {event}")

    result = JUDGE.evaluate(
        query_str=event.get("query_str", ""),
        response_str=event.get("response_str", ""),
        retrieved_context=event.get("retrieved_context", []),
        trace_id=event.get("trace_id", ""),
        messages=event.get("messages", None),
    )

    return {"statusCode": 200, "result": result}
