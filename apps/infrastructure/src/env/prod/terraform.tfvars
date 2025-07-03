aws_region        = "eu-south-1"
environment       = "prod"
github_repository = "pagopa/developer-portal"

tags = {
  CreatedBy   = "Terraform"
  Environment = "prod"
  Owner       = "Devportal"
  Source      = "https://github.com/pagopa/developer-portal"
  CostCenter  = "BD110 - PORTALS and TOOLS"
}

cdn_custom_headers = []

dns_domain_name = "developer.pagopa.it"

dns_delegate_records = {
  dev = [
    "ns-584.awsdns-09.net",
    "ns-1109.awsdns-10.org",
    "ns-135.awsdns-16.com",
    "ns-1781.awsdns-30.co.uk",
  ]
}

use_custom_certificate = true

# CMS Strapi DNS
dns_domain_name_cms = {
  "cms.developer.pagopa.it" = {
    comment = "DNS domain name of the Developer Portal's CMS"
  }
}

rds_cms_scaling_configuration = {
  min_capacity = 1.0
  max_capacity = 3.0
}

create_chatbot            = true
ac_integration_is_enabled = true
docs_redirect_is_enabled  = true
