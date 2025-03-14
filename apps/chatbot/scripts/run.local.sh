#!/bin/bash

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
# ./scripts/dynamodb-init.sh

echo '-=-=-=-=-=-=-= create redis index =-=-=-=-=-=-=-=-'
# ./scripts/create_redis_index.sh

echo '-=-=-=-=-=-=-=-=-= run FastAPI =-==-=-=-=-=-=-=-=-'
# fastapi dev src/app/main.py --port 8080 --host 0.0.0.0
# uvicorn src.app.main:app --host=0.0.0.0 --port=8080 --log-level=info --loop=asyncio
hypercorn -b 0.0.0.0:8080 --reload src.app.main:app
