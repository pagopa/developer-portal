#!/bin/bash
docker compose -f docker/compose.test.yaml -p chatbot-test run api-test
