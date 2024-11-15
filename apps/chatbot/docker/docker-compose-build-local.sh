#!/bin/bash
docker compose --env-file .env -f docker/compose.yaml -p chatbot build
