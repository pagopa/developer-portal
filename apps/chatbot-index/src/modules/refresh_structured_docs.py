import os
import argparse
from typing import List

from llama_index.core import VectorStoreIndex

from src.modules.logger import get_logger
from src.modules.documents import EXTRACTOR_FOLDER
from src.modules.url_handling import sanitize_url_as_directory_name
from src.modules.vector_index import DocumentsRefreshError, LlamaVectorIndex
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()
PATH = os.path.join(SETTINGS.bucket_static_content, SETTINGS.index_id, EXTRACTOR_FOLDER)


def refresh_structured_urls(
    index: VectorStoreIndex,
    update_urls: List[str] | None = None,
    remove_urls: List[str] | None = None,
) -> None:
    """Refreshes and removes the structured docs of each URL in the vector index.

    A failing URL does not stop the others: every URL is processed, then an error listing
    the failed URLs is raised.

    Args:
        index (VectorStoreIndex): The vector store index instance.
        update_urls (List[str] | None): The URLs whose structured docs must be refreshed.
        remove_urls (List[str] | None): The URLs whose structured docs must be removed.
    Raises:
        DocumentsRefreshError: If at least one URL could not be processed.
    """

    failed_urls = []

    for url in update_urls or []:
        url_s3_folder = sanitize_url_as_directory_name(url)
        LOGGER.info(
            f"Refreshing vector index with structured docs in {os.path.join(PATH, url_s3_folder)} ..."
        )
        try:
            VECTOR_INDEX.refresh_index_structured_docs(index, url_s3_folder)
        except Exception:
            LOGGER.exception(f"Error refreshing structured docs of URL: {url}")
            failed_urls.append(url)

    for url in remove_urls or []:
        LOGGER.info(f"Processing URL for removal: {url}")

        url_s3_folder = sanitize_url_as_directory_name(url)
        try:
            VECTOR_INDEX.remove_docs_in_folder(index, url_s3_folder)
        except Exception:
            LOGGER.exception(f"Error removing structured docs of URL: {url}")
            failed_urls.append(url)
            continue

        LOGGER.info(
            f"Removed structured docs from: {os.path.join(PATH, url_s3_folder)}"
        )

    if failed_urls:
        raise DocumentsRefreshError(
            f"Failed to process {len(failed_urls)} URLs: {failed_urls}"
        )


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
    refresh_structured_urls(index, args.update_url_list, args.remove_url_list)
