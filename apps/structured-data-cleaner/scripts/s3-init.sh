#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

aws s3api create-bucket --bucket $S3_BUCKET_NAME \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION

aws s3 cp ./docker/files/s3/guides-metadata.json s3://$S3_BUCKET_NAME/guides-metadata.json \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION
