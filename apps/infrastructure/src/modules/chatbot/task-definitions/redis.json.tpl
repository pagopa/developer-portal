[
  {
    "name": "${name}",
    "image": "${image}",
    "mountPoints": ${efs_mount_points},
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
            "awslogs-stream-prefix": "ecs-chatbot-redis"
            },
            "secretOptions": []
    }
  }
]
