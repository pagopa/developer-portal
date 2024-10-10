import os
import yaml
import argparse
import logging

from src.modules.models import get_llm, get_embed_model
from src.modules.vector_database import (
    build_automerging_index,
    build_automerging_index_redis,
    build_automerging_index_s3
)

from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))

DOCUMENTATION_DIR = os.getenv("CHB_DOCUMENTATION_DIR")
AWS_S3_BUCKET = os.getenv("CHB_AWS_S3_BUCKET", os.getenv("AWS_S3_BUCKET"))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--params", type=str, default="config/params.yaml", help="params path")
    args = parser.parse_args()

    # load parameters
    params = yaml.safe_load(open(args.params, "r"))

    if params["vector_index"]["use_redis"] and params["vector_index"]["use_s3"]:
        raise Exception("Vector Store Error: use s3 or Redis or none of them.")

    model = get_llm()
    embed_model = get_embed_model()

    # create vector index
    if params["vector_index"]["use_redis"]:
        index = build_automerging_index_redis(
            model,
            embed_model,
            documentation_dir=DOCUMENTATION_DIR,
            chunk_sizes=params["vector_index"]["chunk_sizes"],
            chunk_overlap=params["vector_index"]["chunk_overlap"]
        )
    if params["vector_index"]["use_s3"]:
        index = build_automerging_index_s3(
            model,
            embed_model,
            documentation_dir=DOCUMENTATION_DIR,
            save_dir=params["vector_index"]["path"],
            s3_bucket_name=AWS_S3_BUCKET,
            chunk_sizes=params["vector_index"]["chunk_sizes"],
            chunk_overlap=params["vector_index"]["chunk_overlap"]
        )
    if not params["vector_index"]["use_redis"] and not params["vector_index"]["use_s3"]:
        index = build_automerging_index(
            model,
            embed_model,
            documentation_dir=DOCUMENTATION_DIR,
            save_dir=params["vector_index"]["path"],
            chunk_sizes=params["vector_index"]["chunk_sizes"],
            chunk_overlap=params["vector_index"]["chunk_overlap"]
        )
