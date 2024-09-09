resource "aws_route53_record" "apigw" {
  name    = "api"
  type    = "A"
  zone_id = var.dns_chatbot_hosted_zone.id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.domain_name.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.domain_name.cloudfront_zone_id
  }
}