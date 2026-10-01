from src.modules.logger import get_logger
from src.modules.documents import (
    get_one_metadata_from_s3,
    get_folders_list,
    StaticMetadata,
    DOCS_PARENT_FOLDER,
)
from src.modules.docs_folders import split_ref_docs_by_folder
from src.modules.vector_index import LlamaVectorIndex
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()


if __name__ == "__main__":
    """Refresh static documents in the vector index based on S3 folder metadata.
    This script checks for folders in S3 and adds new static documents to the vector index
    and removes the vector index documents relative to the folders that are no longer present in the S3 lists.

    The update of the documents with same ID is handled by src/lambda_refresh_index.py triggered by S3 events.
    """

    folders = get_folders_list()
    index = VECTOR_INDEX.get_index()
    ref_doc_info = index.storage_context.docstore.get_all_ref_doc_info()
    ref_doc_ids = list(ref_doc_info.keys())
    # dirNames can contain slashes, so they are matched against the known folders
    ref_folders, orphan_doc_ids = split_ref_docs_by_folder(
        ref_doc_ids, folders, DOCS_PARENT_FOLDER
    )

    static_docs_to_add = []

    for folder in folders:
        if folder in ref_folders:
            LOGGER.info(
                f"Folder '{folder}' is referenced in the vector index. Skipping."
            )
        else:
            LOGGER.info(
                f"Folder '{folder}' is not referenced in the vector index. Getting relative metadata to add to the vector index."
            )
            metadata = get_one_metadata_from_s3(folder, folders)
            for m in metadata:
                static_docs_to_add.append(
                    StaticMetadata(
                        url=SETTINGS.website_url + m.get("path"),
                        s3_file_path=m.get("contentS3Path"),
                        title=m.get("title"),
                    )
                )

    for doc_id in orphan_doc_ids:
        LOGGER.info(
            f"Document '{doc_id}' is in the vector index but not in any S3 folder of the folders list. Adding to removal list."
        )

    if index:
        if static_docs_to_add or orphan_doc_ids:
            VECTOR_INDEX.refresh_index_static_docs(
                index, static_docs_to_add, orphan_doc_ids
            )
        LOGGER.info("Static docs refresh process completed.")
