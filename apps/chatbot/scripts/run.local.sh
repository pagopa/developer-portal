#!/bin/bash

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
./scripts/dynamodb-init-local.sh

echo '-=-=-=-=-=-=-=-=-= run FastAPI =-==-=-=-=-=-=-=-=-'
hypercorn -b 0.0.0.0:8080 --reload src.app.main:app
