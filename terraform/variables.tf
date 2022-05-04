# core

variable "region" {
  description = "The AWS region to create resources in."
  default     = "us-west-1"
}

# load balancer

variable "health_check_path_client" {
  description = "Health check path for the default target group"
  default     = "/"
}
variable "health_check_path_users" {
  description = "Health check path for the default target group"
  default     = "/ping"
}

# ecs

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  default     = "flask-react-fargate"
}
variable "docker_image_url_client" {
  description = "Docker client image to run in the ECS cluster"
  default     = "<AWS_ACCOUNT_ID>.dkr.ecr.us-west-1.amazonaws.com/test-driven-client-fargate:prod"
}
variable "docker_image_url_users" {
  description = "Docker users image to run in the ECS cluster"
  default     = "<AWS_ACCOUNT_ID>.dkr.ecr.us-west-1.amazonaws.com/test-driven-users-fargate:prod"
}
variable "app_count" {
  description = "Number of Docker containers to run"
  default     = 1
}
variable "secret_key" {
  description = "Flask Secret Key"
  default     = "foobar"
}

# logs

variable "log_retention_in_days" {
  default = 30
}

# key pair

variable "ssh_pubkey_file" {
  description = "Path to an SSH public key"
  default     = "~/.ssh/id_rsa.pub"
}


# rds

variable "rds_db_name" {
  description = "RDS database name"
  default     = "api_prod"
}
variable "rds_username" {
  description = "RDS database username"
  default     = "webapp"
}
variable "rds_password" {
  description = "RDS database password"
}
variable "rds_instance_class" {
  description = "RDS instance type"
  default     = "db.t4g.micro"
}
