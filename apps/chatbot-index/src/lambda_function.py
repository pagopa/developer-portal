import json
from typing import Tuple, List, Dict

from src.modules.logger import get_logger
from src.modules.documents import read_file_from_s3
from src.modules.vector_index import DiscoveryVectorIndex


LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()

# S3 event example:
""" {
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "responseElements": {
        "x-amz-request-id": "EXAMPLE123456789",
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "testConfigRule",
        "bucket": {
          "name": "example-bucket",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::example-bucket"
        },
        "object": {
          "key": "test/key",
          "size": 1024,
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "0A1B2C3D4E5F678901"
        }
      }
    }
  ]
}
"""


def read_payload(payload: dict) -> Tuple[List[Dict[str, str]], List[str]]:

    guides_metadata = json.loads(read_file_from_s3("guides-metadata.json"))
    release_notes_metadata = json.loads(
        read_file_from_s3("release-notes-metadata.json")
    )
    solutions_metadata = json.loads(read_file_from_s3("solutions-metadata.json"))

    all_metadata = guides_metadata + release_notes_metadata + solutions_metadata
    s3_paths = [item["contentS3Path"] for item in all_metadata]

    static_docs_to_update = []
    static_docs_ids_to_delete = []

    for record in payload.get("Records", []):
        record = record.get("body", "{}")
        record = json.loads(record)
        event_name = record.get("eventName", "")
        s3_info = record.get("s3", {})
        object_info = s3_info.get("object", {})
        object_key = object_info.get("key", "")

        if event_name == "ObjectCreated:Put":

            try:
                idx = s3_paths.index(object_key)
                doc_info = all_metadata[idx]

                static_docs_to_update.append(
                    {
                        "url": doc_info["url"],
                        "s3_file_path": doc_info["contentS3Path"],
                        "title": doc_info["title"],
                    }
                )
            except Exception as e:
                print(f"File {object_key} not in metadata files. Skipping...")
                continue

        elif event_name == "ObjectRemoved:Delete":
            static_docs_ids_to_delete.append(object_key)
        else:
            print(f"Unhandled event type: {event_name}")

    return static_docs_to_update, static_docs_ids_to_delete


def lambda_handler(event, context):
    LOGGER.debug(f"event: {event}")

    static_docs_to_update, static_docs_ids_to_delete = read_payload(event)
    if len(static_docs_to_update) > 0 or len(static_docs_ids_to_delete) > 0:
        VECTOR_INDEX.refresh_index_static_docs(
            static_docs_to_update=static_docs_to_update,
            static_docs_ids_to_delete=static_docs_ids_to_delete,
        )

    return {"statusCode": 200, "result": True, "event": event}
