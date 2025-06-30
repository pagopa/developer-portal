#!/bin/bash
aws dynamodb scan \
  --table-name chatbot-local-sessions \
  --region eu-south-1 \
  --endpoint-url http://dynamodb:8000
