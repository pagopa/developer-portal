from typing import Tuple
from urllib.parse import urlparse

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION

from botocore.exceptions import ClientError

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def _get_s3_client():
    return AWS_SESSION.client("s3")


def remove_s3_folder(output_folder: str) -> None:
    """
    Delete all objects within a specified S3 prefix (folder).

    Deletes objects page by page to respect the 1000-key limit of
    ``delete_objects``.

    Args:
        output_folder: S3 path in format s3://bucket/key/prefix

    Raises:
        ValueError: If there is an error deleting objects from S3.
    """
    s3_client = _get_s3_client()
    LOGGER.info("Attempting to delete S3 folder: %s", output_folder)
    try:
        bucket, key_prefix = parse_s3_path(output_folder)
    except ValueError as e:
        raise ValueError(f"Invalid S3 output folder: {e}")

    if not key_prefix.endswith("/"):
        key_prefix += "/"

    try:
        paginator = s3_client.get_paginator("list_objects_v2")
        pages = paginator.paginate(Bucket=bucket, Prefix=key_prefix)

        total_deleted = 0
        found_any = False
        for page in pages:
            if "Contents" not in page:
                continue
            found_any = True
            objects_to_delete = [{"Key": obj["Key"]} for obj in page["Contents"]]
            delete_response = s3_client.delete_objects(
                Bucket=bucket, Delete={"Objects": objects_to_delete}
            )
            if "Errors" in delete_response:
                for error in delete_response["Errors"]:
                    LOGGER.error(
                        "Error deleting object %s from S3: %s",
                        error["Key"],
                        error["Message"],
                    )
                raise IOError(f"Failed to delete some objects from {output_folder}")
            total_deleted += len(objects_to_delete)

        if not found_any:
            LOGGER.info(
                "S3 folder is already empty or does not exist: %s", output_folder
            )
            return

        LOGGER.info(
            "Successfully deleted %d objects from S3 folder: %s",
            total_deleted,
            output_folder,
        )

    except ClientError as e:
        raise IOError(
            "Error deleting objects from S3 folder %s: %s", output_folder, e
        ) from e


def parse_s3_path(s3_path: str) -> Tuple[str, str]:
    """Parse S3 path into bucket and key prefix.

    Args:
        s3_path: S3 path in format s3://bucket/key/prefix

    Returns:
        Tuple of (bucket_name, key_prefix)
    """
    parsed = urlparse(s3_path)
    if parsed.scheme != "s3":
        raise ValueError(
            "Invalid S3 path: %s. Expected format: s3://bucket/key/prefix", s3_path
        )
    bucket = parsed.netloc
    key_prefix = parsed.path.lstrip("/")
    return bucket, key_prefix
