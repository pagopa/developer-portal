#!/bin/bash
docker compose -f docker/compose.yaml -p chatbot up refresh-index create-index
