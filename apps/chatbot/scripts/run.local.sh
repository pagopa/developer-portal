#!/bin/bash
set -euo pipefail

echo '-=-=-=-= run hypercorn'
hypercorn -b 0.0.0.0:8080 --reload src.app.main:app
