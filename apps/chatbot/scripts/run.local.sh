#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

echo "-=-=-=-= environment: $environment"
echo "-=-=-=-= AWS_ENDPOINT_URL: $AWS_ENDPOINT_URL"
echo "-=-=-=-= AWS_REGION: $AWS_REGION"

echo '-=-=-=-= init AWS local services'
./scripts/s3-init.sh
./scripts/dynamodb-init.sh

echo '-=-=-=-= run FastAPI'
hypercorn -b 0.0.0.0:8080 --reload src.app.main:app
