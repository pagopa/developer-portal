from src.modules.logger import get_logger
from src.modules.vector_index import LlamaVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()


if __name__ == "__main__":
    """Refresh static documents in the vector index based on S3 folder metadata.
    This script checks for folders in S3 and adds new static documents to the vector index
    and removes the vector index documents relative to the folders that are no longer present in the S3 lists.

    The update of the documents with same ID is handled by src/lambda_refresh_index.py triggered by S3 events.
    """

    index = VECTOR_INDEX.get_index()
    if index:
        VECTOR_INDEX.refresh_index_static_folders(index)
        LOGGER.info("Static docs refresh process completed.")
