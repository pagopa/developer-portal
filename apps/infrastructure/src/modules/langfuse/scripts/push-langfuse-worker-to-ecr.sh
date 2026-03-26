#!/bin/bash
set -e

# Configuration
LANGFUSE_VERSION="3.115"
DOCKER_HUB_IMAGE="langfuse/langfuse-worker:${LANGFUSE_VERSION}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Langfuse Worker ECR Migration Script${NC}"
echo "=================================="
echo ""

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-$(aws configure get region)}

if [ -z "$AWS_REGION" ]; then
    echo "Error: AWS_REGION not set. Please set it or configure AWS CLI"
    exit 1
fi

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
ECR_REPO_NAME="langfuse-worker"
ECR_IMAGE="${ECR_REGISTRY}/${ECR_REPO_NAME}:${LANGFUSE_VERSION}"

echo -e "${GREEN}Step 1:${NC} Logging in to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

echo -e "\n${GREEN}Step 2:${NC} Pulling Langfuse Worker image from Docker Hub..."
docker pull --platform linux/arm64 ${DOCKER_HUB_IMAGE}

echo -e "\n${GREEN}Step 3:${NC} Tagging image for ECR..."
docker tag ${DOCKER_HUB_IMAGE} ${ECR_IMAGE}

echo -e "\n${GREEN}Step 4:${NC} Pushing image to ECR..."
docker push ${ECR_IMAGE}

echo -e "\n${GREEN}✓ Success!${NC} Langfuse Worker image pushed to ECR:"
echo "  ${ECR_IMAGE}"
echo ""
echo "Next steps:"
echo "1. Apply your Terraform changes to create the ECR repository"
echo "2. Run this script to push the image"
echo "3. Deploy the updated ECS task definition"
