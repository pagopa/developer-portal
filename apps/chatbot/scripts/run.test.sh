#!/bin/bash

echo '-=-=-=-= run pytest'
rm -rf .pytest_cache 2>/dev/null || true
pytest src/app
