[
  {
    "name": "cms-docker",
    "image": "${image}",
    "portMappings": [
      {
        "containerPort": ${container_port}
      }
    ],
	"logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-create-group": "true",
            "awslogs-group": "/ecs/cms-task-def",
            "awslogs-region": "eu-south-1",
            "awslogs-stream-prefix": "ecs"
            },
            "secretOptions": []
    },
    "environment": [
      {
        "name": "NODE_ENV",
        "value": "production"
      },
      {
        "name": "DATABASE_CLIENT",
        "value": "${db_client}"
      },
      {
        "name": "DATABASE_HOST",
        "value": "${db_host}"
      },
      {
        "name": "DATABASE_NAME",
        "value": "${db_name}"
      },
      {
        "name": "AWS_BUCKET_NAME",
        "value": "${bucket_name}"
      },
      {
        "name": "DATABASE_USERNAME",
        "value": "${db_user}"
      },
      {
        "name": "DATABASE_SSL",
        "value": "false"
      },
      {
        "name": "DATABASE_PORT",
        "value": "5432"
      },
      {
        "name": "DATABASE_SCHEMA",
        "value": "public"
      },
      {
        "name": "AWS_REGION",
        "value": "${aws_region}"
      },
	    {
        "name": "AWS_BUCKET_FULL_URL",
        "value": "${bucket_full_url}"
      },
      {
        "name": "CDN_URL",
        "value": "${cdn_url}"
      },
      {
        "name": "AWS_BUCKET_ENDPOINT",
        "value": "${aws_bucket_endpoint}"
      },
      {
        "name": "REPO_OWNER",
        "value": "${repo_owner}"
      },
      {
        "name": "REPO_NAME",
        "value": "${repo_name}"
      },
      {
        "name": "WORKFLOW_ID",
        "value": "${workflow_id}"
      },
      {
        "name": "TARGET_BRANCH",
        "value": "${target_branch}"
      }
    ],
    "secrets" : [
      {
        "name" : "DATABASE_PASSWORD",
        "valueFrom" : "${db_password_arn}"
      },
      {
        "name": "ADMIN_JWT_SECRET",
        "valueFrom": "${admin_jwt_secret_arn}"
      },
      {
        "name": "APP_KEYS",
        "valueFrom": "${app_keys}"
      },
      {
        "name": "API_TOKEN_SALT",
        "valueFrom": "${api_token_salt}"
      },
      {
        "name": "TRANSFER_TOKEN_SALT",
        "valueFrom": "${transfer_token_salt}"
      },
      {
        "name": "JWT_SECRET",
        "valueFrom": "${jwt_secret}"
      },
      {
        "name": "AWS_ACCESS_KEY_ID",
        "valueFrom": "${access_key_id}"
      },
      {
        "name": "AWS_ACCESS_SECRET",
        "valueFrom": "${access_key_secret}"
      },
      {
        "name": "GITHUB_PAT",
        "valueFrom": "${github_pat}"
      }
    ]
  }
]