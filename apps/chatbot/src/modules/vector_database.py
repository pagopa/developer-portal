import os
import re
import json
import tqdm
import logging
import hashlib
from typing import List

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


def hash_url(url):
    return hashlib.sha256(url.encode()).hexdigest()


def filter_html_files(html_files: List[str]):
    pattern = re.compile(r"/v\d{1,2}.")
    pattern2 = re.compile(r"/\d{1,2}.")
    filtered_files = [file for file in html_files if not pattern.search(file) and not pattern2.search(file)]
    return filtered_files


def get_html_files(root_folder: str):
    html_files = []
    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))
    return sorted(filter_html_files(html_files))


def create_documentation(documentation_dir: str = "./PagoPADevPortal/out/"):

    if documentation_dir[-1] != "/":
        documentation_dir += "/"

    logging.info(f"Getting documentation from: {documentation_dir}")
    
    html_files = get_html_files(documentation_dir)
    documents = []
    hash_table = {}

    for file in tqdm.tqdm(html_files, total=len(html_files), desc="Extracting HTML"):

        soup = BeautifulSoup(open(file), "html.parser")
        soup_text = soup.find(attrs={"id": "page-content"})
        if soup_text:
            text = soup_text.get_text("/")
        else:
            text = ""
        
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
    
    return documents, hash_table


def build_automerging_index(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        documentation_dir: str,
        save_dir: str,
        s3_bucket_name: str | None,
        region: str | None,
        chunk_sizes: List[int],
        chunk_overlap: int
    ):
    
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
        assert region is not None
        fs = s3fs.S3FileSystem(
            endpoint_url=f"https://s3.{region}.amazonaws.com",
        )

        # store hash table
        with fs.open('chatbot-llamaindex-5086/hash_table.json', 'w') as f:
            json.dump(hash_table, f, indent=4)
        logging.info(f"Uploaded URLs hash table successfully to S3 bucket {s3_bucket_name}/hash_table.json")

        # store vector index
        automerging_index.storage_context.persist(
            persist_dir=f"{s3_bucket_name}/{save_dir}",
            fs = fs
        )
        logging.info(f"Uploaded index successfully to S3 bucket at {s3_bucket_name}/{save_dir}.")
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
    region: str | None
    ):

    if s3_bucket_name:
        assert region is not None
        fs = s3fs.S3FileSystem(
            endpoint_url=f"https://s3.{region}.amazonaws.com",
        )
        with fs.open(f"{s3_bucket_name}/hash_table.json", "r") as f:
            hash_table = json.load(f)

    else:
        with open("hash_table.json", "r") as f:
            hash_table = json.load(f)

    logging.info("Loaded URLs hash table successfully.")
    return hash_table


def load_automerging_index(
        llm: BaseLLM,
        embed_model: BaseEmbedding,
        save_dir: str,
        s3_bucket_name: str | None,
        region: str | None,
        chunk_sizes: List[int],
        chunk_overlap: int,
    ):
    
    node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )
    
    merging_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model,
        node_parser=node_parser
    )

    logging.info(f"{save_dir} exists! Loading index...")
    if s3_bucket_name:

        automerging_index = load_index_from_storage(
            StorageContext.from_defaults(
                persist_dir = f"{s3_bucket_name}/{save_dir}",
                fs = s3fs.S3FileSystem(
                    endpoint_url=f"https://s3.{region}.amazonaws.com",
                )
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
