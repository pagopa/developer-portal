import json

from src.modules.judge import Judge
from src.modules.logger import get_logger
from src.modules.codec import compress_payload
from src.modules.sqs import get_sqs_monitor_queue


LOGGER = get_logger(__name__)
JUDGE = Judge()
SQS_MONITOR = get_sqs_monitor_queue()

# SQS event example:
""" {
    "Records": [
        {
            "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
            "receiptHandle": "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
            "body": "Test message.",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1545082649183",
                "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                "ApproximateFirstReceiveTimestamp": "1545082649185"
            },
            "messageAttributes": {
                "myAttribute": {
                    "stringValue": "myValue", 
                    "stringListValues": [], 
                    "binaryListValues": [], 
                    "dataType": "String"
                }
            },
            "md5OfBody": "e4e68fb7bd0e697a0ae8f1bb342846b3",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
            "awsRegion": "us-east-2"
        },
        {
            "messageId": "2e1424d4-f796-459a-8184-9c92662be6da",
            "receiptHandle": "AQEBzWwaftRI0KuVm4tP+/7q1rGgNqicHq...",
            "body": "Test message.",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1545082650636",
                "SenderId": "AIDAIENQZJOLO23YVJ4VO",
                "ApproximateFirstReceiveTimestamp": "1545082650649"
            },
            "messageAttributes": {},
            "md5OfBody": "e4e68fb7bd0e697a0ae8f1bb342846b3",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
            "awsRegion": "us-east-2"
        }
    ]
} """


def lambda_handler(event, context):
    LOGGER.debug(f"event: {event}")

    results = []

    # extract unique records
    records = event.get("Records", [])
    unique_records = []
    for record in records:
        if record not in unique_records:
            unique_records.append(record)
    for record in unique_records:
        body = record.get("body", "{}")
        body = json.loads(body)
        trace_id = body.get("trace_id", "")

        scores = JUDGE.evaluate(
            query_str=body.get("query_str", ""),
            response_str=body.get("response_str", ""),
            retrieved_contexts=body.get("retrieved_contexts", []),
            messages=body.get("messages", None),
        )

        for k, v in scores.items():
            results.append(
                {
                    "trace_id": trace_id,
                    "name": k,
                    "score": v,
                    "comment": None,
                    "data_type": "NUMERIC",
                }
            )

    payload_to_monitor = json.dumps(
        {
            "operation": "add_scores",
            "data": compress_payload(results),
        }
    )
    try:
        SQS_MONITOR.send_message(
            MessageBody=payload_to_monitor,
            MessageGroupId=trace_id,  # Required for FIFO queues
        )
    except Exception as e:
        LOGGER.error(
            f"Failed to send SQS message {payload_to_monitor} to chatbot-monitor: {e}"
        )
