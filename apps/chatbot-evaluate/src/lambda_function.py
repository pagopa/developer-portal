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
        results.append(
            JUDGE.evaluate(
                query_str=event.get("query_str", ""),
                response_str=event.get("response_str", ""),
                retrieved_context=event.get("retrieved_context", []),
                trace_id=event.get("trace_id", ""),
                messages=event.get("messages", None),
            )
        )

    return {"statusCode": 200, "result": results, "event": event}
