#!/bin/bash
docker compose -f docker/compose.yaml -p chatbot-create-vector-index run create-vector-index -d
# install httpie with `pip install httpie`
http POST localhost:8082/2015-03-31/functions/function/invocations operation=create_vector_index
