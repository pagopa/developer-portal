import os
import pytz
from datetime import datetime

from llama_index.core import (
    Settings,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.base.llms.base import BaseLLM
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.storage.docstore.redis import RedisDocumentStore
from llama_index.storage.index_store.redis import RedisIndexStore
from llama_index.storage.kvstore.redis import RedisKVStore
from llama_index.vector_stores.redis import RedisVectorStore

from redis import Redis
import redis.asyncio as aredis
from redisvl.schema import IndexSchema

from src.modules.logger import get_logger
from src.modules.documents import get_documents
from src.modules.utils import get_ssm_parameter, put_ssm_parameter


LOGGER = get_logger(__name__)
TODAY = datetime.now(pytz.timezone("Europe/Rome")).strftime("%Y-%m-%d--%H:%M:%S")
INDEX_ID = get_ssm_parameter(
    os.getenv("CHB_AWS_SSM_LLAMAINDEX_INDEX_ID"), "default-index"
)
NEW_INDEX_ID = f"index--{TODAY}" if INDEX_ID != "default-index" else "default-index"
REDIS_URL = os.getenv("CHB_REDIS_URL")
WEBSITE_URL = os.getenv("CHB_WEBSITE_URL")
REDIS_CLIENT = Redis.from_url(REDIS_URL, socket_timeout=10)
REDIS_ASYNC_CLIENT = aredis.Redis.from_pool(aredis.ConnectionPool.from_url(REDIS_URL))
EMBED_MODEL_ID = os.getenv("CHB_EMBED_MODEL_ID")
EMBEDDING_DIMS = {
    "text-embedding-004": 768,
    "cohere.embed-multilingual-v3": 1024,
    "amazon.titan-embed-text-v2:0": 1024,
}
REDIS_SCHEMA = IndexSchema.from_dict(
    {
        "index": {"name": f"{INDEX_ID}", "prefix": f"{INDEX_ID}/vector"},
        "fields": [
            {"name": "id", "type": "tag", "attrs": {"sortable": False}},
            {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
            {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
            {
                "name": "vector",
                "type": "vector",
                "attrs": {
                    "dims": EMBEDDING_DIMS[EMBED_MODEL_ID],
                    "algorithm": "flat",
                    "distance_metric": "cosine",
                },
            },
        ],
    }
)
REDIS_KVSTORE = RedisKVStore(
    redis_client=REDIS_CLIENT, async_redis_client=REDIS_ASYNC_CLIENT
)
REDIS_DOCSTORE = RedisDocumentStore(redis_kvstore=REDIS_KVSTORE)
REDIS_INDEX_STORE = RedisIndexStore(redis_kvstore=REDIS_KVSTORE)
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


def build_index_redis(
    llm: BaseLLM,
    embed_model: BaseEmbedding,
    documentation_dir: str,
    chunk_size: int,
    chunk_overlap: int,
) -> VectorStoreIndex:
    """
    Builds a new vector index and stores it on Redis using the provided llm and embed_model.
    Args:
        llm (BaseLLM): The language model to use for the index.
        embed_model (BaseEmbedding): The embedding model to use for the index.
        documentation_dir (str): Directory containing the documentation files.
        chunk_size (int): chunk size for the node parser.
        chunk_overlap (int): Overlap size for the node parser.
    Returns:
        VectorStoreIndex: The newly created vector store index.
    """

    LOGGER.info("Storing vector index and hash table on Redis..")

    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.chunk_size = chunk_size
    Settings.chunk_overlap = chunk_overlap
    Settings.node_parser = SentenceSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    documents = get_documents()
    LOGGER.info(f"Creating index {NEW_INDEX_ID} ...")
    nodes = Settings.node_parser.get_nodes_from_documents(documents)

    redis_vector_store = RedisVectorStore(
        redis_client=REDIS_CLIENT,
        overwrite=True,
        schema=IndexSchema.from_dict(
            {
                "index": {
                    "name": f"{NEW_INDEX_ID}",
                    "prefix": f"{NEW_INDEX_ID}/vector",
                },
                "fields": [
                    {"name": "id", "type": "tag", "attrs": {"sortable": False}},
                    {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
                    {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
                    {
                        "name": "vector",
                        "type": "vector",
                        "attrs": {
                            "dims": EMBEDDING_DIMS[embed_model.model_name],
                            "algorithm": "flat",
                            "distance_metric": "cosine",
                        },
                    },
                ],
            }
        ),
    )

    storage_context = StorageContext.from_defaults(
        vector_store=redis_vector_store,
        docstore=REDIS_DOCSTORE,
        index_store=REDIS_INDEX_STORE,
    )
    storage_context.docstore.add_documents(nodes)

    index = VectorStoreIndex(nodes, storage_context=storage_context)
    index.set_index_id(NEW_INDEX_ID)
    if NEW_INDEX_ID != "default-index":
        put_ssm_parameter(os.getenv("CHB_AWS_SSM_LLAMAINDEX_INDEX_ID"), NEW_INDEX_ID)
    LOGGER.info("Created vector index successfully and stored on Redis.")

    delete_old_index()

    return index


def load_index_redis(
    llm: BaseLLM,
    embed_model: BaseEmbedding,
    chunk_size: int,
    chunk_overlap: int,
) -> VectorStoreIndex:
    """
    Loads an existing vector index from Redis using the provided llm and embed_model.
    Args:
        llm (BaseLLM): The language model to use for the index.
        embed_model (BaseEmbedding): The embedding model to use for the index.
        chunk_size (int): chunk size for the node parser.
        chunk_overlap (int): Overlap size for the node parser.
    Returns:
        VectorStoreIndex: The loaded vector store index.
    """

    if INDEX_ID:

        Settings.llm = llm
        Settings.embed_model = embed_model
        Settings.chunk_size = chunk_size
        Settings.chunk_overlap = chunk_overlap
        Settings.node_parser = SentenceSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )

        redis_vector_store = RedisVectorStore(
            redis_client=REDIS_CLIENT, overwrite=False, schema=REDIS_SCHEMA
        )

        LOGGER.info("Loading vector index from Redis...")
        storage_context = StorageContext.from_defaults(
            vector_store=redis_vector_store,
            docstore=REDIS_DOCSTORE,
            index_store=REDIS_INDEX_STORE,
        )

        index = load_index_from_storage(
            storage_context=storage_context, index_id=INDEX_ID
        )

        return index
    else:
        LOGGER.error("No index_id provided.")


def delete_old_index():
    """
    Deletes the old index and its hash table from Redis if the INDEX_ID is not 'default-index'.
    This function is called after creating a new index to ensure that only the latest index is retained.
    """

    if INDEX_ID != "default-index":
        for key in REDIS_CLIENT.scan_iter():
            if f"{INDEX_ID}/vector" in str(key) or f"hash_table_{INDEX_ID}" == str(key):
                REDIS_CLIENT.delete(key)

        LOGGER.info(f"Deleted index with ID: {INDEX_ID} and its hash table from Redis.")
