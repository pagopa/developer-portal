aws_region        = "eu-south-1"
environment       = "dev"
github_repository = "pagopa/developer-portal"

tags = {
  CreatedBy   = "Terraform"
  Environment = "dev"
  Owner       = "Devportal"
  Source      = "https://github.com/pagopa/developer-portal"
  CostCenter  = "BD110 - PORTALS and TOOLS"
}

cdn_custom_headers = [
  {
    header   = "X-Robots-Tag"
    override = true
    value    = "noindex"
  }
]

dns_domain_name = "dev.developer.pagopa.it"

use_custom_certificate = true

# CMS Strapi DNS
dns_domain_name_cms = {
  "cms.dev.developer.pagopa.it" = {
    comment = "DNS domain name of the Developer Portal's CMS"
  }
}

rds_cms_scaling_configuration = {
  min_capacity = 1.0
  max_capacity = 3.0
}

cms_app_cpu    = "512"
cms_app_memory = "1024"


chatbot_ecs_monitoring = {
  cpu    = 256
  memory = 512
}

chatbot_ecs_redis = {
  cpu    = 1024
  memory = 6144
}

create_chatbot            = true
ac_integration_is_enabled = true
docs_redirect_is_enabled  = false

