from src.modules.logger import get_logger
from src.modules.vector_index import DiscoveryVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()


def lambda_handler(event, context):
    LOGGER.debug(f"event: {event}")

    VECTOR_INDEX.create_index()

    return {"statusCode": 200, "result": True, "event": event}
