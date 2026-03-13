#!/bin/bash

AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_ENDPOINT_URL=${AWS_ENDPOINT_URL:-"http://motoserver:5000"}

aws s3api create-bucket --bucket $S3_BUCKET_NAME \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION

aws s3 cp --recursive ./files/s3/$CHB_INDEX_ID/parser/example.com/ s3://$S3_BUCKET_NAME/$CHB_INDEX_ID/parser/example.com/ \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION
  
aws s3 cp --recursive ./files/s3/$CHB_INDEX_ID/extractor/example.com/ s3://$S3_BUCKET_NAME/$CHB_INDEX_ID/extractor/example.com/ \
  --endpoint-url=$AWS_ENDPOINT_URL \
  --region $AWS_REGION
