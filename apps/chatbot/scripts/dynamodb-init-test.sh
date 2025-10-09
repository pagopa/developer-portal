#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:3000"}

aws dynamodb create-table \
--endpoint-url $AWS_ENDPOINT_URL \
--cli-input-json file://./docker/files/dynamodb_schemas/test/sessions.json \
--region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name chatbot-test-sessions \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

aws dynamodb create-table \
  --endpoint-url $AWS_ENDPOINT_URL \
  --cli-input-json file://./docker/files/dynamodb_schemas/test/queries.json \
  --region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name chatbot-test-queries \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

aws dynamodb create-table \
--endpoint-url $AWS_ENDPOINT_URL \
--cli-input-json file://./docker/files/dynamodb_schemas/test/salts.json \
--region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name chatbot-test-salts \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

# aws dynamodb list-tables \
#   --endpoint-url $AWS_ENDPOINT_URL \
#   --region $AWS_REGION
