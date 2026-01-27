import json
from typing import List

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION


LOGGER = get_logger(__name__, level=SETTINGS.log_level)
AWS_S3_CLIENT = AWS_SESSION.client("s3")
PRODUCTS_S3_FILEPATH = "synced-products-response.json"


def read_file_from_s3(
    file_path: str,
    bucket_name: str | None = None,
) -> str:
    """Reads a file from an S3 bucket.
    Args:
        file_path (str): The path to the file in the S3 bucket.
        bucket_name (str | None): The name of the S3 bucket. If None, uses the default bucket name.
    Returns:
        str | None: The content of the file as a string, or None if the file is not found.
    """

    bucket_name = bucket_name if bucket_name else SETTINGS.bucket_static_content
    text = ""
    try:
        response = AWS_S3_CLIENT.get_object(
            Bucket=bucket_name,
            Key=file_path,
        )
        text = response["Body"].read().decode("utf-8")

    except Exception as e:
        LOGGER.error(f"Error reading {bucket_name}/{file_path} from S3: {e}")

    return text


def get_product_list(file_path: str | None = None) -> List[str]:
    """
    Fetches a list of products from AWS S3.
    Args:
        file_path (str): The S3 file path to fetch the product data from.
    Returns:
        List[str]: A list of product slugs. If the request fails, an empty list is returned.
    """
    file_path = file_path if file_path else PRODUCTS_S3_FILEPATH

    s3_content = read_file_from_s3(file_path)
    product_list = []
    if s3_content:
        products = json.loads(s3_content)
        for product in products:
            try:
                if product["attributes"]["isVisible"]:
                    product_list.append(product["attributes"]["slug"])
            except KeyError as e:
                LOGGER.error(f"Error extracting product slug: {e}")
        LOGGER.info(f"Found {len(product_list)} products: {product_list}.")
    else:
        LOGGER.warning("Product data content is empty.")
    return product_list
