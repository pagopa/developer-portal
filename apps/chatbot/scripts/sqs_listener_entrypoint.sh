#!/bin/bash
set -e

echo "Initializing SQS queues..."
./scripts/sqs-init.sh
echo "SQS initialization complete!"

# Execute the CMD from Dockerfile
echo "Starting SQS listener with command: $@"
exec "$@"
