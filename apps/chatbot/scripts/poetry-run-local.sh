#!/bin/bash
conda activate chatbot
PYTHONPATH=$PWD poetry run fastapi dev src/app/main.py --port 8080
