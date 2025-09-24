#!/bin/bash

curl -X POST "http://localhost:8082/2015-03-31/functions/function/invocations" \
-H "Content-Type: application/json" \
-d '{}'