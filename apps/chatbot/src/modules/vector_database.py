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
from src.modules.utils import put_ssm_parameter
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)
TODAY = datetime.now(pytz.timezone("Europe/Rome")).strftime("%Y-%m-%d--%H:%M:%S")
NEW_INDEX_ID = (
    f"index--{TODAY}" if SETTINGS.index_id != "default-index" else "default-index"
)
REDIS_CLIENT = Redis.from_url(SETTINGS.redis_url, socket_timeout=10)
REDIS_ASYNC_CLIENT = aredis.Redis.from_pool(
    aredis.ConnectionPool.from_url(SETTINGS.redis_url)
)
REDIS_SCHEMA = IndexSchema.from_dict(
    {
        "index": {
            "name": f"{SETTINGS.index_id}",
            "prefix": f"{SETTINGS.index_id}/vector",
        },
        "fields": [
            {"name": "id", "type": "tag", "attrs": {"sortable": False}},
            {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
            {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
            {
                "name": "vector",
                "type": "vector",
                "attrs": {
                    "dims": SETTINGS.embedding_dim,
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


def build_index_redis(
    llm: BaseLLM,
    embed_model: BaseEmbedding,
) -> VectorStoreIndex:
    """
    Builds a new vector index and stores it in Redis.
    Args:
        llm (BaseLLM): The language model to use for the index.
        embed_model (BaseEmbedding): The embedding model to use for the index.
        chunk_size (int): chunk size for the node parser.
        chunk_overlap (int): Overlap size for the node parser.
    Returns:
        VectorStoreIndex: The newly created vector store index.
    """

    LOGGER.info("Storing vector index in Redis..")

    Settings.llm = llm
    Settings.embed_model = embed_model
    Settings.chunk_size = SETTINGS.chunk_size
    Settings.chunk_overlap = SETTINGS.chunk_overlap
    Settings.node_parser = SentenceSplitter(
        chunk_size=SETTINGS.chunk_size,
        chunk_overlap=SETTINGS.chunk_overlap,
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
                            "dims": SETTINGS.embedding_dim,
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

    if SETTINGS.index_id:

        Settings.llm = llm
        Settings.embed_model = embed_model
        Settings.chunk_size = SETTINGS.chunk_size
        Settings.chunk_overlap = SETTINGS.chunk_overlap
        Settings.node_parser = SentenceSplitter(
            chunk_size=SETTINGS.chunk_size,
            chunk_overlap=SETTINGS.chunk_overlap,
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
            storage_context=storage_context, index_id=SETTINGS.index_id
        )

        return index
    else:
        LOGGER.error("No index_id provided.")


def delete_old_index():
    """
    Deletes the old index from Redis if the INDEX_ID is not 'default-index'.
    This function is called after creating a new index to ensure that only the latest index is retained.
    """

    if SETTINGS.index_id != "default-index":
        for key in REDIS_CLIENT.scan_iter():
            if f"{SETTINGS.index_id}/vector" in str(key):
                REDIS_CLIENT.delete(key)

        LOGGER.info(f"Deleted index with ID: {SETTINGS.index_id} from Redis.")
