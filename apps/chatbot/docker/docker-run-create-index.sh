#!/bin/bash
docker compose -f docker/compose.yaml -p chatbot run api \
  python src/modules/create_vector_index.py --params config/params.yaml
