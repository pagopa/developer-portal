import os
import re
import time
import json
import tqdm
import hashlib
import html2text
import pytz
from logging import getLogger
from datetime import datetime
from bs4 import BeautifulSoup
from selenium import webdriver
from typing import List, Tuple

from llama_index.core import (
    Settings,
    Document,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage
)
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.node_parser import HierarchicalNodeParser, get_leaf_nodes
from llama_index.storage.docstore.redis import RedisDocumentStore
from llama_index.storage.index_store.redis import RedisIndexStore
from llama_index.storage.kvstore.redis import RedisKVStore
from llama_index.vector_stores.redis import RedisVectorStore

from redis import Redis
import redis.asyncio as aredis
from redisvl.schema import IndexSchema

from src.modules.utils import get_ssm_parameter, put_ssm_parameter

from dotenv import load_dotenv


load_dotenv()
logger = getLogger(__name__)


PROVIDER = os.getenv("CHB_PROVIDER")
assert PROVIDER in ["google", "aws"]

TODAY = datetime.now(pytz.timezone("Europe/Rome")).strftime("%Y-%m-%d--%H:%M:%S")
INDEX_ID = get_ssm_parameter(os.getenv("CHB_LLAMAINDEX_INDEX_ID"))
NEW_INDEX_ID = f"index--{TODAY}"

