import datetime
import logging
from typing import List

from src.app.schemas import Query, QueryResponse
from src.modules import SETTINGS

LOGGER = logging.getLogger(__name__)


def prepare_body_to_return(
    query: Query,
    session: dict | None,
    answer: str,
    answer_json: dict,
    trace_id: str,
    now: datetime,
) -> QueryResponse:

    if query.queriedAt is None:
        queriedAt = now.isoformat()
    else:
        queriedAt = query.queriedAt

    createdAt = now.isoformat()
    createdAtDate = createdAt[:10]

    bodyToReturn = QueryResponse(
        id=trace_id,
        sessionId=session["id"],
        question=query.question,
        answer=answer,
        createdAt=createdAt,
        createdAtDate=createdAtDate,
        queriedAt=queriedAt,
        badAnswer=False,
        chips=answer_json.get("chips", []),
    )

    return bodyToReturn


def prepare_body_to_save(
    bodyToReturn: QueryResponse,
    query: Query,
    answer: str,
    answer_json: dict,
    now: datetime,
) -> dict:

    days = SETTINGS.expire_days
    expires_at = int((now + datetime.timedelta(days=days)).timestamp())

    bodyToSave = bodyToReturn.model_dump()
    bodyToSave["question"] = query.question
    bodyToSave["answer"] = answer
    bodyToSave["topics"] = answer_json.get("products", [])
    bodyToSave["expiresAt"] = expires_at

    return bodyToSave


def fix_unbalanced_code_blocks(text: str) -> str:
    """
    Ensures code blocks delimited by \\n``` are balanced.
    If unbalanced, removes the last dangling delimiter.
    """
    count = text.count("\n```")
    if count % 2 == 1:  # unbalanced
        last_index = text.rfind("\n```")
        if last_index != -1:
            text = text[:last_index] + text[last_index + 4 :]
    return text


def get_final_response(response_str: str, references: List[str]) -> str:

    response_str = fix_unbalanced_code_blocks(response_str)
    unique_references = list(dict.fromkeys(references))

    if len(unique_references) > 0:
        response_str += "\n\nRif:"
        for ref in unique_references:
            response_str += "\n" + ref

    return response_str
