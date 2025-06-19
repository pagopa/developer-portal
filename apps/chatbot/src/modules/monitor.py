import os
from datetime import datetime
from typing import Sequence, Literal

from langfuse import Langfuse
from langfuse.api.resources.trace.types.traces import Traces
from langfuse.model import TraceWithFullDetails

from src.modules.logger import get_logger
from src.modules.utils import get_ssm_parameter


LOGGER = get_logger(__name__)
LANGFUSE_PUBLIC_KEY = get_ssm_parameter(
    os.getenv("CHB_AWS_SSM_LANGFUSE_PUBLIC_KEY"),
    os.getenv("LANGFUSE_INIT_PROJECT_PUBLIC_KEY"),
)
LANGFUSE_SECRET_KEY = get_ssm_parameter(
    os.getenv("CHB_AWS_SSM_LANGFUSE_SECRET_KEY"),
    os.getenv("LANGFUSE_INIT_PROJECT_SECRET_KEY"),
)
LANGFUSE_HOST = os.getenv("CHB_LANGFUSE_HOST")
LANGFUSE_CLIENT = Langfuse(
    public_key=LANGFUSE_PUBLIC_KEY,
    secret_key=LANGFUSE_SECRET_KEY,
    host=LANGFUSE_HOST,
)


def get_trace(trace_id: str, as_dict: bool = False) -> TraceWithFullDetails | dict:

    LOGGER.warning(f"Getting trace {trace_id} from Langfuse")
    try:
        trace = LANGFUSE_CLIENT.fetch_trace(trace_id)
        trace = trace.data
    except Exception as e:
        LOGGER.error(e)

    if as_dict:
        return trace.dict()
    else:
        return trace


def get_traces(
    user_id: str | None = None,
    session_id: str | None = None,
    from_timestamp: datetime | None = None,
    to_timestamp: datetime | None = None,
    order_by: str | None = None,
    tags: str | Sequence[str] | None = None,
) -> Traces:

    try:
        traces = LANGFUSE_CLIENT.get_traces(
            user_id=user_id,
            session_id=session_id,
            from_timestamp=from_timestamp,
            to_timestamp=to_timestamp,
            order_by=order_by,
            tags=tags,
        )
    except Exception as e:
        LOGGER.error(e)

    return traces


def add_langfuse_score(
    trace_id: str,
    name: str,
    value: float,
    comment: str | None = None,
    data_type: Literal["NUMERIC", "BOOLEAN"] | None = None,
) -> None:
    """
    Add a score to a trace in Langfuse.

    Args:
        trace_id (str): The ID of the trace to which the score will be added.
        name (str): The name of the score.
        value (float): The value of the score.
        comment (str, optional): A comment for the score. Defaults to None.
        data_type (Literal["NUMERIC", "BOOLEAN"], optional): The type of the score.
            Defaults to None, which means the type will be inferred from the value.
    Returns:
        None
    """

    LANGFUSE_CLIENT.score(
        trace_id=trace_id,
        name=name,
        value=value,
        data_type=data_type,
        comment=comment,
    )
    LOGGER.warning("Add score {name}: {value} in trace {trace_id}.")
