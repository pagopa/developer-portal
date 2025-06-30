#!/bin/bash
docker build -t fastapi -f docker/app.Dockerfile --platform linux/amd64 .
