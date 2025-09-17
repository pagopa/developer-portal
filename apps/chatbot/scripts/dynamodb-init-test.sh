#!/bin/bash

echo "-=-=-=-= AWS_ENDPOINT_URL: $AWS_ENDPOINT_URL -=-=-=-=-=-=-"

aws dynamodb create-table \
--endpoint-url $AWS_ENDPOINT_URL \
--cli-input-json file://./docker/files/dynamodb_schemas/test/sessions.json \
--region eu-south-1

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name chatbot-test-sessions \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region eu-south-1

aws dynamodb create-table \
--endpoint-url $AWS_ENDPOINT_URL \
--cli-input-json file://./docker/files/dynamodb_schemas/test/queries.json \
--region eu-south-1

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name chatbot-test-queries \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region eu-south-1

aws dynamodb create-table \
--endpoint-url $AWS_ENDPOINT_URL \
--cli-input-json file://./docker/files/dynamodb_schemas/test/salts.json \
--region eu-south-1

aws dynamodb update-time-to-live \
  --endpoint-url $AWS_ENDPOINT_URL \
  --table-name chatbot-test-salts \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region eu-south-1

aws dynamodb list-tables \
  --endpoint-url $AWS_ENDPOINT_URL \
  --region eu-south-1
