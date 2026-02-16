#!/bin/bash

docker compose -f docker/compose.yaml run create-index sh -c "./scripts/s3-init.sh && poetry run python src/modules/create_vector_index.py --structured --clean-redis"