#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

aws s3api create-bucket --bucket $CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION

