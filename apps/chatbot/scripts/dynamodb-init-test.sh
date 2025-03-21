#!/bin/bash
aws dynamodb create-table \
--endpoint-url http://dynamodb-test:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/test/sessions.json \
--region eu-south-1

aws dynamodb create-table \
--endpoint-url http://dynamodb-test:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/test/queries.json \
--region eu-south-1

aws dynamodb create-table \
--endpoint-url http://dynamodb-test:8000 \
--cli-input-json file://./docker/files/dynamodb_schemas/test/salts.json \
--region eu-south-1

aws dynamodb list-tables \
  --endpoint-url http://dynamodb-test:8000 \
  --region eu-south-1
