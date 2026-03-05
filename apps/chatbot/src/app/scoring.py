import json
import logging

from src.modules.codec import compress_payload
from src.app import sqs_queue_monitor
from src.app.schemas import QueryFeedback

LOGGER = logging.getLogger(__name__)


def add_langfuse_score_query(
    query_id: str, query_feedback: QueryFeedback, query_for_database: dict
) -> None:

    if query_feedback.badAnswer is not None:
        bad_answer = -1 if query_feedback.badAnswer else 0
        comment = (
            query_feedback.feedback.user_comment if query_feedback.feedback else None
        )
        payload = {
            "operation": "add_scores",
            "data": compress_payload(
                {
                    "trace_id": query_id,
                    "name": "user-feedback",
                    "score": bad_answer,
                    "comment": comment,
                    "data_type": "NUMERIC",
                    "query_for_database": query_for_database,
                }
            ),
        }
        sqs_queue_monitor.send_message(
            MessageBody=json.dumps(payload),
            MessageGroupId=query_id,
        )

    if (
        query_feedback.feedback
        and query_feedback.feedback.user_response_relevancy is not None
    ):

        payload = {
            "operation": "add_scores",
            "data": compress_payload(
                {
                    "trace_id": query_id,
                    "name": "user-response-relevancy",
                    "score": float(query_feedback.feedback.user_response_relevancy),
                    "comment": None,
                    "data_type": "NUMERIC",
                    "query_for_database": query_for_database,
                }
            ),
        }
        sqs_queue_monitor.send_message(
            MessageBody=json.dumps(payload),
            MessageGroupId=query_id,
        )

    if (
        query_feedback.feedback
        and query_feedback.feedback.user_faithfullness is not None
    ):

        payload = {
            "operation": "add_scores",
            "data": compress_payload(
                {
                    "trace_id": query_id,
                    "name": "user-faithfullness",
                    "score": float(query_feedback.feedback.user_faithfullness),
                    "comment": None,
                    "data_type": "NUMERIC",
                    "query_for_database": query_for_database,
                }
            ),
        }
        sqs_queue_monitor.send_message(
            MessageBody=json.dumps(payload),
            MessageGroupId=query_id,
        )
