#!/bin/bash

# run debug (Antigravity: F5) and set breakpoint from your IDE

docker compose -f docker/compose.test.yaml \
  run --rm \
  -p 5678:5678 \
  api \
  python \
  -m debugpy \
  --listen 0.0.0.0:5678 \
  --wait-for-client \
  -m pytest src/app/ -s
