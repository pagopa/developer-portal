import os
import boto3
import json
import time
import requests


AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL", "http://motoserver:3222")
QUEUE_NAME = os.getenv("CHB_AWS_SQS_QUEUE_EVALUATE_NAME", "chatbot-evaluate")
LAMBDA_HTTP_URL = os.getenv("LAMBDA_HTTP_URL", "http://monitor:8080/2015-03-31/functions/function/invocations")

AWS_SESSION = boto3.Session()
sqs = AWS_SESSION.resource("sqs")

print(f"Polling SQS queue '{QUEUE_NAME}' at {AWS_ENDPOINT_URL}...")
print(f"Lambda HTTP endpoint: {LAMBDA_HTTP_URL}")

queue = sqs.get_queue_by_name(QueueName=QUEUE_NAME)

while True:
    messages = queue.receive_messages(MaxNumberOfMessages=1, WaitTimeSeconds=2)
    for message in messages:
        print("Received SQS message:", message.body)
        event = json.loads(message.body)
        # Call the Lambda via HTTP
        try:
            response = requests.post(LAMBDA_HTTP_URL, json=event)
            print("Lambda HTTP status:", response.status_code)
            print("Lambda response:", response.text)
        except Exception as e:
            print("Error calling Lambda via HTTP:", e)
        message.delete()
    time.sleep(1)
