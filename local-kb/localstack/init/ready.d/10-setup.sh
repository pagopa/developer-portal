#!/bin/bash
# Runs inside LocalStack when it is ready. It replicates the AWS setup of
# apps/infrastructure/src/modules/chatbot/lambda_index.tf:
#   1. static content bucket, seeded with the data downloaded from the dev bucket
#   2. index lambda (python3.12 zip, code mounted with hot-reload)
#   3. bucket notifications that invoke the lambda
# The data is uploaded BEFORE the notifications are configured, so the seed does
# not trigger thousands of lambda invocations.
set -euo pipefail

ENV_FILE=/opt/local-kb/chatbot.env
SEED_DIR=/opt/local-kb/s3-data

echo "-=-=-=-= creating bucket $BUCKET_NAME"
awslocal s3 mb "s3://$BUCKET_NAME"

if [ -d "$SEED_DIR" ] && [ -n "$(ls -A "$SEED_DIR")" ]; then
  echo "-=-=-=-= seeding bucket from $SEED_DIR"
  awslocal s3 sync "$SEED_DIR" "s3://$BUCKET_NAME/" --only-show-errors
else
  echo "-=-=-=-= WARNING: $SEED_DIR is empty, the bucket is not seeded"
fi

# settings.py requires a service account dict even with mock models: an empty one
# passes the validation and is never used by the mock models
GOOGLE_SERVICE_ACCOUNT_PARAM=$(grep '^CHB_AWS_SSM_GOOGLE_SERVICE_ACCOUNT=' "$ENV_FILE" | cut -d= -f2)
echo "-=-=-=-= creating SSM parameter $GOOGLE_SERVICE_ACCOUNT_PARAM"
awslocal ssm put-parameter \
  --name "$GOOGLE_SERVICE_ACCOUNT_PARAM" \
  --type SecureString \
  --value "{}" \
  > /dev/null

# Hot-reload: the "hot-reload" bucket makes LocalStack mount the host folder in S3Key
# as /var/task; the dependencies are mounted in /opt/deps by LAMBDA_DOCKER_FLAGS
LAMBDA_CODE_DIR=$(realpath -m "$LAMBDA_CODE_DIR")
echo "-=-=-=-= creating lambda $LAMBDA_NAME with hot-reload of $LAMBDA_CODE_DIR"
LAMBDA_ENV_VARS="CHB_AWS_S3_BUCKET_NAME_STATIC_CONTENT=$BUCKET_NAME,PYTHONPATH=/var/task:/opt/deps:/var/runtime"
while IFS= read -r line; do
  case "$line" in "" | \#*) continue ;; esac
  LAMBDA_ENV_VARS="$LAMBDA_ENV_VARS,$line"
done < "$ENV_FILE"

awslocal lambda create-function \
  --function-name "$LAMBDA_NAME" \
  --runtime python3.12 \
  --handler src.lambda_refresh_index.lambda_handler \
  --code S3Bucket=hot-reload,S3Key="$LAMBDA_CODE_DIR" \
  --role arn:aws:iam::000000000000:role/lambda-index-role \
  --timeout 900 \
  --memory-size 1024 \
  --environment "Variables={$LAMBDA_ENV_VARS}" \
  > /dev/null
awslocal lambda wait function-active-v2 --function-name "$LAMBDA_NAME"

LAMBDA_ARN=$(awslocal lambda get-function \
  --function-name "$LAMBDA_NAME" \
  --query 'Configuration.FunctionArn' --output text)

echo "-=-=-=-= configuring bucket notifications to $LAMBDA_ARN"
awslocal s3api put-bucket-notification-configuration \
  --bucket "$BUCKET_NAME" \
  --notification-configuration "{
    \"LambdaFunctionConfigurations\": [
      {
        \"LambdaFunctionArn\": \"$LAMBDA_ARN\",
        \"Events\": [\"s3:ObjectCreated:*\", \"s3:ObjectRemoved:*\"],
        \"Filter\": {\"Key\": {\"FilterRules\": [{\"Name\": \"suffix\", \"Value\": \".md\"}]}}
      },
      {
        \"LambdaFunctionArn\": \"$LAMBDA_ARN\",
        \"Events\": [\"s3:ObjectCreated:*\"],
        \"Filter\": {\"Key\": {\"FilterRules\": [{\"Name\": \"suffix\", \"Value\": \"main-guide-versions-dirNames-to-remove.json\"}]}}
      }
    ]
  }"

echo "-=-=-=-= local KB setup completed"
