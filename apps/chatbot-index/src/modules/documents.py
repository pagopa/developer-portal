import os
import re
import logging
import time
import json
import yaml
import tqdm
import requests
import html2text
from pydantic import BaseModel
from tempfile import mkdtemp
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from urllib.parse import quote
from typing import Tuple, List, Dict
import xml.etree.ElementTree as ET

from llama_index.core import Document

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS, AWS_SESSION


logging.getLogger("botocore").setLevel(logging.ERROR)
LOGGER = get_logger(__name__)
AWS_S3_CLIENT = AWS_SESSION.client("s3")
SITEMAP_S3_FILEPATH = "sitemap.xml"
DOCS_PARENT_FOLDER = "devportal-docs/docs/"
GUIDES_FOLDER_FILEPATH = "main-guide-versions-dirNames.json"
SOLUTIONS_FOLDER_FILEPATH = "solutions-dirNames.json"
RELEASE_NOTES_FOLDER_FILEPATH = "release-notes-dirNames.json"
PRODUCTS_S3_FILEPATH = "synced-products-response.json"
APIS_DATA_S3_FILEPATH = "synced-apis-data-response.json"


class StaticMetadata(BaseModel):
    url: str
    s3_file_path: str
    title: str


class DynamicMetadata(BaseModel):
    url: str
    lastmod: str


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


def get_folders_list(
    guides_folders_filepath: str | None = None,
    solution_folders_filepath: str | None = None,
    release_notes_folders_filepath: str | None = None,
) -> List[str]:
    """Reads folder names from S3 files.
    Args:
        guides_folders_filepath (str | None): The S3 file path for guides folder names.
        solution_folders_filepath (str | None): The S3 file path for solution folder names.
        release_notes_folders_filepath (str | None): The S3 file path for release notes folder names.
    Returns:
        List[str]: A list of folder names."""

    guides_folders_filepath = (
        guides_folders_filepath if guides_folders_filepath else GUIDES_FOLDER_FILEPATH
    )
    solution_folders_filepath = (
        solution_folders_filepath
        if solution_folders_filepath
        else SOLUTIONS_FOLDER_FILEPATH
    )
    release_notes_folders_filepath = (
        release_notes_folders_filepath
        if release_notes_folders_filepath
        else RELEASE_NOTES_FOLDER_FILEPATH
    )

    folders_list = []
    for filepath in [
        guides_folders_filepath,
        solution_folders_filepath,
        release_notes_folders_filepath,
    ]:
        s3_content = read_file_from_s3(filepath)
        if s3_content:
            try:
                folders_content = json.loads(s3_content)
            except Exception as e:
                LOGGER.warning(f"Failed to decode {filepath}: {e}")
                folders_content = {"dirNames": []}

        folders_list.extend(folders_content.get("dirNames", []))

    return folders_list


def get_one_metadata_from_s3(
    folder_name: str,
    folders_list: List[str],
    docs_parent_folder: str | None = None,
    bucket_name: str | None = None,
) -> List[Dict[str, str]]:
    """
    Reads a single metadata file from S3 bucket.
    Args:
        folder_name (str): The folder name in the S3 bucket where the metadata file is located.
        main_folders_list (List[str]): The list of valid folder names.
        docs_parent_folder (str | None): The parent folder in the S3 bucket where the metadata files
            are located.
        bucket_name (str | None): The name of the S3 bucket.
    Returns:
        Dict[str, str]: The metadata dictionary."""

    docs_parent_folder = (
        docs_parent_folder if docs_parent_folder else DOCS_PARENT_FOLDER
    )
    bucket_name = bucket_name if bucket_name else SETTINGS.bucket_static_content
    if folder_name in folders_list:
        s3_content = read_file_from_s3(
            os.path.join(docs_parent_folder, folder_name, "metadata.json")
        )
        try:
            folder_metadata = json.loads(s3_content) if s3_content else {}
        except Exception as e:
            LOGGER.warning(
                f"Failed to decode metadata.json in folder {docs_parent_folder}/{folder_name}: {e}"
            )

    else:
        folder_metadata = {}
        LOGGER.warning(f"Folder name {folder_name} not found in folders list.")

    return folder_metadata


def get_metadata_from_s3(
    docs_parent_folder: str | None = None,
    bucket_name: str | None = None,
) -> List[Dict[str, str]]:
    """
    Reads metadata files from S3 bucket.
    Args:
        docs_parent_folder (str | None): The parent folder in the S3 bucket where the metadata files
            are located.
        bucket_name (str | None): The name of the S3 bucket.
    Returns:
        List[Dict[str, str]]: list containing the metadata dictionaries.
    """

    docs_parent_folder = (
        docs_parent_folder if docs_parent_folder else DOCS_PARENT_FOLDER
    )
    bucket_name = bucket_name if bucket_name else SETTINGS.bucket_static_content

    folders_list = get_folders_list()
    metadata = []
    for folder_name in folders_list:
        folder_metadata = []
        try:
            s3_content = read_file_from_s3(
                os.path.join(docs_parent_folder, folder_name, "metadata.json")
            )
            folder_metadata = json.loads(s3_content) if s3_content else []
        except Exception as e:
            LOGGER.warning(
                f"Failed to decode metadata.json in folder {docs_parent_folder}/{folder_name}: {e}"
            )

        metadata.extend(folder_metadata)
    if not metadata:
        raise ValueError("No metadata found in S3.")

    return metadata


