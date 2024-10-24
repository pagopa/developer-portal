#!/bin/bash
aws dynamodb create-table \
	--table-name chatbot-local-sessions \
	--key-schema \
	  AttributeName=userId,KeyType=HASH \
	  AttributeName=id,KeyType=RANGE \
	--attribute-definitions \
	  AttributeName=id,AttributeType=S \
	  AttributeName=userId,AttributeType=S \
	  AttributeName=createdAt,AttributeType=S \
  --local-secondary-indexes '[
    {
      "IndexName": "SessionsByCreatedAtIndex",
      "KeySchema": [
        {
          "AttributeName": "userId",
          "KeyType": "HASH"
        },
        {
          "AttributeName": "createdAt",
          "KeyType": "RANGE"
        }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ]' \
	--table-class STANDARD \
	--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
	--endpoint-url http://localhost:8000 \
  --region eu-south-1 \
  --profile dummy
