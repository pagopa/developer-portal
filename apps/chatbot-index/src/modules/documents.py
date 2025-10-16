import os
import re
import logging
import time
import json
import yaml
import tqdm
import requests
import html2text
from tempfile import mkdtemp
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import quote
from typing import Tuple, List, Dict
import xml.etree.ElementTree as ET

from llama_index.core import Document

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION


logging.getLogger("botocore").setLevel(logging.ERROR)
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


def remove_figure_blocks(md_text):
    """Removes <figure> blocks from Markdown text.
    Args:
        md_text (str): The Markdown text to process.
    Returns:
        str: The Markdown text with <figure> blocks removed.
    """
    return re.sub(r"<figure[\s\S]*?</figure>", "", md_text, flags=re.IGNORECASE)


# def get_product_list(website_url: str | None = None) -> List[str]:
#     """
#     Fetches a list of products from the website.
#     Args:
#         website_url (str | None): The base URL of the website. If None, uses the default WEBSITE_URL.
#     Returns:
#         List[str]: A list of product slugs. If the request fails, an empty list is returned.
#     """
#     if website_url is None:
#         website_url = SETTINGS.website_url

#     url = website_url.replace("https://", "https://cms.")
#     url += "/api/products"
#     headers = {"Authorization": f"Bearer {SETTINGS.strapi_api_key}"}
#     response = requests.get(url, headers=headers)
#     product_list = []
#     if response.status_code == 200:
#         products = json.loads(response.text)

#         for product in products["data"]:
#             try:
#                 product_slug = product["attributes"]["slug"]
#                 product_list.append(product_slug)
#             except KeyError as e:
#                 LOGGER.error(f"Error extracting product slug: {e}")

#     else:
#         LOGGER.error(f"Failed to fetch product list: {response.status_code}")

#     LOGGER.info(f"Found {len(product_list)} products: {product_list}.")
#     return product_list


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


def filter_urls(urls: List[str]) -> List[str]:
    """
    Filters out HTML files that match specific patterns.
    Args:
        urls (List[str]): A list of HTML file paths to filter.
    Returns:
        List[str]: A list of filtered HTML file paths.
    """

    # Get the dynamic product list
    product_list = get_product_list()

    pattern = re.compile(r"/v\d{1,2}.")
    pattern2 = re.compile(r"/\d{1,2}.")

    # Create dynamic product API path exclusions
    product_api_exclusions = [f"/{product}/api/" for product in product_list]

    filtered_urls = []
    for file in urls:
        # Check basic patterns
        if pattern.search(file) or pattern2.search(file):
            continue

        # Check static exclusions
        if "/auth/" in file or "/profile/" in file:
            continue

        # Check dynamic product API exclusions
        if any(exclusion in file for exclusion in product_api_exclusions):
            continue

        filtered_urls.append(file)

    return filtered_urls


def get_sitemap_urls(website_url: str | None = None) -> List[Dict[str, str]]:
    """
    Fetches URLs from a sitemap XML file.
    Args:
        sitemap_url (str): The URL of the sitemap XML file. If None, uses the default WEBSITE_URL.
    Returns:
        List[Dict[str, str]]: A list of dictionaries containing URLs and their last modified dates.
    """

    if website_url is None:
        sitemap_url = f"{SETTINGS.website_url}/sitemap.xml"
    else:
        sitemap_url = f"{website_url}/sitemap.xml"

    LOGGER.info(f"Fetching sitemap from {sitemap_url}")
    response = requests.get(sitemap_url)
    if response.status_code == 200:
        LOGGER.info("Sitemap fetched successfully.")
        root = ET.fromstring(response.content)
        ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        sitemap = []
        for entry in root.findall("ns:url", ns) + root.findall("ns:sitemap", ns):
            loc = entry.find("ns:loc", ns)
            lastmod = entry.find("ns:lastmod", ns)
            sitemap.append(
                {
                    "url": loc.text if loc is not None else "N/A",
                    "lastmod": lastmod.text if lastmod is not None else "N/A",
                }
            )
        LOGGER.info(f"Found {len(sitemap)} URLs in the sitemap.")

        return sitemap
    else:
        LOGGER.error(f"Error fetching data: {response.status_code}")
        return []


def html2markdown(html: str) -> Tuple[str, str]:
    """
    Converts HTML content to Markdown format.
    Args:
        html (str): The HTML content to convert.
    Returns:
        Tuple[str, str]: A tuple containing the title and the Markdown content.
    """

    converter = html2text.HTML2Text()
    converter.ignore_images = True
    converter.ignore_links = False
    converter.ignore_mailto_links = True

    soup = BeautifulSoup(html, "html.parser")
    soup_content = soup.find(attrs={"id": "chatbot-page-content"})
    content = converter.handle(str(soup_content))

    if soup.title and soup.title.string:
        title = str(soup.title.string)
    else:
        title = ""

    return title, content.strip()


