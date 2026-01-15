#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

aws sqs create-queue \
  --queue-name $CHB_AWS_SQS_QUEUE_EVALUATE_NAME \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION

