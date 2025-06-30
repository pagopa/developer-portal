#!/bin/bash
curl -X POST "http://localhost:8080/2015-03-31/functions/function/invocations"  -d '{"resource": "/query-creation", "path": "/queries", "httpMethod": "POST", "requestContext": {}, "body": "{\"question\": \"quali prodotti offre il pagopa?\", \"sessionId\": \"1\", \"queriedAt\": \"\"}", "multiValueQueryStringParameters": null}'
