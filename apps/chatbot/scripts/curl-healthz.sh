#!/bin/bash
curl -X POST "http://localhost:8080/2015-03-31/functions/function/invocations"  -d '{"resource": "/healthz", "path": "/healthz", "httpMethod": "GET", "requestContext": {}, "multiValueQueryStringParameters": null}'
