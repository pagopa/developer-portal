import argparse

from src.modules.logger import get_logger
from src.modules.vector_index import DiscoveryVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Create a vector index.")
    parser.add_argument(
        "--index_id", type=str, help="The identifier for the vector index."
    )
    parser.add_argument(
        "--clean_redis",
        action="store_true",
        help="Flag indicating whether to clean the Redis database before building the index.",
    )
    args = parser.parse_args()

    VECTOR_INDEX.create_index(args.index_id, args.clean_redis)
