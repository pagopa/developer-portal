import os
import boto3
import json
import time
from lambda_function import lambda_handler

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL", "http://motoserver:3000")
QUEUE_NAME = os.getenv("SQS_QUEUE_NAME", "chatbot-monitor-queue")

sqs = boto3.resource(
    "sqs",
    region_name=AWS_REGION,
    endpoint_url=AWS_ENDPOINT_URL
)

queue = sqs.get_queue_by_name(QueueName=QUEUE_NAME)

print(f"Polling SQS queue '{QUEUE_NAME}' at {AWS_ENDPOINT_URL}...")

while True:
    messages = queue.receive_messages(MaxNumberOfMessages=1, WaitTimeSeconds=2)
    for message in messages:
        print("Received SQS message:", message.body)
        # Simulate Lambda invocation with SQS message
        event = json.loads(message.body)
        result = lambda_handler(event, None)
        print("Lambda result:", result)
        message.delete()
    time.sleep(1)
