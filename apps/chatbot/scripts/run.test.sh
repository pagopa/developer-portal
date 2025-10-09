#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:3000"}

echo "-=-=-=-= AWS_ENDPOINT_URL: $AWS_ENDPOINT_URL -=-=-=-=-=-=-"
echo "-=-=-=-= AWS_REGION: $AWS_REGION -=-=-=-=-=-=-"

echo '-=-=-=-=-=-=-=-=-=- init AWS local services -=-==-=-=-=-=-=-=-=-'
./scripts/s3-init.sh
./scripts/dynamodb-init-test.sh
./scripts/sqs-init.sh

echo '-=-=-=-=-=-=-=-=-=- run pytest -=-==-=-=-=-=-=-=-=-'
poetry run pytest src/app
