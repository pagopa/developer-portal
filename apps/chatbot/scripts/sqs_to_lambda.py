import os
import boto3
import json
import time
import requests
import threading
import argparse


AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL", "http://motoserver:3222")

# Queue configurations
QUEUES_CONFIG = {
    "monitor": {
        "name": os.getenv("CHB_AWS_SQS_QUEUE_MONITOR_NAME", "chatbot-monitor"),
        "lambda_url": os.getenv(
            "LAMBDA_MONITOR_URL",
            "http://monitor:8080/2015-03-31/functions/function/invocations",
        ),
        "label": "Monitor",
    },
    "evaluate": {
        "name": os.getenv("CHB_AWS_SQS_QUEUE_EVALUATE_NAME", "chatbot-evaluate"),
        "lambda_url": os.getenv(
            "LAMBDA_EVALUATE_URL",
            "http://evaluate:8080/2015-03-31/functions/function/invocations",
        ),
        "label": "Evaluate",
    },
}

AWS_SESSION = boto3.Session()
sqs = AWS_SESSION.resource("sqs")


def poll_queue(queue_name, lambda_url, label):
    """Poll a single SQS queue and invoke the corresponding lambda."""
    print(f"[{label}] Starting to poll queue '{queue_name}' at {AWS_ENDPOINT_URL}")
    print(f"[{label}] Lambda HTTP endpoint: {lambda_url}")

    try:
        queue = sqs.get_queue_by_name(QueueName=queue_name)
    except Exception as e:
        print(f"[{label}] ERROR: Could not get queue '{queue_name}': {e}")
        return

    while True:
        try:
            messages = queue.receive_messages(MaxNumberOfMessages=1, WaitTimeSeconds=2)
            for message in messages:
                print(f"[{label}] Received SQS message: {message.body[:200]}...")

                # Parse the message body
                body = json.loads(message.body)

                # Wrap in Lambda event format
                event = {
                    "Records": [
                        {
                            "messageId": message.message_id,
                            "receiptHandle": message.receipt_handle,
                            "body": message.body,
                            "attributes": (
                                message.attributes
                                if hasattr(message, "attributes")
                                else {}
                            ),
                            "messageAttributes": {},
                            "md5OfBody": message.md5_of_body,
                            "eventSource": "aws:sqs",
                            "eventSourceARN": f"arn:aws:sqs:{AWS_REGION}:000000000000:{queue_name}",
                            "awsRegion": AWS_REGION,
                        }
                    ]
                }

                # Call the Lambda via HTTP
                try:
                    response = requests.post(lambda_url, json=event, timeout=300)
                    print(f"[{label}] Lambda HTTP status: {response.status_code}")
                    if response.status_code != 200:
                        print(f"[{label}] Lambda error response: {response.text}")
                    else:
                        print(f"[{label}] Lambda success: {response.text[:200]}...")
                except requests.exceptions.Timeout:
                    print(f"[{label}] ERROR: Lambda request timed out after 300s")
                except Exception as e:
                    print(f"[{label}] ERROR calling Lambda via HTTP: {e}")

                # Delete message from queue
                message.delete()
                print(f"[{label}] Message deleted from queue")

        except Exception as e:
            print(f"[{label}] ERROR in polling loop: {e}")

        time.sleep(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SQS to Lambda Bridge")
    parser.add_argument(
        "--queue",
        choices=["monitor", "evaluate", "all"],
        default="all",
        help="Which queue(s) to listen to: monitor, evaluate, or all (default: all)",
    )
    args = parser.parse_args()

    print("=" * 80)
    print("SQS to Lambda Bridge")
    print("=" * 80)

    if args.queue == "all":
        # Multi-queue mode: use threading
        print("Mode: Multi-queue (threading)")
        threads = []
        for queue_type, config in QUEUES_CONFIG.items():
            thread = threading.Thread(
                target=poll_queue,
                args=(config["name"], config["lambda_url"], config["label"]),
                daemon=True,
            )
            threads.append(thread)
            thread.start()

        # Keep main thread alive
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nShutting down...")
    else:
        # Single-queue mode
        config = QUEUES_CONFIG[args.queue]
        print(f"Mode: Single-queue ({args.queue})")
        try:
            poll_queue(config["name"], config["lambda_url"], config["label"])
        except KeyboardInterrupt:
            print("\nShutting down...")
