#!/bin/bash
aws dynamodb create-table \
--endpoint-url http://dynamodb:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/local/sessions.json \
--region eu-south-1

aws dynamodb create-table \
--endpoint-url http://dynamodb:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/local/queries.json \
--region eu-south-1

aws dynamodb update-time-to-live \
  --endpoint-url http://dynamodb:8000 \
  --table-name chatbot-local-queries \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region eu-south-1

aws dynamodb create-table \
--endpoint-url http://dynamodb:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/local/salts.json \
--region eu-south-1

aws dynamodb list-tables \
  --endpoint-url http://dynamodb:8000 \
  --region eu-south-1
