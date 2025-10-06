#!/bin/bash

AWS_REGION=us-east-1

aws dynamodb create-table \
--endpoint-url http://dynamodb:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/local/sessions.json \
--region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url http://dynamodb:8000 \
  --table-name chatbot-local-sessions \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

aws dynamodb create-table \
  --endpoint-url http://dynamodb:8000 \
  --cli-input-json file://./docker/files/dynamodb_schemas/local/queries.json \
  --region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url http://dynamodb:8000 \
  --table-name chatbot-local-queries \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

aws dynamodb create-table \
--endpoint-url http://dynamodb:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/local/salts.json \
--region $AWS_REGION

aws dynamodb update-time-to-live \
  --endpoint-url http://dynamodb:8000 \
  --table-name chatbot-local-salts \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region $AWS_REGION

aws dynamodb list-tables \
  --endpoint-url http://dynamodb:8000 \
  --region $AWS_REGION
