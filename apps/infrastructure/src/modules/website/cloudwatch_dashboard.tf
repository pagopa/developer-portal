resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "Website-${var.environment}"
  dashboard_body = templatefile("${path.module}/dashboards/cloudwatch_dashboard.json.tpl", {
    domain_name                     = var.dns_domain_name,
    aws_region                      = var.aws_region,
    website_distribution_id         = module.opennext.cloudfront.distribution_id,
    static_contents_distribution_id = aws_cloudfront_distribution.static_contents.id,
    static_contents_domain_name     = local.dns_domain_name_static_contents
    opennext_lambda_function_name   = module.opennext.server.lambda_function.name,
    environment                     = var.environment,
  })
}
