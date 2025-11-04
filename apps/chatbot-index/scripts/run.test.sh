#!/bin/bash

./scripts/s3-init.sh > /dev/null 2>&1

poetry run pytest src
