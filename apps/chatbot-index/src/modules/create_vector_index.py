from src.modules.logger import get_logger
from src.modules.vector_index import DiscoveryVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()


if __name__ == "__main__":

    VECTOR_INDEX.create_index()
