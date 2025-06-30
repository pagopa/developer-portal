#!/bin/bash
aws dynamodb delete-table \
  --table-name chatbot-local-sessions \
  --endpoint-url http://localhost:8000 \
  --region eu-south-1 \
  --profile dummy
