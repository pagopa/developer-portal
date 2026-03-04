#!/bin/bash
set -euo pipefail

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

echo "-=-=-=-= ENVIRONMENT: $ENVIRONMENT"
echo "-=-=-=-= AWS_ENDPOINT_URL: $AWS_ENDPOINT_URL"
echo "-=-=-=-= AWS_REGION: $AWS_REGION"

echo '-=-=-=-= init AWS local services'
./scripts/s3-init.sh
./scripts/dynamodb-init.sh
./scripts/sqs-init.sh

exec "$@"
