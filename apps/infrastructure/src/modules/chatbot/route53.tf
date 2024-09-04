resource "aws_route53_record" "apigw" {
  name    = "api"
  type    = "A"
  zone_id = var.dns_chatbot_hosted_zone.id

  alias {
    evaluate_target_health = true
    name                   = module.api_gateway.domain_name_target_domain_name
    zone_id                = module.api_gateway.domain_name_hosted_zone_id
  }
}