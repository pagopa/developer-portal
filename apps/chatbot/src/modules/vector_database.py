import os
import re
import json
import tqdm
import logging
import hashlib
from typing import List, Tuple, Dict
from redis import Redis

import s3fs
from bs4 import BeautifulSoup

from llama_index.core import (
    Document,
    ServiceContext,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
    Settings
)
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.node_parser import HierarchicalNodeParser, get_leaf_nodes
from llama_index.vector_stores.opensearch import (
    OpensearchVectorStore,
    OpensearchVectorClient,
)

from llama_index.storage.docstore.redis import RedisDocumentStore
from llama_index.storage.kvstore.redis import RedisKVStore
from llama_index.storage.index_store.redis import RedisIndexStore
from llama_index.vector_stores.redis import RedisVectorStore
from redisvl.schema import IndexSchema

# http endpoint for your cluster (opensearch required for vector index usage)
endpoint = os.getenv("OPENSEARCH_ENDPOINT", "http://localhost:9200")
# index to demonstrate the VectorStore impl
idx = os.getenv("OPENSEARCH_INDEX", "newindexm")
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = os.getenv('AWS_DEFAULT_REGION')
FS = s3fs.S3FileSystem(
    key=AWS_ACCESS_KEY_ID,
    secret=AWS_SECRET_ACCESS_KEY,
    endpoint_url=f"https://s3.{AWS_DEFAULT_REGION}.amazonaws.com" if AWS_DEFAULT_REGION else None
)



schema = IndexSchema.from_dict({
            "index": {"name": "new_index", "prefix": "new_index/vector"},
            "fields": [
                {"name": "id", "type": "tag", "attrs": {"sortable": False}},
                {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
                {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
                {"name": "vector", "type": "vector", "attrs": {"dims": 1024, "algorithm": "flat", "distance_metric": "cosine"}}
            ]
        })


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


def create_documentation(
        documentation_dir: str = "./PagoPADevPortal/out/"
    ) -> Tuple[List[Document], dict]:

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
        redis_url: str,
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

    documents, hash_table = create_documentation(documentation_dir)
    
    nodes = node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    # create a Redis client connection
    redis_client = Redis.from_url(redis_url)

    # create the vector store wrapper
    vector_store = RedisVectorStore(redis_client=redis_client, overwrite=True, schema=schema)
    kvstore = RedisKVStore(redis_client=redis_client)
    docstore = RedisDocumentStore(redis_kvstore=kvstore)
    index_store = RedisIndexStore(redis_kvstore=kvstore)

    storage_context = StorageContext.from_defaults(vector_store=vector_store, docstore=docstore, index_store=index_store)
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
        logging.info(f"Uploaded hash table successfully to S3 bucket at {s3_bucket_name}/{save_dir}.")
    else:
        with open("hash_table.json", "w") as f:
            json.dump(hash_table, f, indent=4)

        logging.info(f"Saved hash table successfully to {save_dir}.")

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
        redis_url: str,
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

    redis_client = Redis.from_url(redis_url)

    vector_store = RedisVectorStore(redis_client=redis_client, overwrite=False, schema=schema)
    kvstore = RedisKVStore(redis_client=redis_client)
    docstore = RedisDocumentStore(redis_kvstore=kvstore)
    index_store = RedisIndexStore(redis_kvstore=kvstore)
    
    storage_context = StorageContext.from_defaults(vector_store=vector_store, docstore=docstore, index_store=index_store)

    automerging_index = load_index_from_storage(
        storage_context,
        service_context=merging_context
    )

    logging.info("Loaded vector index successfully!")

    return automerging_index
