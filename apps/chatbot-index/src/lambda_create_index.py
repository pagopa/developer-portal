from src.modules.logger import get_logger
from src.modules.vector_index import DiscoveryVectorIndex
# open telemetry
from opentelemetry import trace
from opentelemetry.instrumentation.aws_lambda import AwsLambdaInstrumentor

AwsLambdaInstrumentor().instrument()


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()


def lambda_handler(event, context):
    tracer = trace.get_tracer(__name__)
    LOGGER.debug(f"event: {event}")

    with tracer.start_as_current_span("my_lambda_span"):
        VECTOR_INDEX.create_index()

        return {"statusCode": 200, "result": True, "event": event}
