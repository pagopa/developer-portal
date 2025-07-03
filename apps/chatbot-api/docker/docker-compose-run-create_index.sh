#!/bin/bash
docker compose -f docker/compose.yaml -p chatbot-create-index run create-redis-index -d

