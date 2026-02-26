#!/bin/bash
set -e

echo "Initializing AWS local services..."
./scripts/s3-init.sh
./scripts/dynamodb-init.sh
echo "AWS services initialized successfully!"

# Execute the CMD from Dockerfile or docker-compose
exec "$@"
