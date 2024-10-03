#!/bin/bash
docker run --name fastapi-local --rm -p 8080:8080 --env-file=.env fastapi-local
