## Application Load Balancer for Chatbot Monitoring tool
module "monitoring_load_balancer" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "${local.prefix}-monitoring-alb"
  vpc_id                = var.vpc.id
  subnets               = var.vpc.public_subnets
  security_groups       = [aws_security_group.monitoring_lb.id]
  internal              = false
  create_security_group = false
  load_balancer_type    = "application"

  listeners = {
    front_end_http = {
      port     = 80
      protocol = "HTTP"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
    front_end_https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = module.ssl_certificate.acm_certificate_arn
      forward = {
        target_group_key = "monitoring-target-group"
      }
    }
  }

  target_groups = {
    monitoring-target-group = {
      name        = "monitoring-target-group"
      protocol    = "HTTP"
      port        = var.ecs_monitoring.port
      target_type = "ip"
      vpc_id      = var.vpc.id

      health_check = {
        healthy_threshold   = "3"
        interval            = "30"
        protocol            = "HTTP"
        matcher             = "200"
        timeout             = "3"
        path                = "/api/public/ready"
        unhealthy_threshold = "2"
      }
      create_attachment = false
    }
  }
}

### AWS Security Group ###
# Traffic to the DB should only come from ECS
# Traffic to the ECS cluster should only come from the ALB

resource "aws_security_group" "monitoring_lb" {
  name        = "${local.prefix}-monitoring-lb"
  description = "Ingress - Load Balancer"
  vpc_id      = var.vpc.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}

## Application Load Balancer for Chatbot Monitoring tool internally
module "internal_monitoring_load_balancer" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "${local.prefix}-int-monitoring-alb"
  vpc_id                = var.vpc.id
  subnets               = var.vpc.private_subnets
  security_groups       = [aws_security_group.monitoring_lb.id]
  internal              = true
  create_security_group = false
  load_balancer_type    = "application"

  listeners = {
    front_end_http = {
      port     = 80
      protocol = "HTTP"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
    front_end_https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = module.internal_ssl_certificate.acm_certificate_arn
      forward = {
        target_group_key = "internal-monitoring-target-group"
      }
    }
  }

  target_groups = {
    internal-monitoring-target-group = {
      name        = "internal-monitoring-target-group"
      protocol    = "HTTP"
      port        = var.ecs_monitoring.port
      target_type = "ip"
      vpc_id      = var.vpc.id

      health_check = {
        healthy_threshold   = "3"
        interval            = "30"
        protocol            = "HTTP"
        matcher             = "200"
        timeout             = "3"
        path                = "/api/public/ready"
        unhealthy_threshold = "2"
      }
      create_attachment = false
    }
  }
}

### AWS Security Group ###
# Traffic to Langfuse comes only from the chatbot lambda

resource "aws_security_group" "internal_monitoring_lb" {
  name        = "${local.prefix}-internal-monitoring-lb"
  description = "Ingress - Load Balancer"
  vpc_id      = var.vpc.id

  ingress {
    protocol        = "tcp"
    from_port       = 80
    to_port         = 80
    security_groups = [aws_security_group.lambda.id]
  }

  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    security_groups = [aws_security_group.lambda.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # https://registry.terraform.io/providers/hashicorp/aws/5.35.0/docs/resources/security_group#recreating-a-security-group
  lifecycle {
    create_before_destroy = true
  }
}