module "langfuse_load_balancer" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "${local.prefix}-alb"
  vpc_id                = var.vpc_id
  subnets               = var.public_subnet_ids
  security_groups       = [aws_security_group.lb.id]
  internal              = false
  create_security_group = false
  load_balancer_type    = "application"

  listeners = {
    web_http = {
      port     = 80
      protocol = "HTTP"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
    web_https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = module.langfuse_ssl_certificate.acm_certificate_arn
      forward = {
        target_group_key = "web-target-group"
      }
    }
  }

  target_groups = {
    web-target-group = {
      name        = "web-target-group"
      protocol    = "HTTP"
      port        = 3000
      target_type = "ip"
      vpc_id      = var.vpc_id

      health_check = {
        healthy_threshold   = "3"
        interval            = "30"
        protocol            = "HTTP"
        matcher             = "200"
        timeout             = "3"
        path                = "/api/public/health"
        unhealthy_threshold = "2"
      }
      create_attachment = false
    }
  }
}
