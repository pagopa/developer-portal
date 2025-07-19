import os
import yaml
import argparse
import logging

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import build_index_redis


logging.basicConfig(level=logging.INFO)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--params", type=str, default="config/params.yaml", help="params path"
    )
    args = parser.parse_args()

    # load parameters
    params = yaml.safe_load(open(args.params, "r"))

    model = get_llm()
    embed_model = get_embed_model()

    # create vector index
    index = build_index_redis(
        model,
        embed_model,
        chunk_size=params["vector_index"]["chunk_size"],
        chunk_overlap=params["vector_index"]["chunk_overlap"],
    )
