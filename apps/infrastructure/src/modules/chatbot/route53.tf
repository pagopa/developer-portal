resource "aws_route53_record" "apigw" {
  name    = "api"
  type    = "A"
  zone_id = var.dns_chatbot_hosted_zone.id

  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.domain_name.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.domain_name.regional_zone_id
  }
}

resource "aws_route53_record" "monitoring" {
  name    = "mon"
  type    = "A"
  zone_id = var.dns_chatbot_hosted_zone.id

  alias {
    name                   = module.langfuse.load_balancer.dns_name
    zone_id                = module.langfuse.load_balancer.zone_id
    evaluate_target_health = true
  }
}


resource "aws_route53_zone" "chatbot_internal" {
  name = "internal.${var.dns_chatbot_hosted_zone.name}"
  vpc {
    vpc_id = var.vpc.id
  }
}