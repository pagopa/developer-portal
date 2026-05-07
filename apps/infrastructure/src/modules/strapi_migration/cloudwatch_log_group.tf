# CloudWatch Log Group for Strapi CMS
module "cms_log_group" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/log-group?ref=bf969da953bdbea229392255d2b36e7b720e917e" # v4.3.0

  name              = "/cms/strapi-v4"
  retention_in_days = 7
}
