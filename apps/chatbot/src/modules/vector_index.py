from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core import Settings as LlamaIndexSettings
from llama_index.storage.docstore.redis import RedisDocumentStore
from llama_index.storage.index_store.redis import RedisIndexStore
from llama_index.storage.kvstore.redis import RedisKVStore
from llama_index.vector_stores.redis import RedisVectorStore

from redis import Redis
import redis.asyncio as aredis
from redisvl.schema import IndexSchema

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.models import get_llm, get_embed_model


LOGGER = get_logger(__name__)
REDIS_CLIENT = Redis.from_url(SETTINGS.redis_url, socket_timeout=10)
REDIS_ASYNC_CLIENT = aredis.Redis.from_pool(
    aredis.ConnectionPool.from_url(SETTINGS.redis_url)
)
REDIS_KVSTORE = RedisKVStore(
    redis_client=REDIS_CLIENT, async_redis_client=REDIS_ASYNC_CLIENT
)
REDIS_DOCSTORE = RedisDocumentStore(redis_kvstore=REDIS_KVSTORE)
REDIS_INDEX_STORE = RedisIndexStore(redis_kvstore=REDIS_KVSTORE)

LlamaIndexSettings.llm = get_llm()
LlamaIndexSettings.embed_model = get_embed_model()
LlamaIndexSettings.chunk_size = SETTINGS.chunk_size
LlamaIndexSettings.chunk_overlap = SETTINGS.chunk_overlap


def get_redis_schema(index_id: str) -> IndexSchema:
    """Defines the schema for the Redis vector store index.
    Args:
        index_id (str | None): Optional identifier for the index. If not provided, it defaults to the value in SETTINGS.index_id.
    Returns:
        IndexSchema: The schema definition for the Redis vector store index.
    """

    return IndexSchema.from_dict(
        {
            "index": {
                "name": f"{index_id}",
                "prefix": f"{index_id}/vector",
            },
            "fields": [
                {"name": "id", "type": "tag", "attrs": {"sortable": False}},
                {"name": "doc_id", "type": "tag", "attrs": {"sortable": False}},
                {"name": "text", "type": "text", "attrs": {"weight": 1.0}},
                {
                    "name": "vector",
                    "type": "vector",
                    "attrs": {
                        "dims": SETTINGS.embed_dim,
                        "algorithm": "flat",
                        "distance_metric": "cosine",
                    },
                },
            ],
        }
    )


def load_index_redis(index_id: str) -> VectorStoreIndex:
    """
    Loads an existing vector index from Redis using the provided llm and embed_model.
    Returns:
        VectorStoreIndex: The loaded vector store index.
    """

    try:
        redis_vector_store = RedisVectorStore(
            redis_client=REDIS_CLIENT,
            overwrite=False,
            schema=get_redis_schema(index_id),
        )

        LOGGER.info("Loading vector index from Redis...")
        storage_context = StorageContext.from_defaults(
            vector_store=redis_vector_store,
            docstore=REDIS_DOCSTORE,
            index_store=REDIS_INDEX_STORE,
        )

        index = load_index_from_storage(
            storage_context=storage_context, index_id=index_id
        )
        LOGGER.info(f"Loaded index {index_id} from Redis successfully.")
        return index

    except Exception as e:
        raise ValueError(f"Error loading index from Redis: {e}")
