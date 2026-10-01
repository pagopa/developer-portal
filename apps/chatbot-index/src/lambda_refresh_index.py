from typing import Tuple, List

from src.modules.settings import SETTINGS
from src.modules.logger import get_logger
from src.modules.documents import (
    StaticMetadata,
    get_folders_list,
    get_one_metadata_from_s3,
    DOCS_PARENT_FOLDER,
)
from src.modules.docs_folders import find_docs_folder
from src.modules.vector_index import LlamaVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = LlamaVectorIndex()
# Written by the gitbook-docs sync when the main version of a guide changes
DIRNAMES_TO_REMOVE_PATH = (
    f"{SETTINGS.language_code}/main-guide-versions-dirNames-to-remove.json"
)

# S3 event example:

""" 
{
  "Records": [
    {
      "eventVersion": "2.1", 
      "eventSource": "aws:s3", 
      "awsRegion": "eu-south-1", 
      "eventTime": "2025-09-30T13:41:26.899Z", 
      "eventName": "ObjectCreated:Put", 
      "userIdentity": {
        "principalId": "AWS:xxx"
      }, 
      "requestParameters": {
        "sourceIPAddress": "x.x.x.x"
      }, 
      "responseElements": {
        "x-amz-request-id": "xxx", 
        "x-amz-id-2": "xxx"
      }, 
      "s3": {
        "s3SchemaVersion": "1.0", 
        "configurationId": "xxx", 
        "bucket": {
          "name": "xxx", 
          "ownerIdentity": {
            "principalId": "xxx"
          }, 
          "arn": "arn:aws:s3:::xxx"
        }, 
        "object": {
          "key": "devportal-docs/new-file-for-lambda-index-test.md", 
          "size": 2, 
          "eTag": "xxx", 
          "sequencer": "xxx"
        }
      }
    }
  ]
}
"""


def read_payload(payload: dict) -> Tuple[List[StaticMetadata], List[str], bool]:
    """Reads the S3 event payload and extracts the necessary information for updating the index.
    Args:
        payload (dict): The S3 event payload.
    Returns:
        Tuple[List[StaticMetadata], List[str], bool]: A tuple containing three elements:
            - A list of StaticMetadata objects to update in the index.
            - A list of S3 object keys to delete from the index.
            - Whether the static folders of the index must be aligned with the S3 folders lists.
    """

    static_docs_to_update = []
    static_docs_ids_to_delete = []
    refresh_static_folders = False

    for record in payload.get("Records", []):
        event_name = record.get("eventName", "")
        s3_info = record.get("s3", {})
        object_info = s3_info.get("object", {})
        object_key = object_info.get("key", "")
        event_action = event_name.split(":")[0]

        if event_action == "ObjectCreated":
            if object_key != DIRNAMES_TO_REMOVE_PATH:
                try:
                    folders_list = get_folders_list()
                    folder_name = find_docs_folder(
                        object_key, folders_list, DOCS_PARENT_FOLDER
                    )
                    if folder_name is None:
                        LOGGER.warning(
                            f"File {object_key} is not in any known docs folder. Skipping."
                        )
                        continue

                    metadata = get_one_metadata_from_s3(
                        folder_name,
                        folders_list=folders_list,
                    )
                    # A main version page has one entry per URL (with and without the version)
                    file_metadata = [
                        m for m in metadata if m.get("contentS3Path") == object_key
                    ]
                    if not file_metadata:
                        LOGGER.warning(
                            f"File {object_key} not in metadata files. Skipping."
                        )
                        continue

                    for m in file_metadata:
                        static_docs_to_update.append(
                            StaticMetadata(
                                url=SETTINGS.website_url + m.get("path"),
                                s3_file_path=m.get("contentS3Path"),
                                title=m.get("title"),
                            )
                        )

                except Exception as e:
                    LOGGER.warning(
                        f"File {object_key} not in metadata files. Skipping because {e}"
                    )
                    continue

            else:
                # The main version of some guides changed: the folders lists in S3 are the
                # source of truth, so the index is aligned with them instead of removing
                # the listed dirNames by substring (e.g. "v1.1" would also match "v1.1.3").
                refresh_static_folders = True

        elif event_action == "ObjectRemoved":
            static_docs_ids_to_delete.append(object_key)
        else:
            LOGGER.info(f"Unhandled event type: {event_name}")

    # Remove eventual duplicates
    static_docs_to_update = list({m.url: m for m in static_docs_to_update}.values())
    static_docs_ids_to_delete = list(set(static_docs_ids_to_delete))

    return static_docs_to_update, static_docs_ids_to_delete, refresh_static_folders


def lambda_handler(event, context):
    LOGGER.info(f"event: {event}")

    static_docs_to_update, static_docs_ids_to_delete, refresh_static_folders = (
        read_payload(event)
    )
    index = VECTOR_INDEX.get_index()
    if index:
        if len(static_docs_to_update) > 0 or len(static_docs_ids_to_delete) > 0:
            VECTOR_INDEX.refresh_index_static_docs(
                index,
                static_docs_to_update=static_docs_to_update,
                static_docs_ids_to_delete=static_docs_ids_to_delete,
            )

        if refresh_static_folders:
            VECTOR_INDEX.refresh_index_static_folders(index)

    return {"statusCode": 200, "result": True, "event": event}
