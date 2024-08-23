module "load_balancer" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "${local.prefix}-load-balancer"
  vpc_id                = module.vpc.vpc_id
  subnets               = module.vpc.public_subnets
  security_groups       = [aws_security_group.lb.id]
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

      rules = {
        authenticated = {
          actions = [
            {
              type                       = "authenticate-cognito"
              on_unauthenticated_request = "deny"
              session_cookie_name        = "session-chatbot"
              session_timeout            = 3600
              user_pool_arn              = var.cognito_user_pool.arn
              user_pool_client_id        = var.cognito_user_pool.client_id
              user_pool_domain           = var.cognito_user_pool.domain
            },
            {
              type             = "forward"
              target_group_key = "chatbot-lambda"
            }
          ]

          conditions = [{
            host_header = {
              values = [var.dns_chatbot_hosted_zone.name]
            }
          }]
        }
      }
    }
    front_end_https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = module.alb_ssl_certificate.acm_certificate_arn
      forward = {
        target_group_key = "chatbot-lambda"
      }
    }
  }

  target_groups = {
    chatbot-lambda = {
      name_prefix              = "chatbot-lambda-"
      target_id                = module.lambda_function.lambda_function_arn
      attach_lambda_permission = true
    }
  }
}

resource "aws_security_group" "lb" {
  name        = "${local.prefix}-${var.module}-load-balancer"
  description = "Ingress - Load Balancer"
  vpc_id      = module.vpc.vpc_id

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
