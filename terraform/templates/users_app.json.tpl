[
  {
    "name": "users-app",
    "image": "${docker_image_url_users}",
    "essential": true,
    "links": [],
    "portMappings": [
      {
        "containerPort": 5000,
        "hostPort": 5000,
        "protocol": "tcp"
      }
    ],
    "command": [
      "gunicorn",
      "manage:app",
      "-b",
      ":5000",
      "-w",
      "3",
      "--log-level=debug"
    ],
    "entrypoint": [
      "/usr/src/app/entrypoint.prod.sh"
    ],
    "environment": [
      {
        "name": "APP_SETTINGS",
        "value": "src.config.ProductionConfig"
      },
      {
        "name": "DATABASE_TEST_URL",
        "value": "postgres://postgres:postgres@api-db:5432/api_test"
      },
      {
        "name": "SECRET_KEY",
        "value": "${secret_key}"
      },
      {
        "name": "DATABASE_URL",
        "value": "${database_url}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/users-app",
        "awslogs-region": "${region}",
        "awslogs-stream-prefix": "users-app-log-stream"
      }
    }
  }
]
