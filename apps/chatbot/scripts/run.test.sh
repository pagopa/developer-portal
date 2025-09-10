#!/bin/bash

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
./scripts/dynamodb-init-test.sh

# echo '-=-=-=-=-=-=-=-=-=- run pytest -=-==-=-=-=-=-=-=-=-'
# poetry run pytest src/app/

echo '-=-=-=-=-=-=-=-=-= run FastAPI =-==-=-=-=-=-=-=-=-'
hypercorn -b 0.0.0.0:8080 --reload src.app.main:app