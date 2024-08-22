import os
import yaml
import argparse
import logging

from llama_index.embeddings.bedrock import BedrockEmbedding

from src.modules.async_bedrock import AsyncBedrock
from src.modules.vector_database import build_automerging_index


logging.basicConfig(level=logging.INFO)

AWS_DEFAULT_REGION = os.getenv('CHB_AWS_DEFAULT_REGION', os.getenv('AWS_DEFAULT_REGION'))
AWS_S3_BUCKET = os.getenv("CHB_AWS_S3_BUCKET", os.getenv("AWS_S3_BUCKET"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--params", type=str, default="config/params.yaml", help="params path")
    args = parser.parse_args()

    # load parameters
    params = yaml.safe_load(open(args.params, "r"))

    # load LLM and embedding model
    model = AsyncBedrock(
        model=params["models"]["model_id"],
        model_kwargs={
            "temperature": params["models"]["temperature"]
        },
    )

    embed_model = BedrockEmbedding(
        model_name=params["models"]["emded_model_id"],
    )

    # create vector index
    index = build_automerging_index(
        model,
        embed_model,
        documentation_dir=params["documentation"]["path"],
        save_dir=params["vector_index"]["path"],
        s3_bucket_name=AWS_S3_BUCKET,
        chunk_sizes=params["vector_index"]["chunk_sizes"],
        chunk_overlap=params["vector_index"]["chunk_overlap"]
    )
