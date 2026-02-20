from src.modules.logger import get_logger
from src.modules.documents import get_static_metadata
from src.modules.vector_index import LlamaVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()


if __name__ == "__main__":

    index = VECTOR_INDEX.get_index()
    if index:
        static_metadata = get_static_metadata()
        VECTOR_INDEX.refresh_index_dynamic_docs(index, static_metadata)
        LOGGER.info("Dynamic docs refresh process completed.")
