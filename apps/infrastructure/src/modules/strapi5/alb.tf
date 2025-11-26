## Application Load Balancer for CMS Strapi
module "cms_load_balancer" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "cms-load-balancer"
  vpc_id                = data.aws_vpc.cms.id
  subnets               = data.aws_subnets.public.ids
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
      vpc_id      = data.aws_vpc.cms.id

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


# CMS Internal Load Balancer
module "cms_load_balancer_internal" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-alb.git?ref=3e9c6cbaf4c1d858c3bbee6f086f0c8ef17522ab" # v9.6.0

  name                  = "cms-load-balancer-internal"
  vpc_id                = data.aws_vpc.cms.id
  subnets               = data.aws_subnets.private.ids
  security_groups       = [aws_security_group.cms_lb.id]
  internal              = true
  create_security_group = false
  load_balancer_type    = "application"

  listeners = {
    front_end_http = {
      port     = 8080
      protocol = "HTTP"
      forward = {
        target_group_key = "cms-target-group-internal"
      }
    }
  }

  target_groups = {
    cms-target-group-internal = {
      name        = "cms-target-group-internal"
      protocol    = "HTTP"
      port        = var.cms_app_port
      target_type = "ip"
      vpc_id      = data.aws_vpc.cms.id

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

# Private Route53 zone for internal DNS
resource "aws_route53_zone" "internal" {
  name = "internal.${var.dns_domain_name}"
  vpc {
    vpc_id = data.aws_vpc.cms.id
  }
}


# DNS record for the internal load balancer
resource "aws_route53_record" "cms_internal" {
  zone_id = aws_route53_zone.internal.zone_id
  name    = "cms"
  type    = "A"
  alias {
    name                   = module.cms_load_balancer_internal.dns_name
    zone_id                = module.cms_load_balancer_internal.zone_id
    evaluate_target_health = true
  }
}