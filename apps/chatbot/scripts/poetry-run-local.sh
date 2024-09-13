#!/bin/bash
conda activate chatbot
PYTHONPATH=`pwd` poetry run fastapi dev src/app/main.py --port 8080
