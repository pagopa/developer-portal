[
  {
    "name": "${container_name}",
    "image": "${image}",
    "portMappings": [
      {
        "containerPort": ${container_port}
      }
    ],
  "linuxParameters": {
    "initProcessEnabled": true
  },
	"logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": "${log_group}",
            "awslogs-region": "${aws_region}",
            "awslogs-stream-prefix": "${container_name}"
            },
            "secretOptions": []
    },
  "environment": [
      {
        "name": "NEXTAUTH_URL",
        "value": "${base_url}"
      },
      {
        "name": "AUTH_COGNITO_ALLOW_ACCOUNT_LINKING",
        "value": "true"
      },
      {
        "name": "LANGFUSE_ENABLE_EXPERIMENTAL_FEATURES",
        "value": "false"
      },
      {
        "name": "LANGFUSE_INIT_ORG_ID",
        "value": "pagopa"
      },
      {
        "name": "LANGFUSE_INIT_ORG_NAME",
        "value": "PagoPA"
      },
      {
        "name": "LANGFUSE_INIT_PROJECT_ID",
        "value": "cloudgaapai-discovery"
      },
      {
        "name": "LANGFUSE_INIT_PROJECT_NAME",
        "value": "CloudGaapAI - Discovery"
      },
      {
        "name": "AUTH_DISABLE_USERNAME_PASSWORD",
        "value": "true"
      },
      {
        "name": "AUTH_DISABLE_SIGNUP",
        "value": "false"
      },
      {
        "name": "LANGFUSE_INIT_USER_EMAIL",
        "value": "${master_user_email}"
      },
      {
        "name": "LANGFUSE_INIT_USER_NAME",
        "value": "${master_user_name}"
      }
    ],
    "secrets": [
      {
        "name": "DATABASE_URL",
        "valueFrom": "${postgres_url}"
      },
      {
        "name" : "AUTH_COGNITO_CLIENT_ID",
        "valueFrom" : "${client_id}"
      },
      {
        "name" : "AUTH_COGNITO_CLIENT_SECRET",
        "valueFrom" : "${client_secret}"
      },
      {
        "name" : "AUTH_COGNITO_ISSUER",
        "valueFrom" : "${issuer}"
      },
      {
        "name" : "LANGFUSE_INIT_USER_PASSWORD",
        "valueFrom" : "${master_user_password}"
      },
      {
        "name": "ENCRYPTION_KEY",
        "valueFrom": "${encryption_key}"
      },
      {
        "name": "SALT",
        "valueFrom": "${salt}"
      },
      {
        "name": "NEXTAUTH_SECRET",
        "valueFrom": "${nextauth_secret}"
      },
      {
        "name": "LANGFUSE_INIT_PROJECT_PUBLIC_KEY",
        "valueFrom": "${langfuse_public_key}"
      },
      {
        "name": "LANGFUSE_INIT_PROJECT_SECRET_KEY",
        "valueFrom": "${langfuse_secret_key}"
      }
    ]
  }
]
