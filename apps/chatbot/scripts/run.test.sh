#!/bin/bash

echo '-=-=-=-=-=-=-= create redis index =-=-=-=-=-=-=-=-'
./scripts/create_redis_index.sh

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
./scripts/dynamodb-init.sh

echo '-=-=-=-=-=-=-=-=-=- run pytest -=-==-=-=-=-=-=-=-=-'
pytest  -p no:warnings