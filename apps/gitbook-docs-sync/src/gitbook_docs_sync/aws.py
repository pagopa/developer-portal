"""S3 and CloudFront operations."""

from __future__ import annotations

import json
import logging
from collections.abc import Iterable
from pathlib import Path

import boto3
from botocore.exceptions import ClientError

LOGGER = logging.getLogger(__name__)


class S3Service:
    """Small, explicit wrapper around the S3 operations used by the sync."""

    def __init__(self, bucket_name: str) -> None:
        self.bucket_name = bucket_name
        self.client = boto3.client("s3")

    def download_text(self, key: str, default: str | None = None) -> str:
        try:
            response = self.client.get_object(Bucket=self.bucket_name, Key=key)
        except ClientError as error:
            if default is not None and error.response["Error"]["Code"] in {
                "NoSuchKey",
                "NoSuchBucket",
                "404",
            }:
                return default
            raise
        return response["Body"].read().decode("utf-8")

    def put_text(self, key: str, value: str) -> None:
        LOGGER.info("Uploading s3://%s/%s", self.bucket_name, key)
        self.client.put_object(Bucket=self.bucket_name, Key=key, Body=value.encode("utf-8"))

    def put_json(self, key: str, value: object) -> None:
        self.put_text(key, json.dumps(value, ensure_ascii=False, indent=2))

    def list_objects(self, prefix: str) -> dict[str, int]:
        objects: dict[str, int] = {}
        paginator = self.client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix):
            for item in page.get("Contents", []):
                objects[item["Key"]] = item["Size"]
        return objects

    def delete_keys(self, keys: Iterable[str]) -> None:
        values = list(keys)
        for offset in range(0, len(values), 1000):
            response = self.client.delete_objects(
                Bucket=self.bucket_name,
                Delete={"Objects": [{"Key": key} for key in values[offset : offset + 1000]]},
            )
            if errors := response.get("Errors"):
                raise RuntimeError(f"S3 deletion failed: {errors}")

    def delete_prefix(self, prefix: str) -> None:
        self.delete_keys(self.list_objects(prefix).keys())

    def sync_directory(
        self,
        source: Path,
        destination_prefix: str,
        *,
        size_only: bool,
        excluded_names: set[str] | None = None,
    ) -> None:
        if not source.is_dir():
            raise FileNotFoundError(f"Documentation directory does not exist: {source}")

        excluded = excluded_names or set()
        local_files = {
            f"{destination_prefix.rstrip('/')}/{path.relative_to(source).as_posix()}": path
            for path in source.rglob("*")
            if path.is_file() and path.name not in excluded
        }
        remote_files = self.list_objects(f"{destination_prefix.rstrip('/')}/")

        for key, path in local_files.items():
            if size_only and remote_files.get(key) == path.stat().st_size:
                continue
            LOGGER.info("Uploading %s", key)
            self.client.upload_file(str(path), self.bucket_name, key)

        self.delete_keys(set(remote_files).difference(local_files))


def invalidate_cloudfront(distribution_id: str) -> None:
    """Invalidate a distribution only when an ID was explicitly provided."""
    if not distribution_id:
        raise ValueError("CloudFront invalidation requested without a distribution ID")
    boto3.client("cloudfront").create_invalidation(
        DistributionId=distribution_id, InvalidationBatch={
            "Paths": {"Quantity": 1, "Items": ["/*"]},
            "CallerReference": __import__("uuid").uuid4().hex,
        }
    )
