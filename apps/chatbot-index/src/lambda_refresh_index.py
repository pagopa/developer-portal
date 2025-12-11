import json
from typing import Tuple, List, Dict

from src.modules.settings import SETTINGS
from src.modules.logger import get_logger
from src.modules.documents import (
    read_file_from_s3,
    get_sitemap_urls,
    filter_urls,
)
from src.modules.vector_index import DiscoveryVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()
MAIN_FILE_PATH = "pippobaudo.json"
DIRNAMES_TO_REMOVE_PATH = "main-guide-versions-dirNames-to-remove.json"
ROOT_FOLDERS_IN_BUCKET = "devportal-docs/docs/"

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


def read_payload(payload: dict) -> Tuple[List[Dict[str, str]], List[str]]:

  sitemap = get_sitemap_urls()
  urls_list = [item["url"] for item in sitemap]
  filtered_urls = filter_urls(urls_list)
  filtered_paths = [url.replace(SETTINGS.website_url, "") for url in filtered_urls]

  try:
    guides_metadata = json.loads(read_file_from_s3("guides-metadata.json"))
  except json.JSONDecodeError as e:
    LOGGER.warning(f"Failed to decode guides-metadata.json: {e}")
    guides_metadata = []
  try:
    release_notes_metadata = json.loads(read_file_from_s3("release-notes-metadata.json"))
  except json.JSONDecodeError as e:
    LOGGER.warning(f"Failed to decode release-notes-metadata.json: {e}")
    release_notes_metadata = []
  try:
    solutions_metadata = json.loads(read_file_from_s3("solutions-metadata.json"))
  except json.JSONDecodeError as e:
    LOGGER.warning(f"Failed to decode solutions-metadata.json: {e}")
    solutions_metadata = []

  all_metadata = guides_metadata + release_notes_metadata + solutions_metadata
  filtered_metadata = []
  s3_paths = []
  for metadata in all_metadata:
    if metadata.get("path") in filtered_paths:
      filtered_metadata.append(metadata)
      s3_paths.append(metadata.get("contentS3Path"))

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
      if object_key == MAIN_FILE_PATH:
        try:
          list_of_folders = json.loads(read_file_from_s3(object_key))
        except json.JSONDecodeError as e:
          LOGGER.warning(f"Failed to decode {object_key}: {e}")
          list_of_folders = []
        for folder in list_of_folders:
          VECTOR_INDEX.remove_docs_in_folder(folder_path=folder)

      try:
        idx = s3_paths.index(object_key)
        doc_info = filtered_metadata[idx]

        static_docs_to_update.append(
          {
            "url": SETTINGS.website_url + doc_info.get("path"),
            "s3_file_path": doc_info.get("contentS3Path"),
            "title": doc_info.get("title"),
          }
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
            dirnames = json.loads(read_file_from_s3(object_key)).get("dirNames", [])
        except json.JSONDecodeError as e:
            LOGGER.warning(f"Failed to decode {object_key}: {e}")
            dirnames = []

        dirnames_to_remove.extend(dirnames)

    elif event_action == "ObjectRemoved":
        static_docs_ids_to_delete.append(object_key)
    else:
        LOGGER.info(f"Unhandled event type: {event_name}")

  # flatten array
  dirnames_to_remove = [item for sublist in dirnames_to_remove for item in sublist]
  return static_docs_to_update, static_docs_ids_to_delete, dirnames_to_remove


def lambda_handler(event, context):
    LOGGER.info(f"event: {event}")

    static_docs_to_update, static_docs_ids_to_delete, dirnames_to_remove = read_payload(event)
    if len(static_docs_to_update) > 0 or len(static_docs_ids_to_delete) > 0:
        VECTOR_INDEX.refresh_index(
            static_docs_to_update=static_docs_to_update,
            static_docs_ids_to_delete=static_docs_ids_to_delete,
        )

    if len(dirnames_to_remove) > 0:
        for dirname in dirnames_to_remove:
            VECTOR_INDEX.remove_docs_in_folder(folder_path=dirname)

    return {"statusCode": 200, "result": True, "event": event}
