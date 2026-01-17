import json
import time
from datetime import datetime, timezone

from typing import Optional, List, Dict, Literal, Union
from langfuse import Langfuse
from langfuse.types import TraceContext
from langfuse._client.span import (
    LangfuseAgent,
    LangfuseChain,
    LangfuseEmbedding,
    LangfuseEvaluator,
    LangfuseEvent,
    LangfuseGeneration,
    LangfuseGuardrail,
    LangfuseRetriever,
    LangfuseSpan,
    LangfuseTool,
)

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.presidio import PresidioPII
from src.database_models import tables


LOGGER = get_logger(__name__, level=SETTINGS.log_level)
PRESIDIO = PresidioPII(config=SETTINGS.presidio_config)
LANGFUSE_CLIENT = Langfuse(
    public_key=SETTINGS.langfuse_public_key,
    secret_key=SETTINGS.langfuse_secret_key,
    host=SETTINGS.langfuse_host,
)
SPAN_TYPES = Union[
    LangfuseAgent,
    LangfuseChain,
    LangfuseEmbedding,
    LangfuseEvaluator,
    LangfuseEvent,
    LangfuseGeneration,
    LangfuseGuardrail,
    LangfuseRetriever,
    LangfuseSpan,
    LangfuseTool,
]


def link_spans_groups(spans: List[dict], root_span_id: str) -> List[dict]:
    """Links spans to their parent spans based on the parent_id field.
    Args:
        spans (List[dict]): The list of spans to link.
        root_span_id (str): The ID of the root span.
    Returns:
        List[dict]: The list of spans with their children linked.
    """

    for span in spans[1:]:
        parent_id = span.get("parent_id")
        if parent_id is None:
            span["parent_id"] = root_span_id
    return spans


def safe_json_load(value):
    """Tries to load a string as JSON, returns the original string on failure."""
    if not isinstance(value, str):
        return value
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return value


def int_to_datetime(ns_timestamp):
    """Converts a nanosecond timestamp to a timezone-aware datetime object."""
    return datetime.fromtimestamp(ns_timestamp / 1e9).replace(tzinfo=timezone.utc)


def get_children(all_spans: List[dict], parent_id: str) -> List[dict]:
    """Returns the child spans of a given parent span, sorted by start time."""
    children = sorted(
        [span for span in all_spans if span["parent_id"] == parent_id],
        key=lambda x: x["start_time"],
    )
    return children


def create_langfuse_child(
    span: SPAN_TYPES, child: dict, all_spans: List[dict], visited: set = None
) -> SPAN_TYPES:
    """Creates a Langfuse span from a child span dictionary and attaches it to the parent span."""
    
    if visited is None:
        visited = set()
    
    span_id = child["context"]["span_id"]
    
    # Cycle detection: if we've already visited this span, skip it
    if span_id in visited:
        LOGGER.warning(f"Cycle detected: span_id {span_id} already visited. Skipping to prevent infinite recursion.")
        return span
    
    visited.add(span_id)
    attributes = child["attributes"]
    span_kind = attributes["openinference.span.kind"]
    input_tokens = attributes.get("input_tokens", 0)
    output_tokens = attributes.get("output_tokens", 0)
    total_tokens = attributes.get("total_tokens", 0)
    if input_tokens and output_tokens and total_tokens:
        usage_details = {
            "input": input_tokens,
            "output": output_tokens,
            "total": total_tokens,
        }
    else:
        usage_details = None

    if span_kind == "SPAN":
        obs = span.start_observation(
            name=child["name"],
            as_type="span",
            input=PRESIDIO.mask_pii(attributes.get("input.value")),
            output=PRESIDIO.mask_pii(attributes.get("output.value")),
        )

    elif span_kind == "CHAIN":
        obs = span.start_observation(
            name=child["name"],
            as_type="chain",
            input=PRESIDIO.mask_pii(attributes.get("input.value")),
            output=PRESIDIO.mask_pii(attributes.get("output.value")),
            usage_details=usage_details,
        )

    elif span_kind == "LLM":
        obs = span.start_observation(
            name=child["name"],
            as_type="generation",
            input=PRESIDIO.mask_pii(attributes.get("input.value")),
            output=PRESIDIO.mask_pii(attributes.get("output.value")),
            model=attributes.get("llm.model_name"),
            model_parameters=safe_json_load(
                child["attributes"].get("llm.invocation_parameters")
            ),
        )

    elif span_kind == "EMBEDDING":
        obs = span.start_observation(
            name=child["name"],
            as_type="embedding",
            input=PRESIDIO.mask_pii(attributes.get("input.value")),
            output=attributes.get("embedding.embeddings.0.embedding.vector"),
            model=attributes.get("embedding.model_name"),
        )

    elif span_kind == "TOOL":
        obs = span.start_observation(
            name=child["name"],
            as_type="tool",
            input=PRESIDIO.mask_pii(attributes.get("input.value")),
            output=PRESIDIO.mask_pii(attributes.get("output.value")),
        )

    elif span_kind == "RETRIEVER":
        obs = span.start_observation(
            name=child["name"],
            as_type="retriever",
            input=PRESIDIO.mask_pii(attributes.get("input.value")),
            output=PRESIDIO.mask_pii(attributes.get("output.value")),
        )
    else:
        LOGGER.warning(f"UNKNOWN SPAN KIND: {span_kind}. Set it as span type")
        obs = span.start_observation(
            name=child["name"],
            as_type="span",
            input=PRESIDIO.mask_pii(attributes.get("input.value")),
            output=PRESIDIO.mask_pii(attributes.get("output.value")),
        )

    children = get_children(all_spans, span_id)
    if children:
        [create_langfuse_child(obs, child, all_spans, visited) for child in children]
        duration_children = sum(
            [
                (
                    int_to_datetime(child["end_time"])
                    - int_to_datetime(child["start_time"])
                ).total_seconds()
                for child in children
            ]
        )
    else:
        duration_children = 0

    duration = (
        int_to_datetime(child["end_time"]) - int_to_datetime(child["start_time"])
    ).total_seconds() - duration_children
    time.sleep(duration)
    obs.end()


