resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "Website-${var.environment}"
  dashboard_body = templatefile("${path.module}/dashboards/cloudwatch_dashboard.json.tpl", {
    domain_name                   = var.dns_domain_name,
    aws_region                    = var.aws_region,
    website_distribution_id       = module.opennext.cloudfront.distribution_id,
    static_contents_domain_name   = aws_cloudfront_distribution.static_contents.domain_name,
    opennext_lambda_function_name = module.opennext.server.lambda_function.name,
    environment                   = var.environment,
  })
}
