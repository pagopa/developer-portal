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

cms_app_image_tag = "3898d70cf2edac6a07682cf9e26f5df560d90418"

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

chatbot_models = {
  provider   = "google"
  generation = "gemini-2.0-flash"
  embeddings = "text-embedding-004"
  reranker   = "semantic-ranker-512-003"
}




docs_redirect_is_enabled = true
