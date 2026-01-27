#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

aws dynamodb create-table \
  --endpoint-url $AWS_ENDPOINT_URL \
  --cli-input-json file://./docker/files/dynamodb_schemas/$environment/sessions.json \
  --region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name $CHB_QUERY_TABLE_PREFIX-sessions \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

aws dynamodb create-table \
  --endpoint-url $AWS_ENDPOINT_URL \
  --cli-input-json file://./docker/files/dynamodb_schemas/$environment/queries.json \
  --region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name $CHB_QUERY_TABLE_PREFIX-queries \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

aws dynamodb create-table \
--endpoint-url $AWS_ENDPOINT_URL \
--cli-input-json file://./docker/files/dynamodb_schemas/$environment/salts.json \
--region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name $CHB_QUERY_TABLE_PREFIX-salts \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

# aws dynamodb list-tables \
#   --endpoint-url $AWS_ENDPOINT_URL \
#   --region $AWS_REGION
