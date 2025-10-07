import json
from typing import Tuple, List, Dict

from src.modules.settings import SETTINGS
from src.modules.logger import get_logger
from src.modules.documents import read_file_from_s3, get_sitemap_urls, filter_urls
from src.modules.vector_index import DiscoveryVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()

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

    sitemap = get_sitemap_urls(SETTINGS.website_url)
    urls_list = [item["url"] for item in sitemap]
    filtered_urls = filter_urls(urls_list, SETTINGS.website_url)
    filtered_paths = [url.replace(SETTINGS.website_url, "") for url in filtered_urls]

    guides_metadata = json.loads(read_file_from_s3("guides-metadata.json"))
    release_notes_metadata = json.loads(
        read_file_from_s3("release-notes-metadata.json")
    )
    solutions_metadata = json.loads(read_file_from_s3("solutions-metadata.json"))

    all_metadata = guides_metadata + release_notes_metadata + solutions_metadata
    filtered_metadata = []
    s3_paths = []
    for metadata in all_metadata:
        if metadata.get("path") in filtered_paths:
            filtered_metadata.append(metadata)
            s3_paths.append(metadata.get("contentS3Path"))

    static_docs_to_update = []
    static_docs_ids_to_delete = []

    for record in payload.get("Records", []):
        event_name = record.get("eventName", "")
        s3_info = record.get("s3", {})
        object_info = s3_info.get("object", {})
        object_key = object_info.get("key", "")

        if event_name == "ObjectCreated:Put":

            try:
                LOGGER.info(f"object_key: {object_key}")
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
                LOGGER.info(f"File {object_key} not in metadata files. Skipping...")
                continue

        elif event_name == "ObjectRemoved:Delete":
            static_docs_ids_to_delete.append(object_key)
        else:
            LOGGER.info(f"Unhandled event type: {event_name}")

    return static_docs_to_update, static_docs_ids_to_delete


def lambda_handler(event, context):
    LOGGER.info(f"event: {event}")

    static_docs_to_update, static_docs_ids_to_delete = read_payload(event)
    if len(static_docs_to_update) > 0 or len(static_docs_ids_to_delete) > 0:
        VECTOR_INDEX.refresh_index(
            static_docs_to_update=static_docs_to_update,
            static_docs_ids_to_delete=static_docs_ids_to_delete,
        )

    return {"statusCode": 200, "result": True, "event": event}
