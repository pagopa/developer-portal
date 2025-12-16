import boto3
import sys
import argparse

# --- Argument Parsing ---
parser = argparse.ArgumentParser(description="Move a single message from an SQS DLQ to a main queue (FIFO supported).")
parser.add_argument("--dlq-url", required=True, help="The URL of the Dead Letter Queue")
parser.add_argument("--main-queue-url", required=True, help="The URL of the destination Main Queue")
parser.add_argument("--region", default="eu-south-1", help="AWS Region (default: eu-south-1)")
parser.add_argument("--message-group-id", help="Optional: Manually specify MessageGroupId (required for FIFO if original message lacks it)")

args = parser.parse_args()

DLQ_URL = args.dlq_url
MAIN_QUEUE_URL = args.main_queue_url
REGION = args.region
MANUAL_GROUP_ID = args.message_group_id
# --- End Argument Parsing ---

# Initialize the SQS client
try:
    sqs = boto3.client('sqs', region_name=REGION)
except Exception as e:
    print(f"Error initializing SQS client: {e}")
    sys.exit(1)

def move_one_message():
    print(f"Attempting to receive one message from DLQ: {DLQ_URL}")

    # 1. Receive one message
    # We must request 'AttributeNames' to get system attributes like MessageGroupId
    try:
        response = sqs.receive_message(
            QueueUrl=DLQ_URL,
            MaxNumberOfMessages=1,
            MessageAttributeNames=['All'], # User attributes (custom headers)
            AttributeNames=['All'],        # System attributes (GroupId, DedupId, SentTimestamp)
            VisibilityTimeout=60 
        )
    except Exception as e:
        print(f"Error receiving message from DLQ: {e}")
        sys.exit(1)

    if 'Messages' not in response:
        print("No messages found in the DLQ.")
        return

    message = response['Messages'][0]
    receipt_handle = message['ReceiptHandle']
    message_body = message['Body']
    
    # Extract System Attributes (for FIFO)
    attributes = message.get('Attributes', {})
    original_group_id = attributes.get('MessageGroupId')
    original_dedup_id = attributes.get('MessageDeduplicationId')

    print("---")
    print(f"Message ID: {message['MessageId']}")
    print(f"Body: {message_body}")
    if original_group_id:
        print(f"Original Group ID: {original_group_id}")
    print("---")

    # Prepare message for sending
    send_args = {
        'QueueUrl': MAIN_QUEUE_URL,
        'MessageBody': message_body
    }

    # Handle User Attributes
    if 'MessageAttributes' in message:
        send_args['MessageAttributes'] = message['MessageAttributes']

    # Handle FIFO Parameters
    # Priority: 1. Manual Argument, 2. Original Message Attribute
    final_group_id = MANUAL_GROUP_ID if MANUAL_GROUP_ID else original_group_id

    if final_group_id:
        send_args['MessageGroupId'] = final_group_id
    
    # We also forward the DeduplicationId if it exists to prevent duplicates
    if original_dedup_id:
        send_args['MessageDeduplicationId'] = original_dedup_id

    # 2. Send the message to the main queue
    try:
        print(f"Sending message to main queue: {MAIN_QUEUE_URL}")
        sqs.send_message(**send_args)
        print("Message sent successfully.")
    except Exception as e:
        print(f"Error sending message to main queue: {e}")
        print("The message has NOT been deleted from the DLQ.")
        sys.exit(1)

    # 3. Delete the message from the DLQ
    try:
        print("Deleting message from DLQ...")
        sqs.delete_message(
            QueueUrl=DLQ_URL,
            ReceiptHandle=receipt_handle
        )
        print("Done. Message moved.")
    except Exception as e:
        print(f"Error deleting message from DLQ: {e}")
        print("WARNING: Message was re-sent but NOT deleted from DLQ.")
        sys.exit(1)

if __name__ == "__main__":
    move_one_message()