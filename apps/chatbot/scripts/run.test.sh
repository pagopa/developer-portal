#!/bin/bash

echo "-=-=-=-= AWS_ENDPOINT_URL: $AWS_ENDPOINT_URL -=-=-=-=-=-=-"
echo "-=-=-=-= CHB_AWS_SQS_QUEUE_EVALUATE_NAME: $CHB_AWS_SQS_QUEUE_EVALUATE_NAME -=-=-=-=-=-=-"
echo "-=-=-=-= AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION -=-=-=-=-=-=-"

# echo '-=-=-=-=-=-=-=-=-= init Cognito -==-=-=-=-=-=-=-=-'
# ./scripts/cognito-init-test.sh

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
./scripts/dynamodb-init-test.sh

echo '-=-=-=-=-=-=-=-=-= init SQS -==-=-=-=-=-=-=-=-'
aws sqs create-queue \
  --queue-name $CHB_AWS_SQS_QUEUE_EVALUATE_NAME \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_DEFAULT_REGION

aws sqs list-queues \
  --queue-name $CHB_AWS_SQS_QUEUE_EVALUATE_NAME \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_DEFAULT_REGION

# echo '-=-=-=-=-=-=-=-=-= init Redis -==-=-=-=-=-=-=-=-'
# TODO: import redis data
poetry run python src/modules/create_vector_index.py --params config/params.yaml

echo '-=-=-=-=-=-=-=-=-=- run pytest -=-==-=-=-=-=-=-=-=-'
poetry run pytest src/app/routers/test_queries.py::test_get_queries
