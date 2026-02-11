from src.modules.logger import get_logger
from src.modules.documents import (
    get_one_metadata_from_s3,
    get_folders_list,
    StaticMetadata,
    DOCS_PARENT_FOLDER,
)
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
    ref_folders = [
        doc_id.split("/")[2] for doc_id in ref_doc_ids if DOCS_PARENT_FOLDER in doc_id
    ]
    ref_folders = list(set(ref_folders))

    static_docs_to_add = []
    folders_to_remove = []

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

    for ref_folder in ref_folders:
        if ref_folder not in folders:
            LOGGER.info(
                f"Folder '{ref_folder}' is in the vector index but not in S3 folders list. Adding to removal list."
            )
            folders_to_remove.append(ref_folder)

    if index:
        if static_docs_to_add:
            VECTOR_INDEX.refresh_index_static_docs(index, static_docs_to_add, [])
        if folders_to_remove:
            for folder_to_remove in folders_to_remove:
                VECTOR_INDEX.remove_docs_in_folder(index, folder_to_remove)
        LOGGER.info("Static docs refresh process completed.")
