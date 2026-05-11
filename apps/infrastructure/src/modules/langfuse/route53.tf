resource "aws_route53_record" "langfuse" {
  name    = var.custom_domain_name
  zone_id = var.custom_domain_id
  type    = "A"

  alias {
    name                   = module.langfuse_load_balancer.dns_name
    zone_id                = module.langfuse_load_balancer.zone_id
    evaluate_target_health = true
  }
}
