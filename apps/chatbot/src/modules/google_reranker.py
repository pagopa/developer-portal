from typing import Any, List, Optional
from llama_index.core.bridge.pydantic import PrivateAttr
from llama_index.core.instrumentation import get_dispatcher
from llama_index.core.schema import NodeWithScore, QueryBundle
from google.cloud import discoveryengine_v1 as discoveryengine
from llama_index.postprocessor.google_rerank import GoogleRerank


dispatcher = get_dispatcher(__name__)


class AsyncSafeGoogleRerank(GoogleRerank):
    """
    Custom wrapper around LlamaIndex's GoogleRerank.
    This safely defers the instantiation of `discoveryengine.RankServiceAsyncClient`
    until it is actually awaited inside the current asyncio event loop.
    This prevents `RuntimeError: Task got Future attached to a different loop`
    when the app is instantiated synchronously but requests run in a separate loop.
    """

    _runtime_async_client: Any = PrivateAttr(default=None)
    _credentials: Any = PrivateAttr(default=None)

    def __init__(self, credentials: Optional[Any] = None, **kwargs: Any) -> None:
        super().__init__(credentials=credentials, **kwargs)
        self._credentials = credentials

    async def _get_async_client(self):
        if self._runtime_async_client is None:
            self._runtime_async_client = discoveryengine.RankServiceAsyncClient(
                credentials=self._credentials
            )
        return self._runtime_async_client

    @dispatcher.span
    async def _apostprocess_nodes(
        self,
        nodes: List[NodeWithScore],
        query_bundle: Optional[QueryBundle] = None,
    ) -> List[NodeWithScore]:
        from llama_index.core.instrumentation.events.rerank import (
            ReRankStartEvent,
            ReRankEndEvent,
        )

        dispatcher.event(
            ReRankStartEvent(
                query=query_bundle,
                nodes=nodes,
                top_n=self.top_n,
                model_name=self.model,
            )
        )

        if query_bundle is None:
            raise ValueError("Missing query bundle in extra info.")
        if len(nodes) == 0:
            return []

        records = self._build_records(nodes)
        top_n = min(self.top_n, len(nodes))

        request = discoveryengine.RankRequest(
            ranking_config=self._build_ranking_config_path(),
            model=self.model,
            top_n=top_n,
            query=query_bundle.query_str,
            records=records,
        )

        client = await self._get_async_client()
        response = await client.rank(request=request)

        new_nodes = []
        for record in response.records:
            index = int(record.id)
            new_nodes.append(
                NodeWithScore(
                    node=nodes[index].node,
                    score=record.score,
                )
            )

        dispatcher.event(ReRankEndEvent(nodes=new_nodes))
        return new_nodes
