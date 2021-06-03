[
  {
    "name": "client-app",
    "image": "${docker_image_url_client}",
    "essential": true,
    "links": [],
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 80,
        "protocol": "tcp"
      }
    ],
    "environment": [],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/client-app",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "client-app-log-stream"
      }
    }
  }
]
