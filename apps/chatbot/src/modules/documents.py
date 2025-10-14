import json
import requests
from typing import List

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)


def get_product_list(website_url: str | None = None) -> List[str]:
    """
    Fetches a list of products from the website.
    Args:
        website_url (str | None): The base URL of the website. If None, uses the default WEBSITE_URL.
    Returns:
        List[str]: A list of product slugs. If the request fails, an empty list is returned.
    """
    if website_url is None:
        website_url = SETTINGS.website_url

    url = website_url.replace("https://", "https://cms.")
    url += "/api/products"
    headers = {"Authorization": f"Bearer {SETTINGS.strapi_api_key}"}
    response = requests.get(url, headers=headers)
    product_list = []
    if response.status_code == 200:
        products = json.loads(response.text)

        for product in products["data"]:
            try:
                product_slug = product["attributes"]["slug"]
                product_list.append(product_slug)
            except KeyError as e:
                LOGGER.error(f"Error extracting product slug: {e}")

    else:
        LOGGER.error(f"Failed to fetch product list: {response.status_code}")

    LOGGER.info(f"Found {len(product_list)} products: {product_list}.")
    return product_list
