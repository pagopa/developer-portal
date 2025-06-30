#!/bin/bash

echo '-=-=-=-=-=-=-=-=-= init DynamoDB -==-=-=-=-=-=-=-=-'
./scripts/dynamodb-init-test.sh

echo '-=-=-=-=-=-=-=-=-= init Redis -==-=-=-=-=-=-=-=-'
poetry run python src/modules/create_vector_index.py --params config/params.yaml

echo '-=-=-=-=-=-=-=-=-=- run pytest -=-==-=-=-=-=-=-=-=-'
poetry run pytest src/app/
