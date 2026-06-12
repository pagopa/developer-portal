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
    }, {
    header   = "Server"
    override = true
    value    = "None"
  }
]

dns_domain_name = "dev.developer.pagopa.it"

use_custom_certificate = true

cms_app_image_tag = "5e7659d8d91e439e564192b7c1c7a03806d31fb3"

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

create_chatbot            = true
create_dos68k_chatbotapi  = true
ac_integration_is_enabled = true
docs_redirect_is_enabled  = false

chatbot_ecs_monitoring = {
  cpu       = 512
  memory    = 1024
  image_uri = "ghcr.io/langfuse/langfuse:sha-9375250"
  port      = 3000
}

chatbot_models = {
  provider      = "google"
  generation    = "gemini-2.5-flash-lite"
  embeddings    = "gemini-embedding-001"
  reranker      = "semantic-ranker-default-004"
  use_multi_rag = true
}

ecs_chatbotapi_enable_scheduled_scaling = true
