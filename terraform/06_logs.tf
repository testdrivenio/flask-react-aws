resource "aws_cloudwatch_log_group" "client-log-group" {
  name              = "/ecs/client-app"
  retention_in_days = var.log_retention_in_days
}

resource "aws_cloudwatch_log_stream" "client-log-stream" {
  name           = "client-app-log-stream"
  log_group_name = aws_cloudwatch_log_group.client-log-group.name
}

resource "aws_cloudwatch_log_group" "users-log-group" {
  name              = "/ecs/users-app"
  retention_in_days = var.log_retention_in_days
}

resource "aws_cloudwatch_log_stream" "users-log-stream" {
  name           = "users-app-log-stream"
  log_group_name = aws_cloudwatch_log_group.users-log-group.name
}
