#!/bin/bash
AWS_REGION=eu-south-1

awslocal sqs create-queue --queue-name chatbot-evaluate.fifo --region ${AWS_REGION} --attributes 'FifoQueue=true,ContentBasedDeduplication=true'

# same of .env.test and src/app/routers/test_queries.py
COGNITO_USER_POOL_ID="eu-south-1_test123"
COGNITO_USER_POOL_CLIENT_ID="clientid123"
COGNITO_USERNAME="test_user"
COGNITO_PASSWORD="TestPassword123!"

awslocal cognito-idp create-user-pool --pool-name p1 --user-pool-tags "_custom_id_=${COGNITO_USER_POOL_ID}" --region ${AWS_REGION}
awslocal cognito-idp create-user-pool-client --user-pool-id ${COGNITO_USER_POOL_ID} --client-name _custom_id_:${COGNITO_USER_POOL_CLIENT_ID} --region ${AWS_REGION}
awslocal cognito-idp admin-create-user \
    --user-pool-id ${COGNITO_USER_POOL_ID} \
    --username ${COGNITO_USERNAME} \
    --user-attributes Name=email,Value=${COGNITO_USERNAME}@local.stack
awslocal cognito-idp admin-set-user-password \
    --user-pool-id ${COGNITO_USER_POOL_ID} \
    --username ${COGNITO_USERNAME} \
    --password ${COGNITO_PASSWORD} \
    --permanent
