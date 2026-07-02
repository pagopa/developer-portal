#!/bin/bash

# Exit immediately if any command fails
set -e

# Usage function
usage() {
    echo "Usage: $0 <ALB_NAME_OR_ARN> [REGION]"
    echo "  ALB_NAME_OR_ARN : The name or the full ARN of your Application Load Balancer"
    echo "  REGION          : (Optional) The AWS region. Defaults to eu-south-1"
    exit 1
}

# Verify required input
if [ -z "$1" ]; then
    echo "Error: Missing ALB Name or ARN."
    usage
fi

ALB_INPUT="$1"
REGION="${2:-eu-south-1}"

echo "===================================================="
echo " Starting ALB Access Logs Configuration "
echo " Target Region: $REGION"
echo "===================================================="

# Ensure AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed or not in your PATH."
    exit 1
fi

# Fetch the active AWS Account ID
echo "Retrieving AWS Account ID..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: $ACCOUNT_ID"

# Resolve ALB ARN if only a short name was provided
if [[ "$ALB_INPUT" == arn:aws:elasticloadbalancing:* ]]; then
    ALB_ARN="$ALB_INPUT"
else
    echo "Resolving ARN for ALB named '$ALB_INPUT'..."
    ALB_ARN=$(aws elbv2 describe-load-balancers --names "$ALB_INPUT" --region "$REGION" --query "LoadBalancers[0].LoadBalancerArn" --output text 2>/dev/null || true)
    if [ -z "$ALB_ARN" ] || [ "$ALB_ARN" == "None" ]; then
        echo "Error: Could not find an ALB named '$ALB_INPUT' in region '$REGION'."
        exit 1
    fi
fi
echo "Resolved ALB ARN: $ALB_ARN"

# Define the Bucket Name
BUCKET_NAME="alb-${ACCOUNT_ID}-logs"
echo "Target S3 Bucket Name: $BUCKET_NAME"

# Check if the S3 bucket already exists
if aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null; then
    echo "S3 Bucket '$BUCKET_NAME' already exists."
else
    echo "S3 Bucket '$BUCKET_NAME' does not exist. Creating it..."
    if [ "$REGION" = "us-east-1" ]; then
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
    else
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" --create-bucket-configuration LocationConstraint="$REGION"
    fi
    echo "S3 Bucket created successfully."
fi

# Map regional ELB Account IDs required for S3 Bucket Policies
case "$REGION" in
    "us-east-1") ELB_ACCOUNT_ID="127311923021" ;;
    "us-east-2") ELB_ACCOUNT_ID="033677994240" ;;
    "us-west-1") ELB_ACCOUNT_ID="027434742980" ;;
    "us-west-2") ELB_ACCOUNT_ID="797873946194" ;;
    "af-south-1") ELB_ACCOUNT_ID="098369216593" ;;
    "ca-central-1") ELB_ACCOUNT_ID="985666609251" ;;
    "eu-central-1") ELB_ACCOUNT_ID="054676820928" ;;
    "eu-west-1") ELB_ACCOUNT_ID="156460612806" ;;
    "eu-west-2") ELB_ACCOUNT_ID="652711504416" ;;
    "eu-south-1") ELB_ACCOUNT_ID="635631232127" ;; # Your default region
    "eu-west-3") ELB_ACCOUNT_ID="009996457667" ;;
    "eu-north-1") ELB_ACCOUNT_ID="897822967062" ;;
    "ap-east-1") ELB_ACCOUNT_ID="754344448648" ;;
    "ap-northeast-1") ELB_ACCOUNT_ID="582318560864" ;;
    "ap-northeast-2") ELB_ACCOUNT_ID="600734575887" ;;
    "ap-southeast-1") ELB_ACCOUNT_ID="114774131450" ;;
    "ap-southeast-2") ELB_ACCOUNT_ID="783225319266" ;;
    "ap-south-1") ELB_ACCOUNT_ID="718504428378" ;;
    "sa-east-1") ELB_ACCOUNT_ID="507241528517" ;;
    *) ELB_ACCOUNT_ID="" ;;
esac

# Generate the Bucket Policy JSON string
echo "Generating and applying S3 bucket policy permissions..."
if [ -n "$ELB_ACCOUNT_ID" ]; then
    # Standard configuration combining the explicit ELB Account Principal and the modern Service Principal
    POLICY_JSON=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${ELB_ACCOUNT_ID}:root"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/AWSLogs/${ACCOUNT_ID}/*"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "logdelivery.elasticloadbalancing.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/AWSLogs/${ACCOUNT_ID}/*"
    }
  ]
}
EOF
)
else
    # Fallback for newer opt-in regions using solely the modern Log Delivery Service Principal
    POLICY_JSON=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "logdelivery.elasticloadbalancing.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/AWSLogs/${ACCOUNT_ID}/*"
    }
  ]
}
EOF
)
fi

# Apply the Bucket Policy
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$POLICY_JSON" --region "$REGION"
echo "Bucket policy applied successfully."

# Enable Access Logs on the ALB attributes configuration
echo "Configuring ALB attributes to push access logs..."
aws elbv2 modify-load-balancer-attributes \
    --load-balancer-arn "$ALB_ARN" \
    --attributes Key=access_logs.s3.enabled,Value=true Key=access_logs.s3.bucket,Value="$BUCKET_NAME" \
    --region "$REGION"

echo "===================================================="
echo " SUCCESS: Access Logging is Active!"
echo " Log Destination: s3://$BUCKET_NAME/AWSLogs/$ACCOUNT_ID/"
echo "===================================================="