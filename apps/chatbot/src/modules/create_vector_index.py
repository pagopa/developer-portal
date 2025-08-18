import logging

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import build_index_redis
from src.modules.settings import SETTINGS


logging.basicConfig(level=logging.INFO)


if __name__ == "__main__":

    llm = get_llm()
    embed_model = get_embed_model(
        retries=SETTINGS.embed_retries_docs,
        retry_min_seconds=SETTINGS.embed_retry_min_seconds_docs,
        task_type=SETTINGS.embed_task_docs,
    )

    # create vector index
    index = build_index_redis(
        llm=llm,
        embed_model=embed_model,
    )
