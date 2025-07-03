#!/bin/bash
docker build -t chatbot-core -f docker/lambda.main.Dockerfile --platform linux/amd64 .