# def get_apidata(website_url: str | None = None) -> dict:
#     """
#     Fetches API data from a remote source.
#     Args:
#         website_url (str): The base URL of the website. If None, uses the default WEBSITE_URL.
#     Returns:
#         dict: Parsed JSON data from the API response.
#     """
#     if website_url is None:
#         url = SETTINGS.website_url.replace("https://", "https://cms.")
#     else:
#         url = website_url.replace("https://", "https://cms.")
#     url += "/api/apis-data?populate[product]=*&populate[apiRestDetail][populate][specUrls]=*"
#     headers = {"Authorization": f"Bearer {SETTINGS.strapi_api_key}"}

#     response = requests.get(url, headers=headers)
#     LOGGER.info(f"Fetching API data from {url}")
#     if response.status_code == 200:
#         return json.loads(response.text)
#     else:
#         LOGGER.error(
#             f"Failed to fetch data from API. Status code: {response.status_code}"
#         )
#         return response.text


def get_apidata() -> dict:
    """
    Fetches API data from AWS S3.
    Returns:
        dict: Parsed JSON data from the API response.
    """
    s3_data = read_file_from_s3("synced-apis-data-response.json")
    if s3_data:
        return json.loads(s3_data)
    else:
        raise ValueError(
            f"Not found {SETTINGS.bucket_static_content}/synced-apis-data-response.json file in S3."
        )


def read_api_url(url: str) -> str:
    """
    Reads the OpenAPI specification from a given URL and returns it as a string.

    Args:
        url (str): The URL to fetch the OpenAPI specification from.

    Returns:
        str: The OpenAPI specification as a string.
    """

    response = requests.get(url)
    if response.status_code == 200:
        if url.endswith(".yaml") or url.endswith(".yml"):
            data = yaml.safe_load(response.text)
        elif url.endswith(".json"):
            data = json.loads(response.text)
        else:
            raise ValueError("Unsupported file format. Use .yaml, .yml, or .json.")

        txt = "#" + data["info"]["title"] + "\n\n"
        if "description" in data["info"].keys():
            txt += data["info"]["description"] + "\n\n"

        paths = data.get("paths", {})
        for path, methods in paths.items():
            for method, details in methods.items():
                txt += f"{method.upper()} {path}\n"
                if isinstance(details, dict):
                    for key, value in details.items():
                        txt += f"   - {key}: {value}\n"
                txt += "\n"
    else:
        txt = ""
        LOGGER.warning(
            f"Failed to fetch OpenAPI spec from {url}. Status code: {response.status_code}. Skipped."
        )

    return txt


def get_api_docs() -> List[Document]:
    """
    Creates API documentation in Markdown format from the provided API data.

    Args:
        api_data (dict): The API data to convert into documentation.

    Returns:
        list: The llama-index Documents list.
    """

    api_data = get_apidata()

    num_apis = len(api_data["data"])
    LOGGER.info(f"{num_apis} API documents to read.")

    docs = []
    for data in tqdm.tqdm(api_data["data"], total=num_apis, desc="Getting API docs"):
        title = data["attributes"]["title"]
        product_slug = data["attributes"]["product"]["data"]["attributes"]["slug"]
        if data["attributes"]["apiRestDetail"] is not None:
            api_slug = data["attributes"]["apiRestDetail"]["slug"]
            for spec_urls in data["attributes"]["apiRestDetail"]["specUrls"]:
                api_txt = read_api_url(spec_urls["url"].strip())
                api_url = os.path.join(
                    SETTINGS.website_url, product_slug, "api", api_slug
                )
                if spec_urls["name"] is not None:
                    api_url += f"?spec={quote(spec_urls['name'])}"
                docs.append(
                    Document(
                        id_=api_url.replace(SETTINGS.website_url, ""),
                        text=api_txt,
                        metadata={
                            "filepath": api_url.replace(SETTINGS.website_url, ""),
                            "title": title,
                        },
                    )
                )

    return docs


def get_static_and_dynamic_metadata(
    website_url: str | None = None,
) -> Tuple[List[dict], List[dict]]:
    """
    Fetches static and dynamic URLs from the sitemap and metadata files.
    Args:
        website_url (str | None): The base URL of the website. If None, uses the default WEBSITE_URL.
    Returns:
        Tuple[List[dict], List[dict]]: A tuple containing two lists:
            - A list of dictionaries with static URLs and their S3 file paths.
            - A list of dictionaries with dynamic URLs and their last modified dates.
    """

    sitemap = get_sitemap_urls(website_url)
    if not sitemap:
        return [], []
    else:
        sitemap_urls = [item["url"] for item in sitemap]
        sitemap_filtered_urls = filter_urls(sitemap_urls)

        static_metadata = []
        dynamic_metadata = []

        guides_metadata = json.loads(read_file_from_s3("guides-metadata.json"))
        release_notes_metadata = json.loads(
            read_file_from_s3("release-notes-metadata.json")
        )
        solutions_metadata = json.loads(read_file_from_s3("solutions-metadata.json"))
        all_metadata = guides_metadata + release_notes_metadata + solutions_metadata
        all_url_metadata = [
            SETTINGS.website_url + item["path"] for item in all_metadata
        ]

        for url in sitemap_filtered_urls:
            if url in all_url_metadata:
                idx = all_url_metadata.index(url)
                static_metadata.append(
                    {
                        "url": url,
                        "s3_file_path": all_metadata[idx]["contentS3Path"],
                        "title": all_metadata[idx]["title"],
                    }
                )
            else:
                idx = sitemap_urls.index(url)
                dynamic_metadata.append(sitemap[idx])

    LOGGER.info(
        f"Found {len(static_metadata)} static URLs and {len(dynamic_metadata)} dynamic URLs."
    )
    return static_metadata, dynamic_metadata


