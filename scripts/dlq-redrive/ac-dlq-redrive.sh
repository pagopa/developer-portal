#!/bin/bash

# --- Configuration ---
SOURCE_QUEUE_URL="https://sqs.eu-south-1.amazonaws.com/195239627635/ac-prod-resync-events-dlq.fifo"
TARGET_QUEUE_URL="https://sqs.eu-south-1.amazonaws.com/195239627635/ac-prod-events.fifo"
OUTPUT_FILE="/tmp/ac-prod-resync-events-dlq.fifo.json"
RECEIVE_VISIBILITY_TIMEOUT_SECONDS=60
DEFAULT_MESSAGE_GROUP_ID="dlq-redrive"

# --- Argument Handling ---
MAX_MESSAGES=""
REPLICATE=false
DESCRIPTION="Replicating messages from DLQ to active queue."

print_help() {
    cat <<EOF
Usage: $(basename "$0") [MAX_MESSAGES] [--replicate] [options]

Read messages from a DLQ, save message bodies locally, optionally replicate to target queue.
Messages are deleted from the source DLQ only when replication is enabled and successful.

Options:
  -m, --max-messages N       Maximum number of messages to read (positive integer).
  -r, --replicate            Replicate messages to target queue before deletion.
  -h, --help                 Show this help message and exit.

Examples:
  $(basename "$0")
  $(basename "$0") 50
  $(basename "$0") --max-messages 50 --replicate
  $(basename "$0") 50 --replicate
EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                print_help
                exit 0
                ;;
            -r|--replicate)
                REPLICATE=true
                shift
                ;;
            -m|--max-messages)
                if [[ -z "$2" ]]; then
                    echo "ERROR: --max-messages requires a numeric value." >&2
                    print_help >&2
                    exit 1
                fi
                MAX_MESSAGES="$2"
                shift 2
                ;;
            --max-messages=*)
                MAX_MESSAGES="${1#*=}"
                shift
                ;;
            *)
                if [[ "$1" =~ ^[0-9]+$ && -z "$MAX_MESSAGES" ]]; then
                    MAX_MESSAGES="$1"
                    shift
                else
                    echo "ERROR: Unknown argument: $1" >&2
                    print_help >&2
                    exit 1
                fi
                ;;
        esac
    done
}

parse_arguments "$@"

echo "==================================================="
echo "AWS SQS Message Replication Script Initialized"
echo "Source Queue: $SOURCE_QUEUE_URL"
echo "Target Queue: $TARGET_QUEUE_URL"
echo "Output File: $OUTPUT_FILE"
if [[ -n "$MAX_MESSAGES" ]]; then
    echo "Reading up to $MAX_MESSAGES messages."
else
    echo "Attempting to read ALL available messages (this may take time)."
fi
echo "Replicate Flag Set: $REPLICATE"
echo "==================================================="

# Array to store the ReceiptHandles of all successfully retrieved messages.
declare -a RECEIVED_HANDLES=()
declare -a HANDLES_TO_DELETE=()
declare -a ALL_MESSAGES=()
declare -a MESSAGE_GROUP_IDS=()
declare -a MESSAGE_DEDUP_IDS=()

# --- Function Definitions ---

# Function to read messages and populate arrays
read_messages() {
    local received_count=0
    local has_more=true
    local iteration=0
    local max_to_read=-1

    if [[ -n "$MAX_MESSAGES" ]]; then
        if ! [[ "$MAX_MESSAGES" =~ ^[0-9]+$ ]] || [[ "$MAX_MESSAGES" -le 0 ]]; then
            echo "ERROR: MAX_MESSAGES must be a positive integer." >&2
            exit 1
        fi
        max_to_read="$MAX_MESSAGES"
    fi

    echo "[STEP 1/3] Attempting to receive messages..."

    while $has_more; do
        local batch_size=10
        if [[ "$max_to_read" -gt 0 ]]; then
            local remaining=$((max_to_read - received_count))
            if [[ "$remaining" -le 0 ]]; then
                break
            fi
            if [[ "$remaining" -lt "$batch_size" ]]; then
                batch_size="$remaining"
            fi
        fi

        iteration=$((iteration + 1))
        echo "--- Iteration $iteration: Retrieving batch of up to $batch_size messages ---"

        # Use a loop structure to handle pagination and repeated reads until no message is returned.
        RESPONSE=$(aws sqs receive-message \
            --queue-url "$SOURCE_QUEUE_URL" \
            --max-number-of-messages "$batch_size" \
            --wait-time-seconds 10 \
            --visibility-timeout "$RECEIVE_VISIBILITY_TIMEOUT_SECONDS" \
            --message-system-attribute-names All \
            --region eu-south-1)

        if [[ $? -ne 0 ]]; then
            echo "ERROR: Failed to run AWS CLI command. Check credentials, region, and permissions." >&2
            exit 1
        fi

        # Extract one compact JSON object per message to avoid line-by-line JSON corruption.
        if ! jq -e '.Messages and (.Messages | length > 0)' <<< "$RESPONSE" > /dev/null; then
            has_more=false
            break # No more messages found, exit loop
        fi

        while IFS= read -r message_json; do
            # Extract data points for storage and replication/deletion
            MESSAGE_BODY=$(jq -r '.Body // empty' <<< "$message_json")
            RECEIPT_HANDLE=$(jq -r '.ReceiptHandle // empty' <<< "$message_json")
            MESSAGE_GROUP_ID=$(jq -r '.Attributes.MessageGroupId // empty' <<< "$message_json")
            MESSAGE_DEDUP_ID=$(jq -r '.Attributes.MessageDeduplicationId // empty' <<< "$message_json")

            if [[ -z "$MESSAGE_BODY" || -z "$RECEIPT_HANDLE" ]]; then
                echo "WARNING: Skipping malformed message payload." >&2
                continue
            fi

            # Store necessary data locally
            ALL_MESSAGES+=("$MESSAGE_BODY")
            RECEIVED_HANDLES+=("$RECEIPT_HANDLE")
            MESSAGE_GROUP_IDS+=("$MESSAGE_GROUP_ID")
            MESSAGE_DEDUP_IDS+=("$MESSAGE_DEDUP_ID")
            received_count=$((received_count + 1))
            if [[ "$max_to_read" -gt 0 && "$received_count" -ge "$max_to_read" ]]; then
                has_more=false
                break
            fi
        done < <(jq -c '.Messages[]' <<< "$RESPONSE")

        echo "Retrieved so far: $received_count messages."
    done
}


