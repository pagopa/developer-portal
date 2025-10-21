import json
import requests
from typing import List

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION


LOGGER = get_logger(__name__)


AWS_S3_CLIENT = AWS_SESSION.client("s3")


def read_file_from_s3(
    file_path: str,
    bucket_name: str | None = None,
) -> str:
    """Reads a file from an S3 bucket.
    Args:
        file_path (str): The path to the file in the S3 bucket.
    Returns:
        str: The content of the file as a string.
    """

    bucket_name = bucket_name if bucket_name else SETTINGS.bucket_static_content
    try:
        response = AWS_S3_CLIENT.get_object(
            Bucket=bucket_name,
            Key=file_path,
        )
        text = response["Body"].read().decode("utf-8")

    except Exception as e:
        LOGGER.error(f"Error reading from S3 the file {bucket_name}/{file_path}: {e}")
        text = ""

    return text


def get_product_list() -> List[str]:
    """
    Fetches a list of products from AWS S3.
    Returns:
        List[str]: A list of product slugs. If the request fails, an empty list is returned.
    """
    s3_data = read_file_from_s3("synced-products-data-response.json")
    if s3_data:
        products = json.loads(s3_data)
        product_list = []
        if s3_data:
            products = json.loads(s3_data)
            for product in products["data"]:
                try:
                    product_slug = product["attributes"]["slug"]
                    product_list.append(product_slug)
                except KeyError as e:
                    LOGGER.error(f"Error extracting product slug: {e}")
        LOGGER.info(f"Found {len(product_list)} products: {product_list}.")
        return product_list
    else:
        raise ValueError(
            f"Not found {SETTINGS.bucket_static_content}/synced-products-data-response.json file in S3."
        )
