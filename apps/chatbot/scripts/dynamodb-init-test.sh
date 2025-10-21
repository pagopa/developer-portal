#!/bin/bash
AWS_REGION=us-east-1

aws dynamodb create-table \
--endpoint-url http://dynamodb-test:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/test/sessions.json \
--region ${AWS_REGION}

aws dynamodb update-time-to-live \
  --endpoint-url http://dynamodb-test:8000 \
  --table-name chatbot-test-sessions \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region ${AWS_REGION}

aws dynamodb create-table \
--endpoint-url http://dynamodb-test:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/test/queries.json \
--region ${AWS_REGION}

aws dynamodb update-time-to-live \
  --endpoint-url http://dynamodb-test:8000 \
  --table-name chatbot-test-queries \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region ${AWS_REGION}

aws dynamodb create-table \
--endpoint-url http://dynamodb-test:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/test/salts.json \
--region ${AWS_REGION}

aws dynamodb update-time-to-live \
  --endpoint-url http://dynamodb-test:8000 \
  --table-name chatbot-test-salts \
  --time-to-live-specification "Enabled=true,AttributeName=expiresAt" \
  --region ${AWS_REGION}

aws dynamodb list-tables \
  --endpoint-url http://dynamodb-test:8000 \
  --region ${AWS_REGION}