def mask_chat_history(messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Masks PII in the chat history.
    Args:
        chat_history (List[Dict[str, str]]): The chat history.

    Returns:
        List[Dict[str, str]]: The masked chat history.
    """

    chat_history = []
    if messages:
        for message in messages:
            user_content = message["question"]
            assistant_content = message["answer"]
            chat_history.append(
                {
                    "user": PRESIDIO.mask_pii(user_content),
                    "assistant": PRESIDIO.mask_pii(assistant_content),
                }
            )
    return chat_history


def create_langfuse_trace(
    trace_id: str,
    user_id: str,
    session_id: str,
    query: str,
    messages: List[Dict[str, str]],
    response: str,
    contexts: List[str],
    tags: List[str],
    spans: List[dict],
    query_for_database: dict,
) -> None:
    """Creates a Langfuse trace from a list of span dictionaries.
    Args:
        trace_id (str): The ID of the trace.
        user_id (str): The ID of the user.
        session_id (str): The ID of the session.
        query (str): The user query.
        messages (List[Dict[str, str]]): The chat messages between the user and the assistant.
        response (str): The chat response.
        contexts (List[str]): The retrieved contexts.
        tags (List[str]): The tags for the trace.
        spans (List[dict]): The list of span dictionaries.
        query_for_database (dict): The query data to save to the database.
    """

    span_root = spans[0]
    root_span_id = span_root["context"]["span_id"]
    spans = link_spans_groups(spans, root_span_id)
    root = LANGFUSE_CLIENT.start_span(
        name=trace_id, trace_context=TraceContext(trace_id=trace_id)
    )

    root_children = get_children(spans, root_span_id)
    for child in root_children:
        child["attributes"]["openinference.span.kind"] = "SPAN"
        [create_langfuse_child(root, child, spans) for child in root_children]

    query_masked = PRESIDIO.mask_pii(query)
    response_masked = PRESIDIO.mask_pii(response)

    root.update_trace(
        input={
            "query": query_masked,
            "chat_history": mask_chat_history(messages),
        },
        output=response_masked,
        metadata={"contexts": contexts},
        user_id=user_id,
        session_id=session_id,
        tags=tags,
    )
    root.end()
    LANGFUSE_CLIENT.flush()
    LOGGER.info(f"Created trace with ID: {trace_id} successfully!")

    query_for_database["question"] = query_masked
    query_for_database["answer"] = response_masked
    save_query_to_database(query_for_database=query_for_database)


def save_query_to_database(query_for_database: dict) -> None:
    tables["queries"].put_item(Item=query_for_database)


def add_langfuse_score(
    trace_id: str,
    name: str,
    score: float,
    comment: str | None = None,
    data_type: Optional[Literal["NUMERIC", "BOOLEAN"]] = None,
    query_for_database: dict = {},
) -> None:
    """Adds a score to an existing Langfuse trace.
    Args:
        trace_id (str): The ID of the trace.
        name (str): The name of the score.
        score (float): The score value.
        comment (str | None, optional): An optional comment for the score. Defaults to None.
        data_type (Optional[Literal["NUMERIC", "BOOLEAN"]], optional): The data type of the score.
            Defaults to None.
    """

    try:
        LANGFUSE_CLIENT.create_score(
            trace_id=trace_id,
            name=name,
            value=score,
            data_type=data_type,
            comment=comment,
        )
        LANGFUSE_CLIENT.flush()
        LOGGER.info(f"Added {name}: {score} to trace with ID: {trace_id} successfully!")
    except Exception as e:
        LOGGER.error(f"Failed to add score to trace {trace_id}: {e}")

    save_feedback_to_database(query_for_database=query_for_database)


def save_feedback_to_database(query_for_database: dict) -> None:
    if "feedback" in query_for_database:
        if "user_comment" in query_for_database["feedback"]:
            query_for_database["feedback"]["user_comment"] = PRESIDIO.mask_pii(query_for_database["feedback"]["user_comment"])
    
            if (
                "id" in query_for_database and \
                "sessionId" in query_for_database and \
                "badAnswer" in query_for_database and \
                "feedback" in query_for_database
            ):
                tables["queries"].update_item(
                    Key={"sessionId": query_for_database["sessionId"], "id": query_for_database["id"]},
                    UpdateExpression="SET #badAnswer = :badAnswer, #feedback = :feedback",
                    ExpressionAttributeNames={
                        "#badAnswer": "badAnswer",
                        "#feedback": "feedback",
                    },
                    ExpressionAttributeValues={
                        ":badAnswer": query_for_database["badAnswer"],
                        ":feedback": query_for_database["feedback"],
                    },
                    ReturnValues="ALL_NEW",
                )
    else:
        if (
            "id" in query_for_database and \
            "sessionId" in query_for_database and \
            "badAnswer" in query_for_database
        ):
            tables["queries"].update_item(
                Key={"sessionId": query_for_database["sessionId"], "id": query_for_database["id"]},
                UpdateExpression="SET #badAnswer = :badAnswer",
                ExpressionAttributeNames={
                    "#badAnswer": "badAnswer"
                },
                ExpressionAttributeValues={
                    ":badAnswer": query_for_database["badAnswer"]
                },
                ReturnValues="ALL_NEW",
            )
