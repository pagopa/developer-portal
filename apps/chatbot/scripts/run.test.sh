#!/bin/bash

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
./scripts/dynamodb-init.sh

echo '-=-=-=-=-=-=-= create redis index =-=-=-=-=-=-=-=-'
./scripts/create_redis_index.sh

echo '-=-=-=-=-=-=-=-=-=- run pytest -=-==-=-=-=-=-=-=-=-'
pytest  -p no:warnings
