import json

from src.modules.judge import Judge
from src.modules.logger import get_logger
from src.modules.sqs_init import sqs_queue_evaluate

LOGGER = get_logger(__name__)
JUDGE = Judge()

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
    for record in event.get("Records", []):
        body = record.get("body", "{}")
        body = json.loads(body)
        results.append(
            JUDGE.evaluate(
                trace_id=body.get("trace_id", ""),
                query_str=body.get("query_str", ""),
                response_str=body.get("response_str", ""),
                retrieved_contexts=body.get("retrieved_contexts", []),
                messages=body.get("messages", None),
            )
        )
        sqs_queue_evaluate.delete_message(ReceiptHandle=record.get("receiptHandle", ""))

    return {"statusCode": 200, "result": results, "event": event}
