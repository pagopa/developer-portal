import os
import argparse

from src.modules.logger import get_logger
from src.modules.documents import EXTRACTOR_FOLDER
from src.modules.url_handling import sanitize_url_as_directory_name
from src.modules.vector_index import LlamaVectorIndex
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()
PATH = os.path.join(SETTINGS.bucket_static_content, SETTINGS.index_id, EXTRACTOR_FOLDER)


if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Refresh structured documents in a vector index for the chatbot."
    )
    parser.add_argument(
        "--update-url-list",
        nargs="+",
        help="List of URLs to add (separated by spaces)",
    )
    parser.add_argument(
        "--remove-url-list",
        nargs="+",
        help="List of URLs to remove (separated by spaces)",
    )
    args = parser.parse_args()

    index = VECTOR_INDEX.get_index()
    if args.update_url_list:
        for url in args.update_url_list:

            url_s3_folder = sanitize_url_as_directory_name(url)
            LOGGER.info(
                f"Refreshing vector index with structured docs in {PATH, url_s3_folder} ..."
            )
            VECTOR_INDEX.refresh_index_structured_docs(index, url_s3_folder)

    if args.remove_url_list:
        for url in args.remove_url_list:
            LOGGER.info(f"Processing URL for removal: {url}")

            url_s3_folder = sanitize_url_as_directory_name(url)
            VECTOR_INDEX.remove_docs_in_folder(index, url_s3_folder)

            LOGGER.info(
                f"Removed structured docs from: {os.path.join(PATH, url_s3_folder)}"
            )
