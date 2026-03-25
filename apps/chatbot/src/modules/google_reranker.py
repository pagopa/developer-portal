from enum import Enum
from typing import Any, List, Optional

from llama_index.core.bridge.pydantic import Field, PrivateAttr
from llama_index.core.callbacks import CBEventType, EventPayload
from llama_index.core.instrumentation import get_dispatcher
from llama_index.core.instrumentation.events.rerank import (
    ReRankEndEvent,
    ReRankStartEvent,
)
from llama_index.core.postprocessor.types import BaseNodePostprocessor
from llama_index.core.schema import MetadataMode, NodeWithScore, QueryBundle

from google.oauth2 import service_account
from google.cloud import discoveryengine_v1 as discoveryengine

from src.modules.settings import SETTINGS


GOOGLE_CREDENTIALS = service_account.Credentials.from_service_account_info(
    SETTINGS.google_service_account,
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)


dispatcher = get_dispatcher(__name__)


DEFAULT_MODEL = "semantic-ranker-default-004"
DEFAULT_LOCATION = "global"
DEFAULT_RANKING_CONFIG = "default_ranking_config"


class GoogleRerank(BaseNodePostprocessor):
    top_n: int = Field(default=2, description="Top N nodes to return.")
    model_id: str = Field(
        default=DEFAULT_MODEL,
        description="The ranking model to use.",
    )
    location: str = Field(
        default=DEFAULT_LOCATION,
        description="Google Cloud location for the ranking config.",
    )
    ranking_config: str = Field(
        default=DEFAULT_RANKING_CONFIG,
        description="Name of the ranking config resource.",
    )
    _client: discoveryengine.RankServiceClient = PrivateAttr()

    def __init__(
        self,
        top_n: int = 2,
        model_id: str = DEFAULT_MODEL,
        client: Optional[discoveryengine.RankServiceClient] = None,
        ranking_config: Optional[Any] = DEFAULT_RANKING_CONFIG,
        location: Optional[str] = DEFAULT_LOCATION,
        **kwargs: Any,
    ):
        super().__init__(**kwargs)
        self.top_n = top_n
        self.model_id = model_id

        if client:
            self._client = client
        else:
            self._client = discoveryengine.RankServiceClient(
                credentials=GOOGLE_CREDENTIALS
            )

        self._ranking_config = (
            f"projects/{GOOGLE_CREDENTIALS.project_id}/locations/{location}"
            f"/rankingConfigs/{ranking_config}"
        )

    @classmethod
    def class_name(cls) -> str:
        return "GoogleRerank"

    def _postprocess_nodes(
        self,
        nodes: List[NodeWithScore],
        query_bundle: Optional[QueryBundle] = None,
    ) -> List[NodeWithScore]:
        if dispatcher:
            dispatcher.event(
                ReRankStartEvent(
                    query=query_bundle,
                    nodes=nodes,
                    top_n=self.top_n,
                    model_name=self.model_id,
                )
            )

        if query_bundle is None:
            raise ValueError("Missing query bundle in extra info.")
        if len(nodes) == 0:
            return []

        with self.callback_manager.event(
            CBEventType.RERANKING,
            payload={
                EventPayload.NODES: nodes,
                EventPayload.MODEL_NAME: self.model_id,
                EventPayload.QUERY_STR: query_bundle.query_str,
                EventPayload.TOP_K: self.top_n,
            },
        ) as event:

            # Prepare the text sources for Google Reranker
            text_sources = []
            for index, node in enumerate(nodes):
                text_sources.append(
                    discoveryengine.RankingRecord(
                        id=str(index),
                        content=node.node.get_content(metadata_mode=MetadataMode.EMBED),
                    ),
                )
            # change top_n if the number of nodes is less than top_n
            if len(nodes) < self.top_n:
                self.top_n = len(nodes)

            try:
                request = discoveryengine.RankRequest(
                    ranking_config=self._ranking_config,
                    model=self.model_id,
                    top_n=self.top_n,
                    query=query_bundle.query_str,
                    records=text_sources,
                )
                response = self._client.rank(request=request)

                results = response.records
            except Exception as e:
                raise RuntimeError(f"Failed to invoke VertexAI model: {e}")

            new_nodes = []
            for result in results:
                index = int(result.id)
                relevance_score = result.score
                new_node_with_score = NodeWithScore(
                    node=nodes[index].node,
                    score=relevance_score,
                )
                new_nodes.append(new_node_with_score)

            event.on_end(payload={EventPayload.NODES: new_nodes})

        dispatcher.event(ReRankEndEvent(nodes=new_nodes))
        return new_nodes