def remove_figure_blocks(md_text):
    """Removes <figure> blocks from Markdown text.
    Args:
        md_text (str): The Markdown text to process.
    Returns:
        str: The Markdown text with <figure> blocks removed.
    """
    return re.sub(r"<figure[\s\S]*?</figure>", "", md_text, flags=re.IGNORECASE)


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
        raise ValueError("Product data content is empty.")
    return product_list


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


def get_sitemap_urls(file_path: str | None = None) -> List[Dict[str, str]]:
    """
    Fetches URLs from a sitemap XML file.
    Args:
        file_path (str): The S3 file path to fetch the sitemap from.
    Returns:
        List[Dict[str, str]]: A list of dictionaries containing URLs and their last modified dates.
    """

    sitemap_path = file_path if file_path else SITEMAP_S3_FILEPATH

    sitemap_content = read_file_from_s3(sitemap_path)
    if sitemap_content:
        root = ET.fromstring(sitemap_content)
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
    else:
        raise ValueError("Sitemap content is empty.")

    return sitemap


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


def get_apidata(file_path: str | None = None) -> dict:
    """
    Fetches API data from AWS S3.
    Args:
        file_path (str): The S3 file path to fetch the API data from.
    Returns:
        dict: Parsed JSON data from the API response.
    """
    file_path = file_path if file_path else APIS_DATA_S3_FILEPATH

    s3_data = read_file_from_s3(file_path)
    if not s3_data:
        raise ValueError("API data content is empty.")
    return json.loads(s3_data)


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
    docs = []
    for data in tqdm.tqdm(api_data, total=len(api_data), desc="Getting API docs"):
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


def get_static_metadata() -> List[StaticMetadata]:
    """
    Get the metadata from S3 and maps them into static metadata to create later LlamaIndex Documents.
    Returns:
        List[StaticMetadata]: A list of StaticMetadata objects containing static metadata.
    """

    static_metadata = []
    all_metadata = get_metadata_from_s3()

    for item in all_metadata:
        static_metadata.append(
            StaticMetadata(
                url=SETTINGS.website_url + item["path"],
                s3_file_path=item["contentS3Path"],
                title=item["title"],
            )
        )

    LOGGER.info(f"Found {len(static_metadata)} static URLs.")
    return static_metadata


def get_dynamic_metadata(
    static_metadata: List[StaticMetadata],
) -> List[DynamicMetadata]:
    """
    Fetches dynamic metadata by comparing sitemap URLs with static metadata.
    Args:
        static_metadata (List[StaticMetadata]): A list of StaticMetadata objects containing static metadata.
    Returns:
        List[DynamicMetadata]: A list of DynamicMetadata objects containing dynamic metadata.
    """

    dynamic_metadata = []
    sitemap = get_sitemap_urls()
    all_url_metadata = [item.url for item in static_metadata]
    sitemap_urls = [item["url"] for item in sitemap]
    sitemap_filtered_urls = filter_urls(sitemap_urls)

    for url in sitemap_filtered_urls:
        if url not in all_url_metadata:
            idx = sitemap_filtered_urls.index(url)
            dynamic_metadata.append(
                DynamicMetadata(
                    url=url,
                    lastmod=sitemap[idx]["lastmod"],
                )
            )

    LOGGER.info(f"Found {len(dynamic_metadata)} dynamic URLs.")
    return dynamic_metadata


def get_static_docs(static_metadata: List[StaticMetadata]) -> List[Document]:
    """
    Fetches static documents from the provided metadata.
    Args:
        static_metadata (List[StaticMetadata]): A list of StaticMetadata objects containing metadata for static documents.
    Returns:
        List[Document]: A list of Document objects containing the content and metadata.
    """

    static_docs = []
    for item in tqdm.tqdm(
        static_metadata, total=len(static_metadata), desc="Getting static documents"
    ):

        url = item.url
        title = item.title
        text = read_file_from_s3(item.s3_file_path)

        if text:
            text = remove_figure_blocks(text)

            static_docs.append(
                Document(
                    id_=item.s3_file_path,
                    text=text,
                    metadata={
                        "filepath": url.replace(SETTINGS.website_url, ""),
                        "title": title,
                        "language": "it",
                    },
                )
            )
        else:
            LOGGER.warning(
                f"Discarded reading {item.s3_file_path} due to empty content."
            )

    return static_docs


def get_dynamic_docs(dynamic_metadata: List[DynamicMetadata]) -> List[Document]:
    """
    Fetches dynamic documents from the provided metadata using Selenium.
    Args:
        dynamic_metadata (List[DynamicMetadata]): A list of DynamicMetadata objects containing metadata for dynamic documents.
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
        dynamic_metadata, total=len(dynamic_metadata), desc="Getting dynamic documents"
    ):
        url = item.url
        lastmod = item.lastmod

        try:
            driver.get(url)
            time.sleep(5)
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


def get_documents() -> List[Document]:
    """
    Fetches documents from static and dynamic sources.
    Returns:
        List[Document]: A list of Document objects containing the content and metadata.
    """

    static_metadata = get_static_metadata()
    dynamic_metadata = get_dynamic_metadata(static_metadata)

    api_docs = get_api_docs()
    static_docs = get_static_docs(static_metadata)
    dynamic_docs = get_dynamic_docs(dynamic_metadata)
    docs = api_docs + static_docs + dynamic_docs

    LOGGER.info(f"Total number of fetched documents: {len(docs)}")
    return docs
