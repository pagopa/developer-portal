[
  {
    "name": "${container_name}",
    "image": "${image}",
    "portMappings": [
      {
        "containerPort": ${container_port},
        "protocol": "tcp"
      }
    ],
    "environment": [
      { "name": "FRONTEND_URL", "value": "${frontend_url}" },
      { "name": "NOSQL_PROVIDER", "value": "dynamodb" },
      { "name": "DYNAMODB_REGION", "value": "${aws_region}" },
      { "name": "SESSION_EXPIRATION_DAYS", "value": "90" },
      { "name": "VECTOR_DB_PROVIDER", "value": "redis" },
      { "name": "REDIS_PORT", "value": "6379" },
      { "name": "PROVIDER", "value": "google" },
      { "name": "EMBED_DIM", "value": "768" },
      { "name": "EMBED_TASK", "value": "RETRIEVAL_QUERY" },
      { "name": "EMBED_BATCH_SIZE", "value": "100" },
      { "name": "EMBED_RETRIES", "value": "3" },
      { "name": "EMBED_RETRY_MIN_SECONDS", "value": "1.0" },
      { "name": "LOG_LEVEL", "value": "10" },
      { "name": "MODEL_ID", "valueFrom": "${model_id_arn}" },
      { "name": "EMBED_MODEL_ID", "valueFrom": "${embed_model_id_arn}" },
      { "name": "REDIS_HOST", "valueFrom": "${redis_host_arn}" }
    ],
    "secrets": [
      { "name": "MODEL_API_KEY", "valueFrom": "${model_api_key_arn}" }
    ],
    "linuxParameters": {
      "initProcessEnabled": true
    },
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${log_group}",
        "awslogs-region": "${aws_region}",
        "awslogs-stream-prefix": "ecs-dos68k-chatbotapi"
      },
      "secretOptions": []
    }
  }
]
