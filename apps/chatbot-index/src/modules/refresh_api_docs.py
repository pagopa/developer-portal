from src.modules.logger import get_logger
from src.modules.vector_index import LlamaVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()


if __name__ == "__main__":

    index = VECTOR_INDEX.get_index()
    if index:
        VECTOR_INDEX.refresh_index_api_docs(index)
        LOGGER.info("API docs refresh process completed.")