# Function to save and replicate messages
process_messages() {
    local MESSAGE_COUNT=${#ALL_MESSAGES[@]}

    if [[ "$MESSAGE_COUNT" -eq 0 ]]; then
        echo "[FAIL] No messages retrieved. Nothing to process or delete."
        return 1
    fi

    # --- Step 2/3: Save and Replicate ---
    echo ""
    echo "[STEP 2/3] Saving message bodies to $OUTPUT_FILE..."
    {
        for body in "${ALL_MESSAGES[@]}"; do
            echo "$body"
        done
    } > "$OUTPUT_FILE"

    if $REPLICATE; then
        echo "[STEP 3/3] Replicating $MESSAGE_COUNT messages to target queue..."
        SUCCESS_COUNT=0
        FAIL_COUNT=0
        HANDLES_TO_DELETE=()
        for i in "${!ALL_MESSAGES[@]}"; do
            message_body="${ALL_MESSAGES[$i]}"
            receipt_handle="${RECEIVED_HANDLES[$i]}"
            message_group_id="${MESSAGE_GROUP_IDS[$i]}"
            message_dedup_id="${MESSAGE_DEDUP_IDS[$i]}"

            if [[ -z "$message_group_id" ]]; then
                message_group_id="$DEFAULT_MESSAGE_GROUP_ID"
                echo "WARNING: MessageGroupId missing in source message. Using fallback group id '$message_group_id'." >&2
            fi
            if [[ -z "$message_dedup_id" ]]; then
                message_dedup_id="$(uuidgen)"
            fi

            # Use send-message API call
            SEND_OUTPUT=$(aws sqs send-message \
                --queue-url "$TARGET_QUEUE_URL" \
                --message-body "$message_body" \
                --message-group-id "$message_group_id" \
                --message-deduplication-id "$message_dedup_id" \
                --region eu-south-1 2>&1 > /dev/null)

            if [[ $? -eq 0 ]]; then
                SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
                HANDLES_TO_DELETE+=("$receipt_handle")
            else
                echo "WARNING: Failed to send message body to target queue: $SEND_OUTPUT" >&2
                FAIL_COUNT=$((FAIL_COUNT + 1))
            fi
        done
        echo "Replication Summary: Successes = $SUCCESS_COUNT / Failures = $FAIL_COUNT / Eligible for deletion = ${#HANDLES_TO_DELETE[@]}"
    else
        echo "[STEP 3/3] Skipping replication (use --replicate parameter to enable)."
    fi
}

# Function to delete messages from the source queue
delete_messages() {
    local MESSAGE_COUNT=${#HANDLES_TO_DELETE[@]}

    if [[ $MESSAGE_COUNT -eq 0 ]]; then
        echo "[SKIP] No successfully replicated message handles found. Nothing to delete."
        return 0
    fi

    echo ""
    echo "==================================================="
    echo "[CLEANUP] Deleting $MESSAGE_COUNT messages from the SOURCE DLQ..."

    # Deletion must be done one-by-one using the unique ReceiptHandle for safety.
    DELETE_SUCCESS=0
    DELETE_FAIL=0
    for handle in "${HANDLES_TO_DELETE[@]}"; do
        DELETE_OUTPUT=$(aws sqs delete-message \
            --queue-url "$SOURCE_QUEUE_URL" \
            --receipt-handle "$handle" \
            --region eu-south-1 2>&1)

        if [[ $? -eq 0 ]]; then
            DELETE_SUCCESS=$((DELETE_SUCCESS + 1))
        else
            echo "WARNING: Failed to delete message handle: $DELETE_OUTPUT" >&2
            DELETE_FAIL=$((DELETE_FAIL + 1))
        fi
    done

    echo "✅ Cleanup Summary: Successfully Deleted = $DELETE_SUCCESS / Failed Deletion = $DELETE_FAIL"
}


# --- Main Execution Flow ---
read_messages # Step 1: Read all messages and store handles/bodies

if [[ ${#RECEIVED_HANDLES[@]} -gt 0 ]]; then
    process_messages # Step 2 & 3: Save and (optionally) Replicate
    if $REPLICATE; then
        delete_messages  # Step 4: Clean up the source queue
    else
        echo ""
        echo "[CLEANUP] Skipping delete from source DLQ because replication is disabled."
    fi
else
    echo "Script finished. No messages were processed."
fi

exit 0
