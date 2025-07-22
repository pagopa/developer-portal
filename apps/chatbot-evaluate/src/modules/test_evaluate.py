import os
import yaml
from pathlib import Path

from src.modules.logger import get_logger
from src.modules.judge import Judge


LOGGER = get_logger(__name__)
CWF = Path(__file__)
ROOT = CWF.parent.parent.parent.absolute().__str__()
PROVIDER = "mock"
PROMPTS = yaml.safe_load(open(os.path.join(ROOT, "config", "prompts.yaml"), "r"))
JUDGE = Judge(provider=PROVIDER, prompts=PROMPTS)
WEBSITE_URL = os.getenv("CHB_WEBSITE_URL")


def test_evaluation() -> None:

    contexts = [
        "text text text text text",
        "text text text text text",
        "text text text text text",
        "text text text text text",
    ]
    query_str = "text text text text text"
    response_str = "text text text text text"
    scores = JUDGE.evaluate(
        trace_id="test_trace_id",
        query_str=query_str,
        response_str=response_str,
        retrieved_contexts=contexts,
    )
