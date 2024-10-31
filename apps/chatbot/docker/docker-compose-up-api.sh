#!/bin/bash
docker compose --env-file .env.local -f docker/compose.yaml -p chatbot up api
