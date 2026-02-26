#!/bin/bash
docker compose -f docker/compose.yaml logs api sqs_monitor_listener monitor sqs_evaluate_listener evaluate -f
