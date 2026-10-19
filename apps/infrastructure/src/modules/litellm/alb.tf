resource "aws_lb" "this" {
  name               = local.name
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.alb.id]
  subnets            = local.public_subnet_ids
  idle_timeout       = 120

  lifecycle {
    precondition {
      condition     = length(local.public_subnet_ids) >= 2
      error_message = "The ALB needs at least 2 public subnets in different AZs. Set public_subnet_ids when using vpc_id, or list at least 2 azs."
    }
  }

  tags = local.tags
}

locals {
  tls_enabled = var.enable_https != null ? var.enable_https : var.acm_certificate_arn != ""
}

resource "aws_lb_target_group" "gateway" {
  name        = "${local.name}-gateway"
  port        = 4000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = local.vpc_id

  health_check {
    path                = "/health/readiness"
    matcher             = "200-299"
    interval            = 30
    timeout             = 10
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  deregistration_delay = 30
  tags                 = local.tags
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = local.tls_enabled ? "redirect" : "forward"

    dynamic "redirect" {
      for_each = local.tls_enabled ? [1] : []
      content {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }

    target_group_arn = local.tls_enabled ? null : aws_lb_target_group.gateway.arn
  }

  lifecycle {
    precondition {
      condition     = local.tls_enabled || var.allow_plaintext_alb
      error_message = "Set acm_certificate_arn to enable TLS, or allow_plaintext_alb = true to opt into HTTP-only."
    }
  }

  tags = local.tags
}

resource "aws_lb_listener" "https" {
  count             = local.tls_enabled ? 1 : 0
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.gateway.arn
  }

  lifecycle {
    precondition {
      condition     = var.acm_certificate_arn != ""
      error_message = "acm_certificate_arn must be provided when enable_https is true."
    }
  }

  tags = local.tags
}
