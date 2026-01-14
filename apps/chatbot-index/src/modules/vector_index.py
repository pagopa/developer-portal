from datetime import datetime
from typing import List, Dict

from llama_index.core import Settings as LlamaIndexSettings
from llama_index.core import (
    Document,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.storage.docstore.redis import RedisDocumentStore
from llama_index.storage.index_store.redis import RedisIndexStore
from llama_index.storage.kvstore.redis import RedisKVStore
from llama_index.vector_stores.redis import RedisVectorStore

from redis import Redis
import redis.asyncio as aredis
from redisvl.schema import IndexSchema
from tqdm import tqdm

from src.modules.logger import get_logger
from src.modules.documents import (
    get_documents,
    get_static_metadata,
    get_dynamic_metadata,
    get_api_docs,
    get_static_docs,
    get_dynamic_docs,
)
from src.modules.models import get_llm, get_embed_model
from src.modules.settings import SETTINGS


LOGGER = get_logger(__name__)
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
                    "dims": SETTINGS.embed_dim,
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
LlamaIndexSettings.llm = get_llm()
LlamaIndexSettings.embed_model = get_embed_model()
LlamaIndexSettings.chunk_size = SETTINGS.chunk_size
LlamaIndexSettings.chunk_overlap = SETTINGS.chunk_overlap
LlamaIndexSettings.node_parser = SentenceSplitter(
    chunk_size=SETTINGS.chunk_size,
    chunk_overlap=SETTINGS.chunk_overlap,
)


def build_index_redis(clean_redis: bool = False) -> VectorStoreIndex:
    """
    Builds a new vector index and stores it in Redis.
    Returns:
        VectorStoreIndex: The newly created vector store index.
    """

    if clean_redis:
        for key in tqdm(REDIS_CLIENT.scan_iter(), total=REDIS_CLIENT.dbsize()):
            REDIS_CLIENT.delete(key)
        LOGGER.info("Redis is now empty.")

    documents = get_documents()

    nodes = LlamaIndexSettings.node_parser.get_nodes_from_documents(documents)

    redis_vector_store = RedisVectorStore(
        redis_client=REDIS_CLIENT,
        overwrite=True,
        schema=REDIS_SCHEMA,
    )

    storage_context = StorageContext.from_defaults(
        vector_store=redis_vector_store,
        docstore=REDIS_DOCSTORE,
        index_store=REDIS_INDEX_STORE,
    )
    storage_context.docstore.add_documents(nodes)

    LOGGER.info(f"Creating vector index: {SETTINGS.index_id} ...")
    index = VectorStoreIndex(nodes, storage_context=storage_context)
    index.set_index_id(SETTINGS.index_id)
    LOGGER.info(
        f"{SETTINGS.index_id} has been created successfully and stored in Redis."
    )

    return index


def load_index_redis() -> VectorStoreIndex:
    """
    Loads an existing vector index from Redis using the provided llm and embed_model.
    Returns:
        VectorStoreIndex: The loaded vector store index.
    """

    try:
        redis_vector_store = RedisVectorStore(
            redis_client=REDIS_CLIENT,
            overwrite=False,
            schema=REDIS_SCHEMA,
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
        LOGGER.info(f"Loaded index {SETTINGS.index_id} from Redis successfully.")
        return index

    except Exception as e:
        raise ValueError(f"Error loading index from Redis: {e}")


class DiscoveryVectorIndex:
    def __init__(self):
        self.index_id = SETTINGS.index_id

    def get_index(self) -> VectorStoreIndex:
        """Retrieves the vector index from Redis. If not found, raises an error."""
        index = load_index_redis()
        if index is None:
            LOGGER.warning(
                f"Index {SETTINGS.index_id} not found in Redis. You should create one."
            )
        return index

    def create_index(self) -> VectorStoreIndex:
        """Creates a new vector index and stores it in Redis."""
        index = build_index_redis()
        return index

    def _update_docs(
        self, index: VectorStoreIndex, documents: List[Document] = []
    ) -> None:
        """
        Adds and updates documents in the index and refreshes the reference documents.

        Args:
            index (VectorStoreIndex): The vector store index instance.
            documents (list[Document]): List of Document objects to add or update.
        """

        with index._callback_manager.as_trace("refresh_ref_docs"):
            refreshed_documents = [False] * len(documents)

            for i, doc in enumerate(documents):

                nodes = LlamaIndexSettings.node_parser.get_nodes_from_documents([doc])
                existing_doc_hash = index.storage_context.docstore.get_document_hash(
                    doc.id_
                )

                if existing_doc_hash is None:
                    refreshed_documents[i] = True
                    with index._callback_manager.as_trace("insert_nodes"):
                        index._insert(nodes)
                        index.storage_context.index_store.add_index_struct(
                            index._index_struct
                        )
                        index.storage_context.docstore.set_document_hash(
                            doc.id_, doc.hash
                        )
                        index.storage_context.docstore.add_documents(
                            nodes,
                            allow_update=True,
                        )
                    LOGGER.info(f"Added to vector index document ID: {doc.id_}")

                elif existing_doc_hash != doc.hash:
                    refreshed_documents[i] = True
                    with index._callback_manager.as_trace("update_ref_doc"):
                        self._delete_docs(index, [doc.id_], update=True)
                        with index._callback_manager.as_trace("insert_nodes"):
                            index._insert(nodes)
                            index.storage_context.index_store.add_index_struct(
                                index._index_struct
                            )
                            index.storage_context.docstore.set_document_hash(
                                doc.id_, doc.hash
                            )
                            index.storage_context.docstore.add_documents(
                                nodes,
                                allow_update=True,
                            )
                        LOGGER.info(f"Updated vector index with document ID: {doc.id_}")

                elif existing_doc_hash == doc.hash:
                    LOGGER.info(
                        f"Document ID: {doc.id_} with hash {doc.hash} already exists in vector index. Skipping."
                    )

            LOGGER.info(
                f"Updated vector index successfully with {sum(refreshed_documents)} documents."
            )

    def _delete_docs(
        self,
        index: VectorStoreIndex,
        documents_id: List[str] = [],
        update: bool = False,
    ) -> None:
        """
        Deletes documents from the index and from the document store.

        Args:
            index (VectorStoreIndex): The vector store index instance.
            documents (List[str]): List of Document IDs to delete.
            update (bool): Flag indicating if this deletion is part of an update operation.
        """

        for doc_id in documents_id:
            index.delete_ref_doc(doc_id, delete_from_docstore=True)

            ref_doc_info = index.storage_context.docstore.get_ref_doc_info(doc_id)
            if ref_doc_info:
                for node_id in ref_doc_info.node_ids:
                    index.storage_context.docstore.delete_document(node_id)

            if not update:
                LOGGER.info(f"Deleted from vector index document ID: {doc_id}")

        if not update:
            LOGGER.info(f"Removed {len(documents_id)} from vector index successfully.")

    def refresh_index_api_docs(self, index: VectorStoreIndex) -> None:
        """
        Refreshes the vector index by updating API documentation and removing obsolete documents.
        """

        api_docs = get_api_docs()
        api_doc_ids = [doc.id_ for doc in api_docs]
        ref_doc_info = index.storage_context.docstore.get_all_ref_doc_info()
        ref_doc_ids = list(ref_doc_info.keys())

        ref_api_doc_ids = [
            doc_id
            for doc_id in ref_doc_ids
            if "/api/" in doc_id and ".md" not in doc_id
        ]

        api_docs_to_remove = []

        LOGGER.info("Refreshing vector index with API docs...")
        for doc_id in ref_api_doc_ids:
            if doc_id not in api_doc_ids:
                api_docs_to_remove.append(doc_id)

        if api_docs:
            try:
                self._update_docs(index, api_docs)
            except Exception as e:
                LOGGER.error(f"Error updating API Documents: {e}")
        if api_docs_to_remove:
            try:
                self._delete_docs(index, api_docs_to_remove)
            except Exception as e:
                LOGGER.error(f"Error deleting API Documents: {e}")

    def refresh_index_static_docs(
        self,
        index: VectorStoreIndex,
        static_docs_to_update: List[Dict[str, str]],
        static_docs_ids_to_delete: List[str],
    ) -> None:
        """
        Refreshes the vector index by updating and deleting documents as specified.

        Args:
            index (VectorStoreIndex): The vector store index instance.
            static_docs_to_update (list[dict]): List of dictionaries containing document metadata to update.
            static_docs_ids_to_delete (list[str]): List of document IDs to delete from the index.
        Returns:
            None
        """

        static_metadata = get_static_metadata()
        static_docs_to_update_filtered = []
        for doc in static_docs_to_update:
            if doc in static_metadata:
                static_docs_to_update_filtered.append(doc)

        docs_to_update = get_static_docs(static_docs_to_update_filtered)

        LOGGER.info("Refreshing vector index with static docs...")
        if docs_to_update:
            try:
                self._update_docs(index, docs_to_update)
            except Exception as e:
                LOGGER.error(f"Error updating Static Documents: {e}")
        if static_docs_ids_to_delete:
            try:
                self._delete_docs(index, static_docs_ids_to_delete)
            except Exception as e:
                LOGGER.error(f"Error deleting Static Documents: {e}")

    def refresh_index_dynamic_docs(
        self, index: VectorStoreIndex, static_metadata: List[dict]
    ) -> None:
        """
        Refreshes the vector index by updating dynamic documents and removing obsolete ones.
        Args:
            static_metadata (list[dict]): List of dictionaries containing static document metadata.
        Returns:
            None
        """

        dynamic_metadata = get_dynamic_metadata(static_metadata)
        ref_doc_info = index.storage_context.docstore.get_all_ref_doc_info()
        ref_doc_ids = list(ref_doc_info.keys())
        dynamic_ref_doc_ids = [
            doc_id
            for doc_id in ref_doc_ids
            if "/api/" not in doc_id and ".md" not in doc_id
        ]
        dynamic_doc_ids = [
            item["url"].replace(SETTINGS.website_url, "") for item in dynamic_metadata
        ]

        dynamic_docs_to_update = []
        dynamic_doc_ids_to_remove = []

        LOGGER.info("Refreshing vector index with dynamic docs...")
        for item in dynamic_metadata:
            doc_id = item["url"].replace(SETTINGS.website_url, "")
            lastmod = item["lastmod"]

            if doc_id in ref_doc_ids:
                last_mod_ref_doc_info = ref_doc_info[doc_id].metadata["lastmod"]

                dt1 = datetime.fromisoformat(
                    last_mod_ref_doc_info.replace("Z", "+00:00")
                )
                dt2 = datetime.fromisoformat(lastmod.replace("Z", "+00:00"))
                if dt2 > dt1:
                    dynamic_docs_to_update.append(item)
            else:
                dynamic_docs_to_update.append(item)

        for doc_id in dynamic_ref_doc_ids:
            if doc_id not in dynamic_doc_ids:
                dynamic_doc_ids_to_remove.append(doc_id)

        if dynamic_docs_to_update:
            try:
                dynamic_docs_to_update = get_dynamic_docs(dynamic_docs_to_update)
                self._update_docs(index, dynamic_docs_to_update)
            except Exception as e:
                LOGGER.error(f"Error updating Dynamic Documents: {e}")
        if dynamic_doc_ids_to_remove:
            try:
                self._delete_docs(index, dynamic_doc_ids_to_remove)
            except Exception as e:
                LOGGER.error(f"Error deleting Dynamic Documents: {e}")

    def remove_docs_in_folder(self, index: VectorStoreIndex, folder_name: str) -> None:
        """
        Removes all documents in the specified folder from the vector index.
        Args:
            folder_name (str): The folder path whose documents need to be removed.
        """

        ref_doc_info = index.storage_context.docstore.get_all_ref_doc_info()
        ref_doc_ids = list(ref_doc_info.keys())
        doc_ids_to_remove = []

        for doc_id in ref_doc_ids:
            if folder_name in doc_id:
                doc_ids_to_remove.append(doc_id)

        if doc_ids_to_remove:
            try:
                self._delete_docs(index, doc_ids_to_remove)
            except Exception as e:
                LOGGER.error(f"Error deleting documents in folder {folder_name}: {e}")
