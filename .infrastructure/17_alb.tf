## Application Load Balancer for CMS Strapi
module "cms_load_balancer" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "cms-load-balancer"
  vpc_id                = module.vpc.vpc_id
  subnets               = module.vpc.public_subnets
  security_groups       = [aws_security_group.cms_lb.id]
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
      certificate_arn = module.cms_ssl_certificate.acm_certificate_arn
      forward = {
        target_group_key = "cms-target-group"
      }
    }
  }

  target_groups = {
    cms-target-group = {
      name        = "cms-target-group"
      protocol    = "HTTP"
      port        = var.cms_app_port
      target_type = "ip"
      vpc_id      = module.vpc.vpc_id

      health_check = {
        healthy_threshold   = "3"
        interval            = "30"
        protocol            = "HTTP"
        matcher             = "204"
        timeout             = "3"
        path                = "/_health"
        unhealthy_threshold = "2"
      }
      create_attachment = false
    }
  }
}