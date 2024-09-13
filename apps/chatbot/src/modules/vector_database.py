import os
import re
import time
import json
import tqdm
import logging
import hashlib
import html2text
from bs4 import BeautifulSoup
from selenium import webdriver
from typing import List, Tuple

from bs4 import BeautifulSoup
from selenium import webdriver
import html2text
import s3fs

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
from redis import Redis
from llama_index.storage.docstore.redis import RedisDocumentStore
from llama_index.storage.index_store.redis import RedisIndexStore
from llama_index.storage.kvstore.redis import RedisKVStore
from llama_index.vector_stores.redis import RedisVectorStore
from redisvl.schema import IndexSchema

from dotenv import load_dotenv

load_dotenv()


AWS_ACCESS_KEY_ID = os.getenv('CHB_AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('CHB_AWS_SECRET_ACCESS_KEY')
CHB_AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION', os.getenv('AWS_DEFAULT_REGION'))
CHB_REDIS_URL = os.getenv('CHB_REDIS_URL')
WEBSITE_URL = os.getenv('WEBSITE_URL')
REDIS_CLIENT = Redis.from_url(CHB_REDIS_URL, socket_timeout=10)

REDIS_SCHEMA = IndexSchema.from_dict({
    "index": {"name": "index", "prefix": "index/vector"},
    "fields": [
        {"name": "id", "type": "tag", "attrs": {"sortable": False}},
        {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
        {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
        {"name": "vector", "type": "vector", "attrs": {"dims": 1024, "algorithm": "flat", "distance_metric": "cosine"}}
    ]
})
REDIS_KVSTORE = RedisKVStore(redis_client=REDIS_CLIENT)
REDIS_DOCSTORE = RedisDocumentStore(redis_kvstore=REDIS_KVSTORE)
REDIS_INDEX_STORE = RedisIndexStore(redis_kvstore=REDIS_KVSTORE)

if not CHB_REDIS_URL:
    FS = s3fs.S3FileSystem(
        key=AWS_ACCESS_KEY_ID,
        secret=AWS_SECRET_ACCESS_KEY,
        endpoint_url=f"https://s3.{CHB_AWS_DEFAULT_REGION}.amazonaws.com" if CHB_AWS_DEFAULT_REGION else None
    )

DYNAMIC_HTMLS = [
    "app-io/api/app-io-main.html",
    "case-histories/tari-cagliari.html",
    "firma-con-io/api/firma-con-io-main.html",
    "index.html",
    "pago-pa/api/elenco-IBAN-stazioni.html",
    "pago-pa/api/flussi-di-rendicontazione.html",
    "pago-pa/api/gestione-massiva-delle-posizioni-debitorie.html",
    "pago-pa/api/gestione-posizioni-debitorie.html",
    "pago-pa/api/gpd-fdr.html",
    "pago-pa/api/gpd-recupero-receipt.html",
    "pago-pa/api/inserimento-posizioni-debitorie.html",
    "pago-pa/api/pagamento-fe-ec.html",
    "pago-pa/api/recupero-receipt.html",
    "pago-pa/api/stampa-avvisi-pagamento.html",
    "privacy-policy.html",
    "send/api/send-main.html",
    "solutions/multe-per-violazioni-al-codice-della-strada.html",
    "solutions/tassa-sui-rifiuti-tari.html",
    "terms-of-service.html",
    "webinars.html",
    "webinars/DevTalk-pagoPA-gpd-massive.html",
    "webinars/DevTalk-pagoPA-gpd.html",
    "webinars/DevTalk-remote-content.html",
    "webinars/PagoPA-multe.html",
    "webinars/PagoPALAB-nidi.html",
    "webinars/PagoPALab-tari.html",
    "webinars/devTalks-pagoPA-fdr.html",
    "webinars/devTalks-send-essential.html",
    "webinars/nuove-api-io.html"
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

    logging.info(f"Getting documentation from: {documentation_dir}")
    
    html_files = get_html_files(documentation_dir)
    dynamic_htmls = [os.path.join(documentation_dir, path) for path in DYNAMIC_HTMLS]
    documents = []
    hash_table = {}
    empty_pages = []

    # full_text = ""

    for file in tqdm.tqdm(html_files, total=len(html_files), desc="Extracting HTML"):

        if file in dynamic_htmls:
            url = file.replace(documentation_dir, f"{website_url}/")
            driver = webdriver.Chrome()
            driver.get(url)
            time.sleep(5)
            title, text = html2markdown(driver.page_source)
            driver.quit()
        else:
            title, text = html2markdown(open(file))

        if text == None or text == "" or text == "None":
            # print(file)
            empty_pages.append(file)

        else:

            text = re.sub(r'(?<=[\wÀ-ÿ])\n(?=[\wÀ-ÿ])', ' ', text)

            url = file.replace(
                documentation_dir, 
                f"{website_url}/"
            ).replace(
                ".html", 
                ""
            )
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

            # full_text += text
            # full_text += "\n\n---------------------------\n\n"

    # with open("full_text.txt", "w") as f:
    #     f.write(full_text)

    logging.info(f"Number of documents with content: {len(documents)}")
    logging.info(f"Number of empty pages in the documentation: {len(empty_pages)}. These are left out.")
    with open('empty_htmls.json', 'w') as f:
        json.dump(empty_pages, f, indent=4)
    
    return documents, hash_table


def build_automerging_index(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        documentation_dir: str,
        save_dir: str,
        chunk_sizes: List[int],
        chunk_overlap: int
    ) -> VectorStoreIndex:

    logging.info("Storing vector index and hash table on AWS bucket S3..")
    
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )

    assert documentation_dir is not None
    print(documentation_dir)
    documents, hash_table = create_documentation(WEBSITE_URL, documentation_dir)

    logging.info("Creating index...")
    nodes = Settings.node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    storage_context = StorageContext.from_defaults()
    storage_context.docstore.add_documents(nodes)

    automerging_index = VectorStoreIndex(
        leaf_nodes,
        storage_context=storage_context
    )
    logging.info(f"Created index successfully.")

    automerging_index.storage_context.persist(
        persist_dir=save_dir
    )
    with open("hash_table.json", "w") as f:
        json.dump(hash_table, f, indent=4)

    logging.info(f"Saved index successfully to {save_dir}.")

    return automerging_index


def build_automerging_index_s3(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        documentation_dir: str,
        save_dir: str,
        s3_bucket_name: str | None,
        chunk_sizes: List[int],
        chunk_overlap: int
    ) -> VectorStoreIndex:

    logging.info("Storing vector index and hash table on AWS bucket S3..")
    
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )

    assert documentation_dir is not None
    documents, hash_table = create_documentation(WEBSITE_URL, documentation_dir)

    logging.info("Creating index...")
    nodes = Settings.node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    storage_context = StorageContext.from_defaults()
    storage_context.docstore.add_documents(nodes)

    automerging_index = VectorStoreIndex(
        leaf_nodes,
        storage_context=storage_context
    )
    logging.info(f"Created index successfully.")
    if s3_bucket_name:
        # store hash table
        with FS.open(f'{s3_bucket_name}/hash_table.json', 'w') as f:
            json.dump(hash_table, f, indent=4)
        logging.info(f"Uploaded URLs hash table successfully to S3 bucket {s3_bucket_name}/hash_table.json")

        # store vector index
        automerging_index.storage_context.persist(
            persist_dir=f"{s3_bucket_name}/{save_dir}",
            fs = FS
        )
        logging.info(f"Uploaded vector index successfully to S3 bucket at {s3_bucket_name}/{save_dir}.")
    else:
        automerging_index.storage_context.persist(
            persist_dir=save_dir
        )
        with open("hash_table.json", "w") as f:
            json.dump(hash_table, f, indent=4)

        logging.info(f"Saved index successfully to {save_dir}.")

    return automerging_index


def build_automerging_index_redis(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        documentation_dir: str,
        chunk_sizes: List[int],
        chunk_overlap: int
    ) -> VectorStoreIndex:

    logging.info("Storing vector index and hash table on Redis..")

    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )
    
    documents, hash_table = create_documentation(WEBSITE_URL, documentation_dir)
    for key, value in hash_table.items():
        REDIS_KVSTORE.put(
            collection="hash_table",
            key=key,
            val=value
        )
    logging.info("Hash table is now on Redis.")

    logging.info("Creating index...")
    nodes = Settings.node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    redis_vector_store = RedisVectorStore(
        redis_client=REDIS_CLIENT,
        overwrite=True,
        schema=REDIS_SCHEMA
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
    logging.info("Created vector index successfully and stored on Redis.")

    return automerging_index


def load_url_hash_table(
    s3_bucket_name: str | None,
    ) -> dict:

    if s3_bucket_name:
        logging.info("Getting URLs hash table from S3 bucket...")
        with FS.open(f"{s3_bucket_name}/hash_table.json", "r") as f:
            hash_table = json.load(f)

    else:
        logging.info("Getting URLs hash table from local...")
        with open("hash_table.json", "r") as f:
            hash_table = json.load(f)

    logging.info("Loaded URLs hash table successfully.")
    return hash_table


def load_automerging_index_s3(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        save_dir: str,
        s3_bucket_name: str,
        chunk_sizes: List[int],
        chunk_overlap: int,
    ) -> VectorStoreIndex:
    
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )

    logging.info(f"{save_dir} directory exists! Loading vector index...")
    automerging_index = load_index_from_storage(
        StorageContext.from_defaults(
            persist_dir = f"{s3_bucket_name}/{save_dir}",
            fs = FS
        )
    )

    logging.info("Loaded vector index successfully!")

    return automerging_index


def load_automerging_index(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        save_dir: str,
        chunk_sizes: List[int],
        chunk_overlap: int,
    ) -> VectorStoreIndex:
    
    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )

    logging.info(f"{save_dir} directory exists! Loading vector index...")
    
    automerging_index = load_index_from_storage(
        StorageContext.from_defaults(
            persist_dir=save_dir
        )
    )

    logging.info("Loaded vector index successfully!")

    return automerging_index


def load_automerging_index_redis(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        chunk_sizes: List[int],
        chunk_overlap: int,
    ) -> VectorStoreIndex:
    
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

    logging.info(f"Loading vector index from Redis...")
    storage_context = StorageContext.from_defaults(
        vector_store=redis_vector_store,
        docstore=REDIS_DOCSTORE,
        index_store=REDIS_INDEX_STORE
    )

    automerging_index = load_index_from_storage(
        storage_context=storage_context,
    )

    return automerging_index
