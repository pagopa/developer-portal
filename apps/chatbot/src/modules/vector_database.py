import os
import re
import time
import json
import tqdm
import logging
import hashlib
from selenium import webdriver
from typing import List, Tuple


import s3fs
import html2text
from bs4 import BeautifulSoup

from llama_index.core import (
    Document,
    ServiceContext,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage
)
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.node_parser import HierarchicalNodeParser, get_leaf_nodes


AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = os.getenv('AWS_DEFAULT_REGION')
FS = s3fs.S3FileSystem(
    key=AWS_ACCESS_KEY_ID,
    secret=AWS_SECRET_ACCESS_KEY,
    endpoint_url=f"https://s3.{AWS_DEFAULT_REGION}.amazonaws.com" if AWS_DEFAULT_REGION else None
)

LIVE_HTML = [
    "build-devp/out/app-io/api/app-io-main.html",
    "build-devp/out/case-histories/tari-cagliari.html",
    "build-devp/out/firma-con-io/api/firma-con-io-main.html",
    "build-devp/out/index.html",
    "build-devp/out/pago-pa/api/elenco-IBAN-stazioni.html",
    "build-devp/out/pago-pa/api/flussi-di-rendicontazione.html",
    "build-devp/out/pago-pa/api/gestione-massiva-delle-posizioni-debitorie.html",
    "build-devp/out/pago-pa/api/gestione-posizioni-debitorie.html",
    "build-devp/out/pago-pa/api/gpd-fdr.html",
    "build-devp/out/pago-pa/api/gpd-recupero-receipt.html",
    "build-devp/out/pago-pa/api/inserimento-posizioni-debitorie.html",
    "build-devp/out/pago-pa/api/pagamento-fe-ec.html",
    "build-devp/out/pago-pa/api/recupero-receipt.html",
    "build-devp/out/pago-pa/api/stampa-avvisi-pagamento.html",
    "build-devp/out/privacy-policy.html",
    "build-devp/out/send/api/send-main.html",
    "build-devp/out/solutions/multe-per-violazioni-al-codice-della-strada.html",
    "build-devp/out/solutions/tassa-sui-rifiuti-tari.html",
    "build-devp/out/terms-of-service.html",
    "build-devp/out/webinars.html",
    "build-devp/out/webinars/DevTalk-pagoPA-gpd-massive.html",
    "build-devp/out/webinars/DevTalk-pagoPA-gpd.html",
    "build-devp/out/webinars/DevTalk-remote-content.html",
    "build-devp/out/webinars/PagoPA-multe.html",
    "build-devp/out/webinars/PagoPALAB-nidi.html",
    "build-devp/out/webinars/PagoPALab-tari.html",
    "build-devp/out/webinars/devTalks-pagoPA-fdr.html",
    "build-devp/out/webinars/devTalks-send-essential.html",
    "build-devp/out/webinars/nuove-api-io.html"
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
        documentation_dir: str = "./PagoPADevPortal/out/"
    ) -> Tuple[List[Document], dict]:

    if documentation_dir[-1] != "/":
        documentation_dir += "/"

    logging.info(f"Getting documentation from: {documentation_dir}")
    
    html_files = get_html_files(documentation_dir)
    documents = []
    hash_table = {}
    empty_pages = []

    for file in tqdm.tqdm(html_files, total=len(html_files), desc="Extracting HTML"):

        if file in LIVE_HTML:
            url = file.replace(documentation_dir, "http://localhost:3000/")
            driver = webdriver.Chrome()
            driver.get(url)
            time.sleep(5)
            title, text = html2markdown(driver.page_source)
            driver.quit()
        else:
            title, text = html2markdown(open(file))

        if text == None or text == "" or text == "None":
            print(file)
            empty_pages.append(file)

        else:
            url = file.replace(
                documentation_dir, 
                "https://developer.pagopa.it/"
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
        s3_bucket_name: str | None,
        chunk_sizes: List[int],
        chunk_overlap: int
    ) -> VectorStoreIndex:
    
    node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )
    
    merging_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model,
        node_parser=node_parser
    )

    assert documentation_dir is not None
    documents, hash_table = create_documentation(documentation_dir)

    logging.info("Creating index...")
    nodes = node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    storage_context = StorageContext.from_defaults()
    storage_context.docstore.add_documents(nodes)

    automerging_index = VectorStoreIndex(
        leaf_nodes,
        storage_context=storage_context,
        service_context=merging_context
    )
    logging.info(f"Created index successfully.")
    if s3_bucket_name:

        # store hash table
        with FS.open('chatbot-llamaindex-5086/hash_table.json', 'w') as f:
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


def load_automerging_index(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        save_dir: str,
        s3_bucket_name: str | None,
        chunk_sizes: List[int],
        chunk_overlap: int,
    ) -> VectorStoreIndex:
    
    node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )
    
    merging_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model,
        node_parser=node_parser
    )

    logging.info(f"{save_dir} directory exists! Loading vector index...")
    if s3_bucket_name:

        automerging_index = load_index_from_storage(
            StorageContext.from_defaults(
                persist_dir = f"{s3_bucket_name}/{save_dir}",
                fs = FS
            ),
            service_context=merging_context
        )
    
    else:
        automerging_index = load_index_from_storage(
            StorageContext.from_defaults(
                persist_dir=save_dir
            ),
            service_context=merging_context,
        )

    logging.info("Loaded vector index successfully!")

    return automerging_index
