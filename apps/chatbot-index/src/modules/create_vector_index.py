import argparse

from src.modules.logger import get_logger
from src.modules.vector_index import LlamaVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()


if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Create a vector index for the chatbot."
    )
    parser.add_argument(
        "--static",
        action="store_true",
        help="Include static documents in the index",
    )
    parser.add_argument(
        "--dynamic",
        action="store_true",
        help="Include dynamic documents in the index",
    )
    parser.add_argument(
        "--api",
        action="store_true",
        help="Include API documents in the index",
    )
    parser.add_argument(
        "--structured",
        action="store_true",
        help="Include structured documents in the index",
    )
    parser.add_argument(
        "--clean-redis",
        action="store_true",
        help="Clean the Redis database before building the index",
    )
    args = parser.parse_args()

    # Validate source selection:
    # - Structured documents cannot be combined with static, dynamic, or API documents.
    # - At least one document source must be selected.
    has_unstructured_source = args.static or args.dynamic or args.api
    if args.structured and has_unstructured_source:
        parser.error(
            "Structured documents cannot be combined with static, dynamic, or API documents."
        )
    if not args.structured and not has_unstructured_source:
        parser.error(
            "No document sources selected. Use one or more of --static, --dynamic, --api, or --structured."
        )

    VECTOR_INDEX.create_index(
        static=args.static,
        dynamic=args.dynamic,
        api=args.api,
        structured=args.structured,
        clean_redis=args.clean_redis,
    )
