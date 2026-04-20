aws_region        = "eu-south-1"
environment       = "uat"
github_repository = "pagopa/developer-portal"

tags = {
  CreatedBy   = "Terraform"
  Environment = "uat"
  Owner       = "Devportal"
  Source      = "https://github.com/pagopa/developer-portal"
  CostCenter  = "BD110 - PORTALS and TOOLS"
}

cdn_custom_headers = [
  {
    header   = "X-Robots-Tag"
    override = true
    value    = "noindex"
  },
  {
    header   = "Server"
    override = true
    value    = "None"
  }
]

dns_domain_name = "uat.developer.pagopa.it"

use_custom_certificate = true

cms_app_image_tag   = "be063f4cb6aa1e5d37ba16d02568702129721543"
strapi_v4_image_tag = "98d394aba2b711f912bad89d9361aec052ad46df"

# CMS Strapi DNS
dns_domain_name_cms = {
  "cms.uat.developer.pagopa.it" = {
    comment = "DNS domain name of the Developer Portal's CMS"
  }
}

create_chatbot            = true
ac_integration_is_enabled = false
docs_redirect_is_enabled  = false
website_is_standalone     = true

chatbot_models = {
  provider      = "google"
  generation    = "gemini-2.5-flash-lite"
  embeddings    = "gemini-embedding-001"
  reranker      = "semantic-ranker-default-004"
  use_multi_rag = true
}