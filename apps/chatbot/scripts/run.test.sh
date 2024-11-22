#!/bin/bash

echo '-=-=-=-=-=-=-= create redis index =-=-=-=-=-=-=-=-'
./scripts/create_redis_index.sh

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
./scripts/dynamodb-init.sh

#echo '-=-=-=-=-=-=-=-=-= run FastAPI =-==-=-=-=-=-=-=-=-'
#fastapi dev src/app/main.py --port 8080 --host 0.0.0.0
#
echo '-=-=-=-=-=-=-=-=-=- run pytest -=-==-=-=-=-=-=-=-=-'
pytest  -p no:warnings
