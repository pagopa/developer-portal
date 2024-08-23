module "ssl_certificate" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-acm.git?ref=8d0b22f1f242a1b36e29b8cb38aaeac9b887500d" # v5.0.0
  providers = {
    aws = aws.eu-south-1
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