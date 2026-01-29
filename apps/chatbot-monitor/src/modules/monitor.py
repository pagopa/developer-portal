from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Dict, Literal, Union, Any
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
from src.modules.codec import safe_json_load


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


def get_children(all_spans: List[dict], parent_id: str) -> List[dict]:
    """Returns the child spans of a given parent span, sorted by start time."""
    children = sorted(
        [span for span in all_spans if span["parent_id"] == parent_id],
        key=lambda x: x["start_time"],
    )
    return children


def nanoseconds_to_datetime(ns_timestamp):
    """Convert nanosecond timestamp to datetime object."""
    return datetime.fromtimestamp(ns_timestamp / 1_000_000_000)


def get_latency(start_time: int, end_time: int) -> float:
    """Calculate latency in seconds."""
    return nanoseconds_to_datetime(end_time - start_time).timestamp()


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


def process_span(
    span: Dict[str, Any],
    parent_span: LangfuseSpan = None,
) -> SPAN_TYPES:
    """Process a span and create a Langfuse observation.

    Args:
        span (Dict[str, Any]): The span to process.
        parent_span (LangfuseSpan, optional): The parent Langfuse span. Defaults to None.
        all_spans (List[Dict[str, Any]], optional): The list of all spans. Defaults to [].
    Returns:
        SPAN_TYPES: The created Langfuse observation.
    """

    span_id = span["context"]["span_id"]
    span_name = span["name"]

    attributes = span.get("attributes", {})
    input_value = safe_json_load(PRESIDIO.mask_pii(attributes.get("input.value", "")))
    output_value = safe_json_load(PRESIDIO.mask_pii(attributes.get("output.value", "")))

    # Determine span kind
    span_kind = attributes.get("openinference.span.kind", "CHAIN")

    if span_kind == "LLM":
        observation = parent_span.start_observation(
            name=span_name,
            as_type="generation",
            input=input_value,
            output=output_value,
            model=attributes.get("llm.model_name"),
            model_parameters=safe_json_load(
                span["attributes"].get("llm.invocation_parameters")
            ),
            metadata={
                "latency": get_latency(span["start_time"], span["end_time"]),
            },
        )

    elif span_kind == "EMBEDDING":
        observation = parent_span.start_observation(
            name=span_name,
            as_type="embedding",
            input=input_value,
            metadata={"latency": get_latency(span["start_time"], span["end_time"])},
            output=attributes.get("embedding.embeddings.0.embedding.vector"),
            model=attributes.get("embedding.model_name"),
        )
    else:
        observation = parent_span.start_observation(
            name=span_name,
            as_type=span_kind.lower(),
            input=input_value,
            output=output_value,
            metadata={"latency": get_latency(span["start_time"], span["end_time"])},
        )

    observation.end()


def create_langfuse_trace(
    trace_id: str,
    user_id: str,
    session_id: str,
    query: str,
    messages: List[Dict[str, str]],
    response: str,
    contexts: List[str],
    tags: List[str],
    spans: List[Dict[str, Any]],
    query_for_database: dict,
    trace_name: str = "Discovery ReAct Orchestrator",
):
    """
    Create a Langfuse trace from the provided spans data using manual observations.

    Args:
        trace_id (str): The ID of the trace.
        user_id (str): The ID of the user.
        session_id (str): The ID of the session.
        query (str): The user query.
        messages (List[Dict[str, str]]): The chatbot history.
        response (str): The response string.
        contexts (List[str]): The list of context strings.
        tags (List[str]): The list of tag strings.
        spans (List[Dict[str, Any]]): The list of span dictionaries.
        query_for_database (dict): The query data to save to the database.
        trace_name (str): The name of the trace.
    Returns:
        None (trace is created and sent to Langfuse)
    """
    if not spans:
        LOGGER.error("No spans given in input, skipping Langfuse trace creation.")
        return None

    LOGGER.info(f"Creating trace with ID: {trace_id}")
    root_span = spans[0]
    root_span_id = root_span["context"]["span_id"]
    linked_spans = link_spans_groups(spans, root_span_id)
    sorted_spans = sorted(linked_spans, key=lambda x: x["start_time"])

    root = LANGFUSE_CLIENT.start_span(
        name=trace_name,
        trace_context=TraceContext(trace_id=trace_id),
    )

    for span in sorted_spans[1:]:
        process_span(span, root)

    masked_query = PRESIDIO.mask_pii(query)
    masked_response = PRESIDIO.mask_pii(response)

    root.update_trace(
        input={
            "query": masked_query,
            "chat_history": mask_chat_history(messages),
        },
        output=masked_response,
        tags=tags if tags else ["none"],
        user_id=user_id,
        session_id=session_id,
        metadata={
            "latency": get_latency(
                root_span["start_time"], sorted_spans[-1]["end_time"]
            ),
            "contexts": contexts,
        },
    )

    root.end()
    LANGFUSE_CLIENT.flush()

    query_for_database["question"] = masked_query
    query_for_database["answer"] = masked_response
    save_query_to_database(query_for_database=query_for_database)


def convert_floats_to_decimal(obj: Any) -> Any:
    """Recursively convert float values to Decimal for DynamoDB compatibility.

    Args:
        obj: The object to convert (can be dict, list, float, or any other type)

    Returns:
        The object with all float values converted to Decimal
    """
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_floats_to_decimal(item) for item in obj]
    else:
        return obj


def save_query_to_database(query_for_database: dict) -> None:
    tables["queries"].put_item(Item=convert_floats_to_decimal(query_for_database))


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
    # Handle None or invalid input
    if not query_for_database or not isinstance(query_for_database, dict):
        return

    if "feedback" in query_for_database:
        if "user_comment" in query_for_database["feedback"]:
            query_for_database["feedback"]["user_comment"] = PRESIDIO.mask_pii(
                query_for_database["feedback"]["user_comment"]
            )

            if (
                "id" in query_for_database
                and "sessionId" in query_for_database
                and "badAnswer" in query_for_database
                and "feedback" in query_for_database
            ):
                tables["queries"].update_item(
                    Key={
                        "sessionId": query_for_database["sessionId"],
                        "id": query_for_database["id"],
                    },
                    UpdateExpression="SET #badAnswer = :badAnswer, #feedback = :feedback",
                    ExpressionAttributeNames={
                        "#badAnswer": "badAnswer",
                        "#feedback": "feedback",
                    },
                    ExpressionAttributeValues=convert_floats_to_decimal(
                        {
                            ":badAnswer": query_for_database["badAnswer"],
                            ":feedback": query_for_database["feedback"],
                        }
                    ),
                    ReturnValues="ALL_NEW",
                )
    else:
        if (
            "id" in query_for_database
            and "sessionId" in query_for_database
            and "badAnswer" in query_for_database
        ):
            tables["queries"].update_item(
                Key={
                    "sessionId": query_for_database["sessionId"],
                    "id": query_for_database["id"],
                },
                UpdateExpression="SET #badAnswer = :badAnswer",
                ExpressionAttributeNames={"#badAnswer": "badAnswer"},
                ExpressionAttributeValues=convert_floats_to_decimal(
                    {":badAnswer": query_for_database["badAnswer"]}
                ),
                ReturnValues="ALL_NEW",
            )
