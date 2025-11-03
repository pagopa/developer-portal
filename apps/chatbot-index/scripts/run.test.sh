#!/bin/bash

./scripts/s3-init.sh > /dev/null 2>&1

echo '-=-=-=-= run pytest'
# poetry run pytest src

curl -XPOST "http://localhost:8080/2015-03-31/functions/function/invocations" \
  -H "Content-Type: application/json" \
  -d @scripts/event.json
