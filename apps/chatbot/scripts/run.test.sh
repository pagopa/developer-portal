#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

echo "-=-=-=-= environment: $environment"
echo "-=-=-=-= AWS_ENDPOINT_URL: $AWS_ENDPOINT_URL"
echo "-=-=-=-= AWS_REGION: $AWS_REGION"

echo '-=-=-=-= init AWS local services'
./scripts/s3-init.sh > /dev/null 2>&1
./scripts/dynamodb-init.sh > /dev/null 2>&1
./scripts/sqs-init.sh > /dev/null 2>&1

echo '-=-=-=-= run pytest'
poetry run pytest src/app
