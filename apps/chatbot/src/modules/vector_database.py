import os
import re
import json
import tqdm
import logging
import hashlib
from typing import List, Tuple, Dict

import s3fs
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


def check_html(current_table: dict, s3_bucket_name: str) -> None:
    logging.info("From last documentation update were:")
    prev_hash_table = load_url_hash_table(s3_bucket_name)

    kept_url = 0
    added_urls = 0
    removed_urls = 0
    for hash, url in current_table.items():
        if hash not in prev_hash_table.keys():
            added_urls += 1
            logging.info(f"Added ==> {url}")
        else:
            kept_url += 1

    for hash, url in prev_hash_table.items():
        if hash not in current_table.keys():
            removed_urls += 1
            logging.info(f"Removed ==> {url}")

    logging.info("Resume:")
    logging.info(f"{kept_url} URLs were kept.")
    logging.info(f"{added_urls} URLs were added.")
    logging.info(f"{removed_urls} URLs were removed.")
    

def create_documentation(
        documentation_dir: str = "./PagoPADevPortal/out/"
    ) -> Tuple[List[Document], dict]:

    if documentation_dir[-1] != "/":
        documentation_dir += "/"

    logging.info(f"Getting documentation from: {documentation_dir}")
    
    html_files = get_html_files(documentation_dir)
    documents = []
    hash_table = {}
    empty_htmls = []
    for file in tqdm.tqdm(html_files, total=len(html_files), desc="Extracting HTML"):

        soup = BeautifulSoup(open(file), "html.parser")
        soup_text = soup.find(attrs={"id": "page-content"})
        if soup_text:
            text = soup_text.get_text(separator="\n")
        else:
            text = ""
            empty_htmls.append(file)
        
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

        if soup.title and soup.title.string:
            title = str(soup.title.string)
        else:
            title = f"PagoPA DevPortal | {os.path.basename(url)}"

        documents.append(Document(
            text=text,
            metadata={
                "filename": masked_url,
                "title": title,
                "language": "it"
            }
        ))

    assert len(hash_table) == len(documents)
    logging.info(f"Number of empty htmls: {len(empty_htmls)}")
    print(empty_htmls)
    
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

    if not os.path.exists(save_dir):
        logging.info("Creating index...")
    else:
        logging.info("Updating index...")

    assert documentation_dir is not None

    documents, hash_table = create_documentation(documentation_dir)
    check_html(hash_table, s3_bucket_name)
    
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
