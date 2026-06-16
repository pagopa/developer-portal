#!/bin/bash

# ==============================================
# Expert Note: Set up your AWS Region and fixed repository names here.
# Only the tags (SOURCE_TAG and TARGET_TAG) should be provided via command line.
# ==============================================
AWS_REGION="eu-south-1"
ACCOUNT_ID="039804388894"
ECR_REPO_URL="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# --- Base Components (Fixed) ---
GHCR_BASE_IMAGE="ghcr.io/pagopa/dos68k/chatbot-api" 
ECR_REPO_PREFIX="dos68k-chatbotapi" 

# --- Input Validation Check ---
if [ "$#" -ne 2 ]; then
    echo "======================================================"
    echo "ERROR: Invalid number of arguments."
    echo "Usage: $0 <SOURCE_TAG> <TARGET_TAG>"
    echo ""
    echo "Example: ./push_image_dynamic.sh pagopa-v2 release-candidate"
    echo "       (Source=pagopa-v2, Target=release-candidate)"
    echo "======================================================"
    exit 1
fi

# Capture parameters into variables
SOURCE_TAG=$1 # Example: pagopa-v2 (The tag on the source image)
TARGET_TAG=$2 # Example: release-candidate (The desired final version in ECR)

# Construct the full, dynamic image names
SOURCE_FULL_IMAGE="${GHCR_BASE_IMAGE}:${SOURCE_TAG}"
TARGET_FULL_IMAGE="${ECR_REPO_URL}/${ECR_REPO_PREFIX}:${TARGET_TAG}"


# --- Script Execution Start (Exit immediately if any command fails) ---
set -e

echo "=============================================="
echo "--- Starting Container Image Deployment Pipeline ---"
echo "Source pulled from: ${SOURCE_FULL_IMAGE}"
echo "Target pushed to ECR: ${TARGET_FULL_IMAGE}"
echo "=============================================="


# 1. AWS ECR Login (Authentication)
echo -e "\n[STEP 1/4] Authenticating with Amazon ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REPO_URL"

echo "✅ Successfully logged into ECR."


# 2. Pull Image from GHCR (Acquire Source)
echo -e "\n[STEP 2/4] Pulling source image from GitHub Container Registry..."
docker pull "${SOURCE_FULL_IMAGE}" --platform=linux/amd64

echo "✅ Successfully pulled image: ${SOURCE_FULL_IMAGE}"


# 3. Tag the Image (Renaming for ECR compatibility)
echo -e "\n[STEP 3/4] Tagging the local image for the target ECR repository..."
# Syntax: docker tag SOURCE[:TAG] TARGET[:NEW_TAG]
docker tag "${SOURCE_FULL_IMAGE}" "${TARGET_FULL_IMAGE}"

echo "✅ Successfully tagged image as: ${TARGET_FULL_IMAGE}"


# 4. Push Image to ECR (Deployment)
echo -e "\n[STEP 4/4] Pushing the fully tagged image to Amazon ECR..."
docker push "${TARGET_FULL_IMAGE}"

echo ""
echo "=============================================="
echo "🚀 Deployment Complete!"
echo "Image ${SOURCE_TAG} was successfully built and pushed as version '${TARGET_TAG}'."
echo "Location: ${TARGET_FULL_IMAGE}"
echo "=============================================="
