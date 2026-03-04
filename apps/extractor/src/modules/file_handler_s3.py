import os
import json
import tempfile
from typing import List, Tuple
from urllib.parse import urlparse

from botocore.exceptions import ClientError
from pydantic import ValidationError

from src.modules.logger import get_logger
from src.modules.schemas import InputDocument, CleanedDocument
from src.modules.settings import SETTINGS, AWS_SESSION

LOGGER = get_logger(__name__, level=SETTINGS.log_level)
AWS_S3_CLIENT = AWS_SESSION.client("s3")


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


def load_json_files(input_folder: str) -> Tuple[List[Tuple[str, InputDocument]], int]:
    """Load JSON files from S3 bucket.

    Args:
        input_folder: S3 path in format s3://bucket/key/prefix

    Returns:
        Tuple containing a list of tuples (filename, InputDocument) and the number of skipped files
    """
    try:
        bucket, key_prefix = parse_s3_path(input_folder)
    except ValueError as e:
        raise ValueError(f"Invalid S3 input folder: {e}")

    documents: List[Tuple[str, InputDocument]] = []
    skipped = 0

    try:
        # List all objects with the given prefix
        paginator = AWS_S3_CLIENT.get_paginator("list_objects_v2")
        pages = paginator.paginate(Bucket=bucket, Prefix=key_prefix)

        json_files = []
        for page in pages:
            if "Contents" not in page:
                continue
            for obj in page["Contents"]:
                key = obj["Key"]
                if key.endswith(".json"):
                    json_files.append(key)

        LOGGER.info(f"Found {len(json_files)} JSON files in s3://{bucket}/{key_prefix}")

        for key in json_files:
            filename = os.path.basename(key)
            try:
                # Download file content from S3
                response = AWS_S3_CLIENT.get_object(Bucket=bucket, Key=key)
                content = response["Body"].read().decode("utf-8", errors="replace")
                data = json.loads(content)

                doc = InputDocument(**data)
                if not doc.bodyText or doc.bodyText.strip() == "":
                    LOGGER.warning(
                        f"File of url '{doc.url}' has empty bodyText. Will skip it."
                    )
                    skipped += 1
                    continue
                documents.append((filename, doc))
                LOGGER.debug(f"Loaded: {filename}")
            except ValidationError as e:
                LOGGER.error(f"Validation error in {filename}: {e}")
            except json.JSONDecodeError as e:
                LOGGER.error(f"JSON decode error in {filename}: {e}")
            except UnicodeDecodeError as e:
                LOGGER.error(f"Encoding error in {filename}: {e}")
            except ClientError as e:
                LOGGER.error(f"S3 error loading {filename}: {e}")
            except Exception as e:
                LOGGER.error(f"Unexpected error loading {filename}: {e}")

    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code", "")
        if error_code == "NoSuchBucket":
            raise FileNotFoundError(f"S3 bucket not found: {bucket}")
        elif error_code == "AccessDenied":
            raise PermissionError(f"Access denied to S3 bucket: {bucket}")
        else:
            raise IOError(
                f"S3 error listing objects in s3://{bucket}/{key_prefix}: {e}"
            )
    except Exception as e:
        raise IOError(f"Failed to list S3 objects in s3://{bucket}/{key_prefix}: {e}")

    LOGGER.info(f"Successfully loaded {len(documents)} documents")
    return documents, skipped


def save_cleaned_document(
    output_folder: str, filename: str, doc: CleanedDocument
) -> None:
    """Save cleaned document to S3 bucket.

    Args:
        output_folder: S3 path in format s3://bucket/key/prefix
        filename: Name of the file to save
        doc: CleanedDocument to save
    """
    try:
        bucket, key_prefix = parse_s3_path(output_folder)
    except ValueError as e:
        raise ValueError(f"Invalid S3 output folder: {e}")

    # Ensure key_prefix ends with / if it exists
    if key_prefix and not key_prefix.endswith("/"):
        key_prefix += "/"

    key = f"{key_prefix}{filename}"

    try:
        # Convert document to JSON string
        json_content = json.dumps(doc.to_dict(), indent=2, ensure_ascii=False)

        # Write to temporary file and upload to S3
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", delete=False, suffix=".json"
        ) as tmp_file:
            tmp_file.write(json_content)
            tmp_file_path = tmp_file.name

        try:
            AWS_S3_CLIENT.upload_file(
                tmp_file_path,
                bucket,
                key,
                ExtraArgs={"ContentType": "application/json"},
            )
            LOGGER.debug(f"Saved: {filename} to s3://{bucket}/{key}")
        finally:
            # Clean up temporary file
            import os

            os.unlink(tmp_file_path)
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code", "")
        if error_code == "NoSuchBucket":
            raise FileNotFoundError(f"S3 bucket not found: {bucket}")
        elif error_code == "AccessDenied":
            raise PermissionError(f"Access denied to S3 bucket: {bucket}")
        else:
            raise IOError(f"S3 error writing file s3://{bucket}/{key}: {e}")
    except UnicodeEncodeError as e:
        raise IOError(f"Encoding error writing file s3://{bucket}/{key}: {e}")
    except Exception as e:
        raise IOError(f"Failed to write file s3://{bucket}/{key}: {e}")
