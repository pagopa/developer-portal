#!/bin/bash

docker compose -f docker/compose.test.yaml up refresh-index -d && \
docker exec -it chatbot-index-test-refresh-index-1 ./scripts/run.test.sh && \
docker compose -f docker/compose.test.yaml down
