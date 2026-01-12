module "ssl_certificate" {
  source      = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=5d113fa07675fc42237907a621b68ac97109043e" # v6.3.0
  domain_name = "dummy.${var.dns_chatbot_hosted_zone.name}"
  zone_id     = var.dns_chatbot_hosted_zone.id

  subject_alternative_names = [
    "*.${var.dns_chatbot_hosted_zone.name}"
  ]

  wait_for_validation = false # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  validation_method   = "DNS"
  dns_ttl             = 3600
}

module "ssl_certificate_us_east_1" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=5d113fa07675fc42237907a621b68ac97109043e" # v6.3.0
  providers = {
    aws = aws.us-east-1
  }

  domain_name = "dummy.${var.dns_chatbot_hosted_zone.name}"
  zone_id     = var.dns_chatbot_hosted_zone.id

  subject_alternative_names = [
    "*.${var.dns_chatbot_hosted_zone.name}"
  ]

  wait_for_validation = false # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  validation_method   = "DNS"
  dns_ttl             = 3600
}

module "internal_ssl_certificate" {
  source      = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=5d113fa07675fc42237907a621b68ac97109043e" # v6.3.0
  domain_name = "dummy.${aws_route53_zone.chatbot_internal.name}"
  zone_id     = var.dns_chatbot_hosted_zone.id

  subject_alternative_names = [
    "*.${aws_route53_zone.chatbot_internal.name}"
  ]

  wait_for_validation = false # https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174
  validation_method   = "DNS"
  dns_ttl             = 3600
}
