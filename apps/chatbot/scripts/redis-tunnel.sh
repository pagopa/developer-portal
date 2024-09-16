#!/bin/bash

# Set variables
CLUSTER_NAME="cms-ecs-cluster"
SERVICE_NAME="cms-ecs"
LOAD_BALANCER_NAME="chatbot-load-balancer"
REMOTE_PORT="6379"
LOCAL_PORT="16379"


# Get the ECS Task ARN
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query 'taskArns[0]' --output text)

if [ -z "$TASK_ARN" ]; then
  echo "No ECS task found for the service $SERVICE_NAME in cluster $CLUSTER_NAME."
  exit 1
fi

# Extract the Task ID from the Task ARN (last part of the ARN)
TASK_ID=$(basename $TASK_ARN)

if [ -z "$TASK_ID" ]; then
  echo "Unable to extract the Task ID from the ARN."
  exit 1
fi

# Get the container name (task definition details)
CONTAINER_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query 'tasks[0].containers[0].runtimeId' --output text)

if [ -z "$CONTAINER_ID" ]; then
  echo "No container found for task $TASK_ARN."
  exit 1
fi

# Get the Network Load Balancer DNS name
TARGET_HOST=$(aws elbv2 describe-load-balancers --names $LOAD_BALANCER_NAME --query 'LoadBalancers[0].DNSName' --output text)

if [ -z "$TARGET_HOST" ]; then
  echo "No Load Balancer found with the name $LOAD_BALANCER_NAME."
  exit 1
fi

# Construct the target parameter for SSM for Fargate
TARGET="ecs:${CLUSTER_NAME}_${TASK_ID}_${CONTAINER_ID}"

# Start the SSM session with port forwarding
aws ssm start-session \
  --target $TARGET \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters "{\"host\":[\"$TARGET_HOST\"],\"portNumber\":[\"$REMOTE_PORT\"],\"localPortNumber\":[\"$LOCAL_PORT\"]}"