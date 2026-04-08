#!/bin/bash
set -e

if [ -z "$URLS" ]; then
  echo "ERROR: URLS environment variable is not set." >&2
  exit 1
fi

IFS=',' read -ra URL_LIST <<< "$URLS"

for url in "${URL_LIST[@]}"; do
  url=$(echo "$url" | xargs)  # trim surrounding whitespace/quotes
  echo "=== [parser] Processing URL: $url ==="
  URL="$url" node dist/main.js
done
