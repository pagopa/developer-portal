#!/bin/bash

docker compose -f docker/compose.test.yaml up chatbot-monitor -d && \
docker exec -it chatbot-monitor-test-chatbot-monitor-1 ./scripts/run.test.sh && \
docker compose -f docker/compose.test.yaml down