REDIS_URL = os.getenv("CHB_REDIS_URL")
WEBSITE_URL = os.getenv("CHB_WEBSITE_URL")
REDIS_CLIENT = Redis.from_url(REDIS_URL, socket_timeout=10)
REDIS_ASYNC_CLIENT = aredis.Redis.from_pool(
    aredis.ConnectionPool.from_url(REDIS_URL)
)
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")
EMBEDDING_DIMS = {
    "models/text-embedding-004": 768,
    "cohere.embed-multilingual-v3": 1024
}
REDIS_SCHEMA = IndexSchema.from_dict({
    "index": {"name": f"{INDEX_ID}", "prefix": f"{INDEX_ID}/vector"},
    "fields": [
        {"name": "id", "type": "tag", "attrs": {"sortable": False}},
        {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
        {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
        {"name": "vector", "type": "vector", "attrs": {
            "dims": EMBEDDING_DIMS[EMBED_MODEL_ID],
            "algorithm": "flat",
            "distance_metric": "cosine"
        }}
    ]
})
REDIS_KVSTORE = RedisKVStore(
    redis_client=REDIS_CLIENT,
    async_redis_client=REDIS_ASYNC_CLIENT
)
REDIS_DOCSTORE = RedisDocumentStore(
    redis_kvstore=REDIS_KVSTORE
)
REDIS_INDEX_STORE = RedisIndexStore(
    redis_kvstore=REDIS_KVSTORE
)
DYNAMIC_HTMLS = [
    "case-histories/tari-cagliari.html",
    "firma-con-io/api/firma-con-io-main.html",
    "index.html",
    "privacy-policy.html",
    "send/api/send-main.html",
    "solutions/multe-per-violazioni-al-codice-della-strada.html",
    "solutions/tassa-sui-rifiuti-tari.html",
    "terms-of-service.html",
    "webinars.html",
]


def hash_url(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()


def filter_html_files(html_files: List[str]) -> List[str]:
    pattern = re.compile(r"/v\d{1,2}.")
    pattern2 = re.compile(r"/\d{1,2}.")
    filtered_files = [file for file in html_files if not pattern.search(file) and not pattern2.search(file)]
    return filtered_files


def get_html_files(root_folder: str) -> List[str]:
    html_files = []
    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))
    return sorted(filter_html_files(html_files))


def html2markdown(html):

    converter = html2text.HTML2Text()
    converter.ignore_images = True
    converter.ignore_links = True
    converter.ignore_mailto_links = True

    soup = BeautifulSoup(html, "html.parser")
    soup_content = soup.find(attrs={"id": "chatbot-page-content"})
    content = converter.handle(str(soup_content))

    if soup.title and soup.title.string:
        title = str(soup.title.string)
    else:
        title = ""

    return title, content.strip()


def create_documentation(
        website_url: str,
        documentation_dir: str = "./PagoPADevPortal/out/",
    ) -> Tuple[List[Document], dict]:
    
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
    driver_options.add_argument('--headless')
    driver_options.add_argument('--disable-gpu')
    driver_options.add_argument('--no-sandbox')
    driver_options.add_argument('--disable-dev-shm-usage')

    for file in tqdm.tqdm(html_files, total=len(html_files), desc="Extracting HTML"):

        if file in dynamic_htmls or "/webinars/" in file or "/api/" in file:
            url = file.replace(documentation_dir, f"{website_url}/").replace(".html", "")
            driver = webdriver.Chrome(
                options=driver_options,
                service=driver_service
            )

            driver.get(url)
            time.sleep(5)
            title, text = html2markdown(driver.page_source)
            driver.quit()
        else:
            title, text = html2markdown(open(file))

        if text is None or text == "" or text == "None" or text=="404\n\n#### Pagina non trovata\n\nLa pagina che stai cercando non esiste":
            empty_pages.append(file)

        else:

            text = re.sub(r'(?<=[\wÀ-ÿ])\n(?=[\wÀ-ÿ])', ' ', text)

            url = file.replace(
                documentation_dir, 
                f"{website_url}/"
            ).replace(".html", "")
            masked_url = hash_url(url)
            if masked_url not in hash_table.keys():
                hash_table[masked_url] = url

            if title == "":
                title = f"PagoPA DevPortal | {os.path.basename(url)}"

            documents.append(Document(
                text=text,
                metadata={
                    "filename": masked_url,
                    "title": title,
                    "language": "it"
                }
            ))

    logger.info(f"Number of documents with content: {len(documents)}")
    logger.info(f"Number of empty pages in the documentation: {len(empty_pages)}. These are left out.")
    with open("empty_htmls.json", "w") as f:
        json.dump(empty_pages, f, indent=4)
    
    return documents, hash_table


def build_automerging_index_redis(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        documentation_dir: str,
        chunk_sizes: List[int],
        chunk_overlap: int
    ) -> VectorStoreIndex:

    logger.info("Storing vector index and hash table on Redis..")

    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )
    
    documents, hash_table = create_documentation(WEBSITE_URL, documentation_dir)
    for key, value in hash_table.items():
        REDIS_KVSTORE.put(
            collection=f"hash_table_{NEW_INDEX_ID}",
            key=key,
            val=value
        )
    logger.info(f"[vector_database.py - build_automerging_index_redis] hash_table_{NEW_INDEX_ID} is now on Redis.")

    logger.info(f"Creating index {NEW_INDEX_ID} ...")
    nodes = Settings.node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    redis_vector_store = RedisVectorStore(
        redis_client=REDIS_CLIENT,
        overwrite=True,
        schema=IndexSchema.from_dict({
            "index": {"name": f"{NEW_INDEX_ID}", "prefix": f"{NEW_INDEX_ID}/vector"},
            "fields": [
                {"name": "id", "type": "tag", "attrs": {"sortable": False}},
                {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
                {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
                {"name": "vector", "type": "vector", "attrs": {
                    "dims": EMBEDDING_DIMS[embed_model.model_name],
                    "algorithm": "flat",
                    "distance_metric": "cosine"
                }}
            ]
        })
    )

    storage_context = StorageContext.from_defaults(
        vector_store=redis_vector_store,
        docstore=REDIS_DOCSTORE,
        index_store=REDIS_INDEX_STORE
    )
    storage_context.docstore.add_documents(nodes)

    automerging_index = VectorStoreIndex(
        leaf_nodes,
        storage_context=storage_context
    )
    automerging_index.set_index_id(NEW_INDEX_ID)
    put_ssm_parameter(os.getenv("CHB_LLAMAINDEX_INDEX_ID"), NEW_INDEX_ID)
    logger.info("Created vector index successfully and stored on Redis.")

    delete_old_index()

    return automerging_index


def load_automerging_index_redis(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        chunk_sizes: List[int],
        chunk_overlap: int,
    ) -> VectorStoreIndex:

    if INDEX_ID:
    
        Settings.llm = llm
        Settings.embed_model = embed_model
        Settings.node_parser = HierarchicalNodeParser.from_defaults(
            chunk_sizes=chunk_sizes, 
            chunk_overlap=chunk_overlap
        )

        redis_vector_store = RedisVectorStore(
            redis_client=REDIS_CLIENT,
            overwrite=False,
            schema=REDIS_SCHEMA
        )

        logger.info("Loading vector index from Redis...")
        storage_context = StorageContext.from_defaults(
            vector_store=redis_vector_store,
            docstore=REDIS_DOCSTORE,
            index_store=REDIS_INDEX_STORE
        )

        automerging_index = load_index_from_storage(
            storage_context=storage_context,
            index_id=INDEX_ID
        )

        return automerging_index
    else:
        logger.error("No index_id provided.")


def delete_old_index():

    if INDEX_ID: # is in ssm there is nothing, INDEX_ID = None
        for key in REDIS_CLIENT.scan_iter():
            if f"{INDEX_ID}/vector" in str(key) or f"hash_table_{INDEX_ID}" == str(key):
                REDIS_CLIENT.delete(key)

        logger.info(f"Deleted index with ID: {INDEX_ID} and its hash table from Redis.")
