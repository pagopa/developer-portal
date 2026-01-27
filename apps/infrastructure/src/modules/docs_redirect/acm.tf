module "redirect_certificate" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=5d113fa07675fc42237907a621b68ac97109043e" # v6.3.0
  providers = {
    aws = aws.us-east-1
  }

  domain_name = var.domain_to_redirect.from
  zone_id     = aws_route53_zone.docs_pagopa_it.zone_id

  wait_for_validation = false # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  validation_method   = "DNS"
  dns_ttl             = 3600
}