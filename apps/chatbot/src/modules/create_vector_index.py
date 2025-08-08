import logging

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import build_index_redis


logging.basicConfig(level=logging.INFO)


if __name__ == "__main__":

    llm = get_llm()
    embed_model = get_embed_model()

    # create vector index
    index = build_index_redis(
        llm=llm,
        embed_model=embed_model,
    )
