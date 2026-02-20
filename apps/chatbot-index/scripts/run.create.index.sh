#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:3000"}

echo "-=-=-=-= environment: $environment"
echo "-=-=-=-= AWS_ENDPOINT_URL: $AWS_ENDPOINT_URL"
echo "-=-=-=-= AWS_REGION: $AWS_REGION"

echo '-=-=-=-= init AWS local services'
bash ./scripts/s3-init.sh

echo '-=-=-=-= run Create Index'
poetry run python src/modules/create_vector_index.py --static --clean-redis
