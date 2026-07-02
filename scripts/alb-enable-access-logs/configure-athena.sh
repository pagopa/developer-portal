#!/bin/bash

# Exit immediately if any command fails
set -e

# Usage function
usage() {
    echo "Usage: $0 [REGION]"
    echo "  REGION : (Optional) The AWS region. Defaults to eu-south-1"
    exit 1
}

REGION="${1:-eu-south-1}"

echo "===================================================="
echo " Starting Athena Database & Table Configuration "
echo " Target Region: $REGION"
echo "===================================================="

# Ensure AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed or not in your PATH."
    exit 1
fi

# Fetch active account configuration
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="alb-${ACCOUNT_ID}-logs"
DATABASE_NAME="alb_logs_db"
ATHENA_OUTPUT="s3://${BUCKET_NAME}/athena-results/"

echo "Account ID:          $ACCOUNT_ID"
echo "Target S3 Bucket:    $BUCKET_NAME"
echo "Athena Database:     $DATABASE_NAME"
echo "Athena Results Path: $ATHENA_OUTPUT"

# Function to run an Athena query and track execution state to completion
run_athena_query() {
    local query="$1"
    local description="$2"
    
    echo "Executing: $description..."
    
    local exec_id=$(aws athena start-query-execution \
        --query-string "$query" \
        --result-configuration OutputLocation="$ATHENA_OUTPUT" \
        --region "$REGION" \
        --query "QueryExecutionId" --output text)

    local poll_interval_seconds=3
    local max_wait_seconds=600
    local waited_seconds=0

    while true; do
        local status=$(aws athena get-query-execution --query-execution-id "$exec_id" --region "$REGION" --query "QueryExecution.Status.State" --output text)
        if [ "$status" = "SUCCEEDED" ]; then
            echo "Success: $description completed."
            break
        elif [ "$status" = "FAILED" ] || [ "$status" = "CANCELLED" ]; then
            echo "Error: Query failed or was cancelled."
            aws athena get-query-execution --query-execution-id "$exec_id" --region "$REGION" --query "QueryExecution.Status.StateChangeReason" --output text
            exit 1
        fi

        if [ "$waited_seconds" -ge "$max_wait_seconds" ]; then
            echo "Error: Timed out waiting for Athena query to complete ($description). ExecutionId: $exec_id"
            aws athena stop-query-execution --query-execution-id "$exec_id" --region "$REGION" >/dev/null 2>&1 || true
            exit 1
        fi

        sleep "$poll_interval_seconds"
        waited_seconds=$((waited_seconds + poll_interval_seconds))
    done
}

# Step 1: Create the Athena Database
CREATE_DB_SQL="CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};"
run_athena_query "$CREATE_DB_SQL" "Create Database '${DATABASE_NAME}'"

# Step 2: Prepare the Table DDL using a clean heredoc template file to avoid quoting/escaping hell
TEMPLATE_FILE=$(mktemp)

cat << 'EOF' > "$TEMPLATE_FILE"
CREATE EXTERNAL TABLE IF NOT EXISTS __DATABASE_NAME__.alb_access_logs (
    type string,
    time string,
    elb string,
    client_ip string,
    client_port int,
    target_ip string,
    target_port int,
    request_processing_time double,
    target_processing_time double,
    response_processing_time double,
    elb_status_code int,
    target_status_code string,
    received_bytes bigint,
    sent_bytes bigint,
    request_verb string,
    request_url string,
    request_proto string,
    user_agent string,
    ssl_cipher string,
    ssl_protocol string,
    target_group_arn string,
    trace_id string,
    domain_name string,
    chosen_cert_arn string,
    matched_rule_priority string,
    request_creation_time string,
    actions_executed string,
    redirect_url string,
    lambda_error_reason string,
    target_port_list string,
    target_status_code_list string,
    classification string,
    classification_reason string,
    conn_trace_id string
)
PARTITIONED BY (
    day string
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.RegexSerDe'
WITH SERDEPROPERTIES (
    'serialization.format' = '1',
    'input.regex' = '([^ ]*) ([^ ]*) ([^ ]*) ([^ ]*):([0-9]*) ([^ ]*)[:-]([0-9]*) ([-.0-9]*) ([-.0-9]*) ([-.0-9]*) (|[-0-9]*) (-|[-0-9]*) ([-0-9]*) ([-0-9]*) \"([^ ]*) (.*) (- |[^ ]*)\" \"([^\"]*)\" ([A-Z0-9-_]+) ([A-Za-z0-9.-]*) ([^ ]*) \"([^\"]*)\" \"([^\"]*)\" \"([^\"]*)\" ([-.0-9]*) ([^ ]*) \"([^\"]*)\" \"([^\"]*)\" \"([^ ]*)\" \"([^\\s]+?)\" \"([^\\s]+)\" \"([^ ]*)\" \"([^ ]*)\" ?([^ ]*)? ?( .*)?'
)
LOCATION 's3://__BUCKET_NAME__/AWSLogs/__ACCOUNT_ID__/elasticloadbalancing/__REGION__/'
TBLPROPERTIES (
    'projection.enabled' = 'true',
    'projection.day.type' = 'date',
    'projection.day.range' = '2025/01/01,NOW',
    'projection.day.format' = 'yyyy/MM/dd',
    'projection.day.interval' = '1',
    'projection.day.interval.unit' = 'DAYS',
    'storage.location.template' = 's3://__BUCKET_NAME__/AWSLogs/__ACCOUNT_ID__/elasticloadbalancing/__REGION__/${day}'
);
EOF

# Inject dynamic metadata variables into the template SQL file
sed -i.bak "s/__DATABASE_NAME__/${DATABASE_NAME}/g" "$TEMPLATE_FILE"
sed -i.bak "s/__BUCKET_NAME__/${BUCKET_NAME}/g" "$TEMPLATE_FILE"
sed -i.bak "s/__ACCOUNT_ID__/${ACCOUNT_ID}/g" "$TEMPLATE_FILE"
sed -i.bak "s/__REGION__/${REGION}/g" "$TEMPLATE_FILE"
rm -f "${TEMPLATE_FILE}.bak"
# Extract file stream back into bash variable and destroy raw local temp file
CREATE_TABLE_SQL=$(cat "$TEMPLATE_FILE")
rm -f "$TEMPLATE_FILE"

# Step 3: Recreate the Table with the expected ALB schema
DROP_TABLE_SQL="DROP TABLE IF EXISTS ${DATABASE_NAME}.alb_access_logs;"
run_athena_query "$DROP_TABLE_SQL" "Drop Table 'alb_access_logs' (if exists)"

# Step 4: Create the Table with Partition Projection
run_athena_query "$CREATE_TABLE_SQL" "Create Table 'alb_access_logs' with Partition Projection"

echo "===================================================="
echo " SUCCESS: Athena Setup Finished!"
echo " Database: ${DATABASE_NAME}"
echo " Table:    alb_access_logs"
echo "===================================================="