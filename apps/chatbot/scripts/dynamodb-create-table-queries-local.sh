#!/bin/bash
aws dynamodb create-table \
	--table-name chatbot-local-queries \
	--key-schema \
	  AttributeName=sessionId,KeyType=HASH \
	  AttributeName=id,KeyType=RANGE \
	--attribute-definitions \
	  AttributeName=id,AttributeType=S \
	  AttributeName=sessionId,AttributeType=S \
	--table-class STANDARD \
	--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
	--endpoint-url http://localhost:8000 \
  --region eu-south-1 \
  --profile dummy
