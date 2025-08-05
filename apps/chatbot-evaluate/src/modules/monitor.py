import os
import logging

from datetime import datetime
from typing import Sequence, Literal

from langfuse import Langfuse
from langfuse.api.resources.trace.types.traces import Traces
from langfuse.model import TraceWithFullDetails

from src.modules.logger import get_logger
from src.modules.utils import get_ssm_parameter

logging.getLogger("langfuse").setLevel(logging.INFO)
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
    debug=True,
)


def get_trace(trace_id: str, as_dict: bool = False) -> TraceWithFullDetails | dict:
    """
    Get a trace from Langfuse by its ID.
    Args:
        trace_id (str): The ID of the trace to retrieve.
        as_dict (bool): If True, return the trace as a dictionary. Defaults to False.
    Returns:
        TraceWithFullDetails | dict: The trace object or its dictionary representation.
    """

    LOGGER.info(f"Getting trace {trace_id} from Langfuse")
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
    """
    Get traces from Langfuse based on various filters.
    Args:
        user_id (str, optional): The ID of the user associated with the traces. Defaults to None.
        session_id (str, optional): The ID of the session associated with the traces. Defaults to None.
        from_timestamp (datetime, optional): The start timestamp for filtering traces. Defaults to None.
        to_timestamp (datetime, optional): The end timestamp for filtering traces. Defaults to None.
        order_by (str, optional): The field by which to order the traces. Defaults to None.
        tags (str | Sequence[str], optional): Tags to filter the traces. Defaults to None.
    Returns:
        Traces: A collection of traces matching the specified filters.
    """

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

    try:
        result = LANGFUSE_CLIENT.score(
            trace_id=trace_id,
            name=name,
            value=float(value),
            data_type=data_type,
            comment=comment,
        )
        LOGGER.info(
            f"Added score {name}: {value} in trace {trace_id}. Result: {result}"
        )
    except Exception as e:
        LOGGER.error(
            f"Error adding score {name} with value {value} to trace {trace_id}: {e}."
        )
        raise e
