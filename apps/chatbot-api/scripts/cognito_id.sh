#!/bin/bash
aws cognito-idp create-user-pool --pool-name test-pool --endpoint-url http://motoserver:3001 --region eu-south-1|jq -r '.UserPool.Id'
