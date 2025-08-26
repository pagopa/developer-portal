import json
from typing import Tuple, List, Dict

from src.modules.logger import get_logger
from src.modules.documents import read_file_from_s3
from src.modules.vector_index import DiscoveryVectorIndex

LOGGER = get_logger(__name__)
VECTOR_INDEX = DiscoveryVectorIndex()


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

    for record in payload["Records"]:
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

    results = []
    for record in event.get("Records", []):
        body = record.get("body", "{}")
        body = json.loads(body)

    return {"statusCode": 200, "result": results, "event": event}
