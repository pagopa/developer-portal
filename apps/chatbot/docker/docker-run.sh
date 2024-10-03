#!/bin/bash
docker run \
  --name fastapi \
  --rm -p 8080:8080 \
  --platform linux/amd64 \
  --env-file=.env \
  fastapi 
