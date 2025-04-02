#!/bin/bash
docker compose -f docker/compose.yaml -p chatbot --remove-orphans up api
