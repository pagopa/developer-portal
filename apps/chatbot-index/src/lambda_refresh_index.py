import json
from typing import Tuple, List, Dict

from src.modules.settings import SETTINGS
from src.modules.logger import get_logger
from src.modules.documents import (
    StaticMetadata,
    get_folders_list,
    read_file_from_s3,
    get_one_metadata_from_s3,
)
from src.modules.vector_index import DiscoveryVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()
DIRNAMES_TO_REMOVE_PATH = "main-guide-versions-dirNames-to-remove.json"

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


def read_payload(payload: dict) -> Tuple[List[StaticMetadata], List[str], List[str]]:
    """Reads the S3 event payload and extracts the necessary information for updating the index.
    Args:
        payload (dict): The S3 event payload.
    Returns:
        Tuple[List[StaticMetadata], List[str], List[str]]: A tuple containing three elements:
            - A list of StaticMetadata objects to update in the index.
            - A list of S3 object keys to delete from the index.
            - A list of directory names to remove from the index.
    """

    static_docs_to_update = []
    static_docs_ids_to_delete = []
    dirnames_to_remove = []

    for record in payload.get("Records", []):
        event_name = record.get("eventName", "")
        s3_info = record.get("s3", {})
        object_info = s3_info.get("object", {})
        object_key = object_info.get("key", "")
        event_action = event_name.split(":")[0]

        if event_action == "ObjectCreated":
            try:
                folders_list = get_folders_list()
                metadata = get_one_metadata_from_s3(
                    object_key.split("/")[
                        2
                    ],  # "devportal-docs/docs/<folder_name>/.../file.md"
                    folders_list=folders_list,
                )

                # all_metadata = get_metadata_from_s3()
                # s3_paths = [metadata.get("contentS3Path") for metadata in all_metadata]
                # idx = s3_paths.index(object_key)
                # doc_info = all_metadata[idx]

                static_docs_to_update.append(
                    StaticMetadata(
                        url=SETTINGS.website_url + metadata.get("path"),
                        s3_file_path=metadata.get("contentS3Path"),
                        title=metadata.get("title"),
                    )
                )

            except Exception as e:
                LOGGER.warning(
                    f"File {object_key} not in metadata files. Skipping because {e}"
                )
                continue

            if object_key == DIRNAMES_TO_REMOVE_PATH:
                # DIRNAMES_TO_REMOVE_PATH content example:
                # {
                #   "dirNames": [
                #     "6MUyXVMtPXJBZM12qMoI"
                #   ]
                # }
                try:
                    s3_content = read_file_from_s3(object_key)
                    dirnames = (
                        json.loads(s3_content).get("dirNames", []) if s3_content else []
                    )

                except Exception as e:
                    LOGGER.warning(f"Failed to decode {object_key}: {e}")
                    dirnames = []

                dirnames_to_remove.extend(dirnames)

        elif event_action == "ObjectRemoved":
            static_docs_ids_to_delete.append(object_key)
        else:
            LOGGER.info(f"Unhandled event type: {event_name}")

    # Remove eventual duplicates
    static_docs_to_update = [
        dict(t) for t in set(tuple(d.items()) for d in static_docs_to_update)
    ]
    static_docs_ids_to_delete = list(set(static_docs_ids_to_delete))
    dirnames_to_remove = list(set(dirnames_to_remove))

    return static_docs_to_update, static_docs_ids_to_delete, dirnames_to_remove


def lambda_handler(event, context):
    LOGGER.info(f"event: {event}")

    static_docs_to_update, static_docs_ids_to_delete, dirnames_to_remove = read_payload(
        event
    )
    index = VECTOR_INDEX.get_index()
    if index:
        if len(static_docs_to_update) > 0 or len(static_docs_ids_to_delete) > 0:
            VECTOR_INDEX.refresh_index_static_docs(
                index,
                static_docs_to_update=static_docs_to_update,
                static_docs_ids_to_delete=static_docs_ids_to_delete,
            )

        if len(dirnames_to_remove) > 0:
            for dirname in dirnames_to_remove:
                VECTOR_INDEX.remove_docs_in_folder(index, folder_name=dirname)

    return {"statusCode": 200, "result": True, "event": event}