def get_static_docs(static_urls: List[dict]) -> List[Document]:
    """
    Fetches static documents from the provided URLs.
    Args:
        static_urls (List[dict]): A list of dictionaries containing URLs and S3 file paths.
    Returns:
        List[Document]: A list of Document objects containing the content and metadata.
    """

    static_docs = []
    for item in tqdm.tqdm(
        static_urls, total=len(static_urls), desc="Getting static documents"
    ):

        url = item["url"]
        title = item["title"]
        text = read_file_from_s3(item["s3_file_path"])
        text = remove_figure_blocks(text)

        static_docs.append(
            Document(
                id_=item["s3_file_path"],
                text=text,
                metadata={
                    "filepath": url.replace(SETTINGS.website_url, ""),
                    "title": title,
                    "language": "it",
                },
            )
        )

    return static_docs


def get_dynamic_docs(dynamic_urls: List[dict]) -> List[Document]:
    """
    Fetches dynamic documents from the provided URLs using Selenium.
    Args:
        dynamic_urls (List[str]): A list of URLs to fetch dynamic documents from.
    Returns:
        List[Document]: A list of Document objects containing the content and metadata.
    """

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-dev-tools")
    chrome_options.add_argument("--no-zygote")
    chrome_options.add_argument("--single-process")
    chrome_options.add_argument(f"--user-data-dir={mkdtemp()}")
    chrome_options.add_argument(f"--data-path={mkdtemp()}")
    chrome_options.add_argument(f"--disk-cache-dir={mkdtemp()}")
    chrome_options.add_argument("--remote-debugging-pipe")
    chrome_options.add_argument("--verbose")
    chrome_options.add_argument("--log-path=/tmp")
    chrome_options.binary_location = "/opt/chrome/chrome-linux64/chrome"

    service = Service(
        executable_path="/opt/chrome-driver/chromedriver-linux64/chromedriver",
        service_log_path="/tmp/chromedriver.log",
    )

    dynamic_docs = []
    discarded_docs = 0
    driver = webdriver.Chrome(
        options=chrome_options,
        service=service,
    )

    for item in tqdm.tqdm(
        dynamic_urls, total=len(dynamic_urls), desc="Getting dynamic documents"
    ):
        url = item["url"]
        lastmod = item["lastmod"]

        try:
            driver.get(url)
            time.sleep(5)
            # WebDriverWait(driver, 10).until(
            #     EC.visibility_of_element_located((By.ID, "chatbot-page-content"))
            # )
            title, text = html2markdown(driver.page_source)

            if text is not None and text != "" and text != "None":

                text = re.sub(r"(?<=[\wÀ-ÿ])\n(?=[\wÀ-ÿ])", " ", text)
                if title == "":
                    title = os.path.basename(url).replace("-", " ")

                dynamic_docs.append(
                    Document(
                        id_=url.replace(SETTINGS.website_url, ""),
                        text=text,
                        metadata={
                            "filepath": url.replace(SETTINGS.website_url, ""),
                            "language": "it",
                            "lastmod": lastmod,
                            "title": title,
                        },
                    )
                )
            else:
                discarded_docs += 1
                LOGGER.warning(f"Discarded {url} due to empty content.")

        except Exception as e:
            discarded_docs += 1
            LOGGER.warning(f"Discarded {url} due to {e}.")
            if driver:
                driver.quit()
            continue

    driver.quit()
    LOGGER.warning(
        f"Discarded {discarded_docs} dynamic documents due to empty content."
    )

    return dynamic_docs


def get_documents(website_url: str | None = None) -> List[Document]:
    """
    Fetches documents from static and dynamic sources.
    Args:
        website_url (str | None): The base URL of the website. If None, uses the default WEBSITE_URL.
    Returns:
        List[Document]: A list of Document objects containing the content and metadata.
    """

    static_metadata, dynamic_metadata = get_static_and_dynamic_metadata(website_url)

    api_docs = get_api_docs()
    static_docs = get_static_docs(static_metadata)
    dynamic_docs = get_dynamic_docs(dynamic_metadata)
    docs = api_docs + static_docs + dynamic_docs

    LOGGER.info(f"Total number of fetched documents: {len(docs)}")
    return docs
