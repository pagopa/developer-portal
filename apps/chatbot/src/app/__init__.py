import logging

from botocore.exceptions import ClientError

from src.modules.settings import AWS_SESSION, SETTINGS
from src.modules.chatbot import Chatbot

LOGGER = logging.getLogger(__name__)

# Chatbot singleton (moved from chatbot_init.py)
LOGGER.info("Initializing chatbot...")
chatbot = Chatbot()

# SQS queue (moved from sqs_init.py)
sqs_queue_monitor = None

try:
    sqs = AWS_SESSION.resource("sqs")
    LOGGER.info(f"sqs.get_queue_by_name({SETTINGS.aws_sqs_queue_monitor_name})")
    sqs_queue_monitor = sqs.get_queue_by_name(
        QueueName=SETTINGS.aws_sqs_queue_monitor_name
    )
except ClientError as e:
    LOGGER.error(f"Failed to get SQS queue {SETTINGS.aws_sqs_queue_monitor_name}: {e}")
