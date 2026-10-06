#!/bin/bash
# Entry point to test the local KB refresh flow. Run `./kb.sh help` for the commands.
set -euo pipefail

cd "$(dirname "$0")"

BUCKET_NAME=${BUCKET_NAME:-devportal-local-website-static-content}
LAMBDA_NAME=${LAMBDA_NAME:-chatbot-local-index-lambda}
LANGUAGE_CODE=it
DIRNAMES_TO_REMOVE_KEY="$LANGUAGE_CODE/main-guide-versions-dirNames-to-remove.json"

# AWS CLI on the host pointed to LocalStack, never to a real AWS account
awsl() {
  env -u AWS_PROFILE \
    AWS_ACCESS_KEY_ID=test \
    AWS_SECRET_ACCESS_KEY=test \
    AWS_DEFAULT_REGION=eu-south-1 \
    aws --endpoint-url=http://localhost:4566 "$@"
}

indexer() {
  docker compose run --rm indexer "$@"
}

usage() {
  cat <<EOF
Usage: ./kb.sh <command> [args]

Environment
  up                         install the lambda dependencies, start LocalStack + Redis
  down                       stop the containers (the Redis index is kept)
  reset                      stop the containers and delete the Redis index

Index creation and full refreshes (same scripts of the GitHub actions)
  create <flags>             create the index from scratch, flags of create_vector_index.py:
                             --static --dynamic --api --structured --clean-redis
  refresh <all|api|dynamic|static>
                             refresh the index like chatbot_refresh_vector_index.yaml
                             (static = "add missing static")
  inspect [--list] [--filter TEXT]
                             print the documents of the index

Lambda triggered by S3 events (real flow: S3 -> notification -> lambda)
  put-doc <s3-key> [file]    upload a .md file; without a file, re-upload the seeded
                             copy with a marker appended so its hash changes
  delete-doc <s3-key>        delete a .md file
  put-dirnames-to-remove [file]
                             upload $DIRNAMES_TO_REMOVE_KEY
  logs                       follow the lambda logs

Lambda invoked directly (synchronous, prints the result)
  invoke <event.json>        e.g. ./kb.sh invoke events/object-created.json

The lambda mounts apps/chatbot-index with hot-reload: code changes apply immediately.
EOF
}

command=${1:-help}
shift || true

case "$command" in
  up)
    # Created by the host user, so that the dependencies do not belong to root
    mkdir -p .lambda-deps
    docker compose up -d --wait localstack redis
    ;;
  down)
    docker compose down
    ;;
  reset)
    docker compose down -v
    ;;
  create)
    [ $# -gt 0 ] || { echo "create: specify at least one flag, e.g. --static" >&2; exit 1; }
    indexer src/modules/create_vector_index.py "$@"
    ;;
  refresh)
    case "${1:-}" in
      all)
        indexer src/modules/refresh_dynamic_docs.py
        indexer src/modules/refresh_api_docs.py
        indexer src/modules/add_missing_static_docs.py
        ;;
      api) indexer src/modules/refresh_api_docs.py ;;
      dynamic) indexer src/modules/refresh_dynamic_docs.py ;;
      static) indexer src/modules/add_missing_static_docs.py ;;
      *) echo "refresh: expected one of all, api, dynamic, static" >&2; exit 1 ;;
    esac
    ;;
  inspect)
    indexer tools/inspect_index.py "$@"
    ;;
  put-doc)
    key=${1:?put-doc: missing S3 key}
    file=${2:-}
    if [ -z "$file" ]; then
      file=$(mktemp)
      trap 'rm -f "$file"' EXIT
      cat "s3-data/$key" > "$file"
      printf '\n\nLocal KB test update: %s\n' "$(date -Iseconds)" >> "$file"
    fi
    awsl s3 cp "$file" "s3://$BUCKET_NAME/$key"
    ;;
  delete-doc)
    key=${1:?delete-doc: missing S3 key}
    awsl s3 rm "s3://$BUCKET_NAME/$key"
    ;;
  put-dirnames-to-remove)
    file=${1:-s3-data/$DIRNAMES_TO_REMOVE_KEY}
    awsl s3 cp "$file" "s3://$BUCKET_NAME/$DIRNAMES_TO_REMOVE_KEY"
    ;;
  logs)
    awsl logs tail "/aws/lambda/$LAMBDA_NAME" --follow
    ;;
  invoke)
    event=${1:?invoke: missing event file}
    output=$(mktemp)
    trap 'rm -f "$output"' EXIT
    awsl lambda invoke \
      --function-name "$LAMBDA_NAME" \
      --cli-binary-format raw-in-base64-out \
      --cli-read-timeout 900 \
      --payload "file://$event" \
      --log-type Tail \
      --query 'LogResult' --output text \
      "$output" | base64 -d
    echo "-=-=-=-= result"
    cat "$output"
    echo
    ;;
  help | -h | --help)
    usage
    ;;
  *)
    usage >&2
    exit 1
    ;;
esac
