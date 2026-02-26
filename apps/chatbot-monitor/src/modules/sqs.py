from botocore.exceptions import ClientError

from src.modules.logger import get_logger
from src.modules.settings import AWS_SESSION, SETTINGS

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def get_sqs_evaluate_queue():
    """Get the SQS queue for evaluation."""
    
    sqs_queue_evaluate = None
    
    try:
        sqs = AWS_SESSION.resource("sqs")
        LOGGER.info(f"sqs.get_queue_by_name({SETTINGS.aws_sqs_queue_evaluate_name})")
        sqs_queue_evaluate = sqs.get_queue_by_name(
            QueueName=SETTINGS.aws_sqs_queue_evaluate_name
        )
    except ClientError as e:
        LOGGER.error(
            f"Failed to get SQS queue {SETTINGS.aws_sqs_queue_evaluate_name}: {e}"
        )
    
    return sqs_queue_evaluate
