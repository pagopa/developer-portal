[
  {
    "name": "cms-docker",
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
        "name": "GOOGLE_OAUTH_REDIRECT_URI",
        "value": "${google_oauth_redirect_uri}"
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
        "name": "DEPLOY_WEBSITE_WORKFLOW_ID",
        "value": "${workflow_id}"
      },
      {
        "name": "DEPLOY_WEBSITE_TARGET_BRANCH",
        "value": "${target_branch}"
      },
      {
        "name": "ACTIVE_CAMPAIGN_INTEGRATION_IS_ENABLED",
        "value": "${ac_integration_is_enabled}"
      },
      {
        "name": "SENDER_URL",
        "value": "${ac_sender_url}"
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
        "name": "GITHUB_PERSONAL_ACCESS_TOKEN",
        "valueFrom": "${github_pat}"
      },
      {
        "name": "GOOGLE_GSUITE_HD",
        "valueFrom": "${google_gsuite_hd}"
      },
      {
        "name": "GOOGLE_OAUTH_CLIENT_ID",
        "valueFrom": "${google_oauth_client_id}"
      },
      {
        "name": "GOOGLE_OAUTH_CLIENT_SECRET",
        "valueFrom": "${google_oauth_client_secret}"
      },
      {
        "name": "AC_BASE_URL",
        "valueFrom": "${ac_base_url}"
      },
      {
        "name": "AC_API_KEY",
        "valueFrom": "${ac_api_key}"
      }        
    ]
  }
]
