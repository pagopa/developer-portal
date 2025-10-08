import json
from opentelemetry import trace
from opentelemetry.instrumentation.aws_lambda import AwsLambdaInstrumentor

from src.otel_config import configure_tracer
from src.modules.judge import Judge
from src.modules.logger import get_logger

# Configure OpenTelemetry before anything else
configure_tracer()

LOGGER = get_logger(__name__)

# Instrument AWS Lambda
AwsLambdaInstrumentor().instrument()

tracer = trace.get_tracer(__name__)

# Trace Judge initialization
with tracer.start_as_current_span("judge_initialization"):
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
    with tracer.start_as_current_span("lambda_handler") as span:
        LOGGER.debug(f"event: {event}")
        span.set_attribute("event.records_count", len(event.get("Records", [])))

        results = []
        for idx, record in enumerate(event.get("Records", [])):
            with tracer.start_as_current_span(f"process_record_{idx}") as record_span:
                body = record.get("body", "{}")
                body = json.loads(body)
                
                record_span.set_attribute("trace_id", body.get("trace_id", ""))
                record_span.set_attribute("has_messages", messages := body.get("messages") is not None)
                record_span.set_attribute("contexts_count", len(body.get("retrieved_contexts", [])))
                
                with tracer.start_as_current_span("judge_evaluate"):
                    result = JUDGE.evaluate(
                        trace_id=body.get("trace_id", ""),
                        query_str=body.get("query_str", ""),
                        response_str=body.get("response_str", ""),
                        retrieved_contexts=body.get("retrieved_contexts", []),
                        messages=messages,
                    )
                results.append(result)

        return {"statusCode": 200, "result": results, "event": event}
