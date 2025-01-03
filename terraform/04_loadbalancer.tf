# Production Load Balancer
resource "aws_lb" "production" {
  name               = "${var.ecs_cluster_name}-alb"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.load-balancer.id]
  subnets            = [aws_subnet.public-subnet-1.id, aws_subnet.public-subnet-2.id]
}

# Target group client
resource "aws_alb_target_group" "default-target-group" {
  name        = "${var.ecs_cluster_name}-client-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.production-vpc.id
  target_type = "ip"

  health_check {
    path                = var.health_check_path_client
    port                = "traffic-port"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 2
    interval            = 5
    matcher             = "200"
  }
}

# Target group users
resource "aws_alb_target_group" "users-target-group" {
  name        = "${var.ecs_cluster_name}-users-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.production-vpc.id
  target_type = "ip"

  health_check {
    path                = var.health_check_path_users
    port                = "traffic-port"
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 2
    interval            = 5
    matcher             = "200"
  }
}

# Listener (redirects traffic from the load balancer to the client target group)
resource "aws_alb_listener" "ecs-alb-http-listener" {
  load_balancer_arn = aws_lb.production.id
  port              = "80"
  protocol          = "HTTP"
  depends_on        = [aws_alb_target_group.default-target-group]

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.default-target-group.arn
  }
}

// User Listener Rule (redirects traffic from the load balancer to the target group)
resource "aws_lb_listener_rule" "static" {
  listener_arn = aws_alb_listener.ecs-alb-http-listener.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.users-target-group.arn
  }

  condition {
    path_pattern {
      values = ["/users*", "/ping", "/auth*", "/doc", "/swagger"]
    }
  }
}
