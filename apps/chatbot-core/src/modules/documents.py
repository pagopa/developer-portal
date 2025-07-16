import os
import re
import time
import json
import yaml
import tqdm
import hashlib
import requests
import html2text
from bs4 import BeautifulSoup
from selenium import webdriver
from urllib.parse import quote
from typing import List, Tuple

from llama_index.core import Document

from src.modules.logger import get_logger
from src.modules.utils import get_ssm_parameter


LOGGER = get_logger(__name__)
STRAPI_API_KEY = get_ssm_parameter(
    os.getenv("CHB_AWS_SSM_STRAPI_API_KEY"), os.getenv("CHB_STRAPI_API_KEY", "")
)
DYNAMIC_HTMLS = [
    "/case-histories/",
    "/release-notes/",
    "/solutions/",
    "/webinars/",
    "index.html",
    "privacy-policy.html",
    "terms-of-service.html",
]


def hash_url(url: str) -> str:
    """
    Generates a SHA-256 hash for the given URL.
    Args:
        url (str): The URL to hash.
    Returns:
        str: The SHA-256 hash of the URL.
    """

    return hashlib.sha256(url.encode()).hexdigest()


def filter_html_files(html_files: List[str]) -> List[str]:
    """
    Filters out HTML files that match specific patterns.
    Args:
        html_files (List[str]): A list of HTML file paths to filter.
    Returns:
        List[str]: A list of HTML file paths that do not match the specified patterns.
    """

    pattern = re.compile(r"/v\d{1,2}.")
    pattern2 = re.compile(r"/\d{1,2}.")
    filtered_files = [
        file
        for file in html_files
        if not pattern.search(file)
        and not pattern2.search(file)
        and "/auth/" not in file
        and "/app-io/api/" not in file
        and "/firma-con-io/api/" not in file
        and "/pago-pa/api/" not in file
        and "/pdnd-interoperabilita/api/" not in file
        and "/send/api/" not in file
        and "/profile/" not in file
        and "questions.html" not in file
    ]
    return filtered_files


def get_html_files(root_folder: str) -> List[str]:
    """
    Retrieves all HTML files from the specified root folder and its subdirectories.
    Args:
        root_folder (str): The root folder to search for HTML files.
    Returns:
        List[str]: A list of paths to HTML files, filtered and sorted.
    """

    html_files = []
    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))

    LOGGER.info(f"root_folder: {root_folder}")
    LOGGER.info(f"html_files: {len(html_files)}")
    sorted_and_filtered = sorted(filter_html_files(html_files))
    LOGGER.info(f"sorted_and_filtered: {len(sorted_and_filtered)}")
    return sorted_and_filtered


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


def get_apidata(website_url: str) -> dict:
    """
    Fetches API data from a remote source.
    Args:
        website_url (str): The base URL of the website.
    Returns:
        dict: Parsed JSON data from the API response.
    """

    url = website_url.replace("https://", "https://cms.")
    url += "/api/apis-data?populate[product]=*&populate[apiRestDetail][populate][specUrls]=*"
    headers = {"Authorization": f"Bearer {STRAPI_API_KEY}"}

    response = requests.get(url, headers=headers)
    LOGGER.info(f"Fetching API data from {url}, headers: {headers}")
    if response.status_code == 200:
        return json.loads(response.text)
    else:
        LOGGER.error(
            f"Failed to fetch data from API. Status code: {response.status_code}"
        )
        return response.text


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
        return txt
    else:
        raise ValueError(
            f"Failed to fetch OpenAPI spec from {url}. Status code: {response.status_code}"
        )


def get_api_docs(website_url: str) -> list:
    """
    Creates API documentation in Markdown format from the provided API data.

    Args:
        api_data (dict): The API data to convert into documentation.

    Returns:
        list: The llama-index Documents list.
    """

    api_data = get_apidata(website_url)

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
                api_url = os.path.join(website_url, product_slug, "api", api_slug)
                if spec_urls["name"] is not None:
                    api_url += f"?spec={quote(spec_urls['name'])}"
                docs.append(
                    Document(
                        id_=api_url.replace(website_url, ""),
                        text=api_txt,
                        metadata={
                            "filepath": api_url.replace(website_url, ""),
                            "title": title,
                        },
                    )
                )

    return docs


def get_guide_docs(
    website_url: str,
    documentation_dir: str = "./PagoPADevPortal/out/",
) -> Tuple[List[Document], dict]:
    """
    Extracts documentation from HTML files in the specified directory and converts them to Markdown format.
    Args:
        website_url (str): The base URL of the website.
        documentation_dir (str): The directory containing the HTML files.

    Returns:
        Tuple[List[Document], dict]: A tuple containing a list of Document objects and a hash table mapping masked URLs to original URLs.
    """

    if documentation_dir[-1] != "/":
        documentation_dir += "/"

    html_files = get_html_files(documentation_dir)
    dynamic_htmls = [os.path.join(documentation_dir, path) for path in DYNAMIC_HTMLS]
    documents = []
    hash_table = {}
    empty_pages = []

    driver_exe_path = "/usr/bin/chromedriver"
    if os.path.exists(driver_exe_path):
        driver_service = webdriver.ChromeService(executable_path=driver_exe_path)
    else:
        driver_service = None
    driver_options = webdriver.ChromeOptions()
    driver_options.add_argument("--headless")
    driver_options.add_argument("--disable-gpu")
    driver_options.add_argument("--no-sandbox")
    driver_options.add_argument("--disable-dev-shm-usage")
    driver_options.add_argument("--single-process")


    for file in tqdm.tqdm(html_files, total=len(html_files), desc="Getting guide docs"):

        if any(part in file for part in DYNAMIC_HTMLS):
            url = file.replace(documentation_dir, f"{website_url}/").replace(
                ".html", ""
            )

            driver = webdriver.Chrome(options=driver_options, service=driver_service)

            driver.get(url)
            time.sleep(5)
            title, text = html2markdown(driver.page_source)
            driver.quit()
        else:
            title, text = html2markdown(open(file))

        if (
            text is None
            or text == ""
            or text == "None"
            or text
            == (
                "404\n\n#### Pagina non trovata\n\nLa pagina che stai cercando non "
                "esiste"
            )
        ):
            empty_pages.append(file)

        else:

            text = re.sub(r"(?<=[\wÀ-ÿ])\n(?=[\wÀ-ÿ])", " ", text)

            url = file.replace(documentation_dir, f"{website_url}/").replace(
                ".html", ""
            )
            masked_url = hash_url(url)
            if masked_url not in hash_table.keys():
                hash_table[masked_url] = url

            if title == "":
                title = f"PagoPA DevPortal | {os.path.basename(url)}"

            documents.append(
                Document(
                    id_=url.replace(website_url, ""),
                    text=text,
                    metadata={
                        "filepath": url.replace(website_url, ""),
                        "title": title,
                        "language": "it",
                    },
                )
            )

    LOGGER.info(f"Number of documents with content: {len(documents)}")
    LOGGER.info(
        f"Number of empty pages in the documentation: {len(empty_pages)}. "
        "These are left out."
    )
    with open("empty_htmls.json", "w") as f:
        json.dump(empty_pages, f, indent=4)

    return documents, hash_table
