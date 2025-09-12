import boto3
import os

from botocore.exceptions import ClientError

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__)

sqs_queue_evaluate = None

try:
    sqs = boto3.resource(
        "sqs",
        region_name=SETTINGS.aws_default_region,
    )
    queues = sqs.queues.all()
    LOGGER.info(
        f"sqs.get_queue_by_name({os.getenv('CHB_AWS_SQS_QUEUE_EVALUATE_NAME', 'chatbot-evaluate')})"
    )
    sqs_queue_evaluate = sqs.get_queue_by_name(
        QueueName=os.getenv("CHB_AWS_SQS_QUEUE_EVALUATE_NAME", "chatbot-evaluate")
    )
except ClientError as e:
    LOGGER.error(f"Failed to get SQS queue: {e}")
