#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}
CHB_AWS_SQS_QUEUE_EVALUATE_NAME=${CHB_AWS_SQS_QUEUE_EVALUATE_NAME:-"chatbot-evaluate"}
CHB_AWS_SQS_QUEUE_MONITOR_NAME=${CHB_AWS_SQS_QUEUE_MONITOR_NAME:-"chatbot-monitor"}

echo "Creating SQS queues..."

aws sqs create-queue \
  --queue-name $CHB_AWS_SQS_QUEUE_EVALUATE_NAME \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION

aws sqs create-queue \
  --queue-name $CHB_AWS_SQS_QUEUE_MONITOR_NAME \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION

echo "SQS queues created successfully!"