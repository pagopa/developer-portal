# ECR Image Push Scripts

This directory contains scripts to pull Docker images from Docker Hub and push them to AWS ECR.

## Prerequisites

- AWS CLI configured with appropriate credentials
- Docker installed and running
- Permissions to push to ECR repositories

## Scripts

### push-clickhouse-to-ecr.sh
Migrates ClickHouse image (ARM64) from Docker Hub to ECR.
- **Source**: `clickhouse/clickhouse-server:25.8.8.26-alpine`
- **Target**: ECR repository `clickhouse`
- **Platform**: linux/arm64

### push-langfuse-web-to-ecr.sh
Migrates Langfuse web image (X86_64) from Docker Hub to ECR.
- **Source**: `langfuse/langfuse:3.115`
- **Target**: ECR repository `langfuse-web`
- **Platform**: linux/amd64

### push-langfuse-worker-to-ecr.sh
Migrates Langfuse worker image (ARM64) from Docker Hub to ECR.
- **Source**: `langfuse/langfuse-worker:3.115`
- **Target**: ECR repository `langfuse-worker`
- **Platform**: linux/arm64

## Usage

1. Ensure ECR repositories are created via Terraform
2. Run the desired script:
   ```bash
   ./push-clickhouse-to-ecr.sh
   ./push-langfuse-web-to-ecr.sh
   ./push-langfuse-worker-to-ecr.sh
   ```

3. Each script will:
   - Authenticate with ECR
   - Pull the image from Docker Hub
   - Tag it for ECR
   - Push it to your ECR repository

## Environment Variables

- `AWS_REGION`: Set this to override the default AWS region from your CLI configuration
