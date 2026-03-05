import boto3

from pathlib import Path
from typing import Tuple
from urllib.parse import urlparse

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION

from botocore.exceptions import ClientError

LOGGER = get_logger(__name__, level=SETTINGS.log_level)
AWS_S3_CLIENT = AWS_SESSION.client("s3")


def remove_s3_folder(output_folder: str) -> None:
    """
    Delete all objects within a specified S3 prefix (folder).

    Deletes objects page by page to respect the 1000-key limit of
    ``delete_objects``.

    Args:
        output_folder: S3 path in format s3://bucket/key/prefix

    Raises:
        IOError: If there is an error deleting objects from S3.
    """
    LOGGER.info(f"Attempting to delete S3 folder: {output_folder}")
    try:
        bucket, key_prefix = parse_s3_path(output_folder)
    except ValueError as e:
        raise ValueError(f"Invalid S3 output folder: {e}")

    if not key_prefix.endswith("/"):
        key_prefix += "/"

    try:
        paginator = AWS_S3_CLIENT.get_paginator("list_objects_v2")
        pages = paginator.paginate(Bucket=bucket, Prefix=key_prefix)

        total_deleted = 0
        found_any = False
        for page in pages:
            if "Contents" not in page:
                continue
            found_any = True
            objects_to_delete = [{"Key": obj["Key"]} for obj in page["Contents"]]
            delete_response = AWS_S3_CLIENT.delete_objects(
                Bucket=bucket, Delete={"Objects": objects_to_delete}
            )
            if "Errors" in delete_response:
                for error in delete_response["Errors"]:
                    LOGGER.error(
                        f"Error deleting object {error['Key']} from S3: {error['Message']}"
                    )
                raise IOError(f"Failed to delete some objects from {output_folder}")
            total_deleted += len(objects_to_delete)

        if not found_any:
            LOGGER.info(
                f"S3 folder is already empty or does not exist: {output_folder}"
            )
            return

        LOGGER.info(
            f"Successfully deleted {total_deleted} objects from S3 folder: {output_folder}"
        )

    except ClientError as e:
        raise IOError(f"Error deleting objects from S3 folder {output_folder}: {e}")
    except IOError:
        raise
    except Exception as e:
        raise IOError(f"An unexpected error occurred: {e}")


def remove_local_folder(output_folder: str) -> None:
    """Delete the specified folder and all of its contents.

    Args:
        output_folder: Path to the directory to delete entirely.

    Raises:
        IOError: If there is an error deleting the folder.
    """
    import shutil

    output_path = Path(output_folder)
    if not output_path.exists():
        LOGGER.info(f"Local folder does not exist, skipping: {output_folder}")
        return
    try:
        shutil.rmtree(output_path)
        LOGGER.info(f"Deleted folder: {output_folder}")
    except Exception as e:
        raise IOError(f"Error deleting folder {output_folder}: {e}")


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
            f"Invalid S3 path: {s3_path}. Expected format: s3://bucket/key/prefix"
        )
    bucket = parsed.netloc
    key_prefix = parsed.path.lstrip("/")
    return bucket, key_prefix
