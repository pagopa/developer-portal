terraform {
  required_version = "~> 1.14.3"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    awscc = {
      source  = "hashicorp/awscc"
      version = "<= 1.10.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = var.tags
  }
}

provider "awscc" {
  region = var.aws_region
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"

  default_tags {
    tags = var.tags
  }
}
provider "aws" {
  alias  = "eu-central-1"
  region = "eu-central-1"

  default_tags {
    tags = var.tags
  }
}

provider "aws" {
  alias  = "eu-west-3"
  region = var.aws_chatbot_region

  default_tags {
    tags = var.tags
  }
}

provider "awscc" {
  alias  = "eu-west-3"
  region = var.aws_chatbot_region
}

data "http" "docs_redirect_cf_function_code" {
  url = "https://raw.githubusercontent.com/pagopa/docs-redirect/refs/heads/main/dist/rewriter.js"

  request_headers = {
    Accept = "text/plain"
  }
}

# Init IaC resources ##########################################################
module "identity" {
  source            = "./identity"
  github_repository = var.github_repository
}

module "core" {
  source = "./modules/core"

  environment = var.environment
  tags        = var.tags

  dns_domain_name      = var.dns_domain_name
  dns_delegate_records = var.dns_delegate_records

  create_chatbot            = var.create_chatbot
  ac_integration_is_enabled = var.ac_integration_is_enabled
}

module "website" {
  source = "./modules/website"

  providers = {
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }

  environment       = var.environment
  github_repository = var.github_repository
  tags              = var.tags

  cdn_custom_headers           = var.cdn_custom_headers
  publish_cloudfront_functions = var.publish_cloudfront_functions
  dns_domain_name              = var.dns_domain_name
  dns_delegate_records         = var.dns_delegate_records
  use_custom_certificate       = var.use_custom_certificate
  hosted_zone_id               = module.core.hosted_zone_id
  ses_domain_identity_arn      = module.core.ses_domain_identity_arn

  website_is_standalone = var.website_is_standalone
  nextjs_version        = "13.4.19"
  create_chatbot        = var.create_chatbot

  environment_information = {
    prefix          = "devportal"
    env_short       = local.env_short[var.environment]
    location        = var.aws_region
    app_name        = "website"
    instance_number = "01"
    region          = var.aws_region
  }

  next_cms_interlan_alb_dns_name = module.cms.internal_load_balancer.dns_name

  next_public_feedback_form_enabled = true

  vpc = {
    id              = module.cms.vpc.id
    private_subnets = module.cms.vpc.private_subnets
  }

  next_public_soap_api_page_active = true


}

module "cms" {
  source = "./modules/cms"

  providers = {
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }

  environment       = var.environment
  github_repository = var.github_cms_repository
  tags              = var.tags

  dns_domain_name           = var.dns_domain_name
  dns_domain_name_cms       = var.dns_domain_name_cms
  hosted_zone_id            = module.core.hosted_zone_id
  ac_integration_is_enabled = var.ac_integration_is_enabled
  ac_base_url_param         = var.ac_integration_is_enabled ? module.active_campaign[0].base_url_param : null
  ac_api_key_param          = var.ac_integration_is_enabled ? module.active_campaign[0].api_key_param : null
  cms_app_image_tag         = var.cms_app_image_tag
  rds_scaling_configuration = var.rds_cms_scaling_configuration
}

import {
  to = module.cms.module.iam_user_cms.aws_iam_user.this[0]
  id = "strapi"
}

module "chatbot" {
  count  = var.create_chatbot ? 1 : 0
  source = "./modules/chatbot"
  providers = {
    aws             = aws
    aws.eu-west-3   = aws.eu-west-3
    awscc           = awscc
    awscc.eu-west-3 = awscc.eu-west-3
    aws.us-east-1   = aws.us-east-1
  }

  aws_chatbot_region = var.aws_chatbot_region
  environment        = var.environment
  tags               = var.tags

  s3_bucket_name_static_content = module.website.website_standalone_bucket.name
  dns_chatbot_hosted_zone       = module.core.dns_chatbot_hosted_zone
  cognito_user_pool             = module.website.cognito_user_pool
  vpc                           = module.cms.vpc
  security_groups               = module.cms.security_groups
  dns_domain_name               = var.dns_domain_name
  ecs_redis                     = var.chatbot_ecs_redis
  github_repository             = var.github_repository
  ecs_monitoring                = var.chatbot_ecs_monitoring
  models                        = var.chatbot_models

  langfuse_service_discovery_endpoint = var.environment == "dev" ? module.langfuse[0].service_discovery_endpoint : null
}

module "cicd" {
  source = "./modules/cicd"

  environment = var.environment
  environment_information = {
    prefix          = "devportal"
    env_short       = local.env_short[var.environment]
    location        = var.aws_region
    app_name        = "cicd"
    instance_number = "01"
  }

  tags = var.tags

  create_chatbot    = var.create_chatbot
  vpc               = module.cms.vpc
  security_groups   = var.create_chatbot ? merge(module.cms.security_groups, module.chatbot[0].security_groups) : module.cms.security_groups
  redis_port        = var.chatbot_ecs_redis.port
  github_repository = var.github_repository

  opennext_cdn_distribution_id = module.website.opennext_cdn_distribution_id

  assets_opennext_bucket      = module.website.assets_opennext_bucket
  website_standalone_bucket   = module.website.website_standalone_bucket
  lambda_code_opennext_bucket = module.website.lambda_code_opennext_bucket
  lambda_initializer_arn      = module.website.lambda_initializer.arn

  website_is_standalone = var.website_is_standalone

  chatbot_env_vars = var.create_chatbot ? module.chatbot[0].lambda_env_variables : {}
}

module "active_campaign" {
  count  = var.ac_integration_is_enabled ? 1 : 0
  source = "./modules/active_campaign"

  environment = var.environment
  tags        = var.tags

  cognito_user_pool         = module.website.cognito_user_pool
  webinar_subscriptions_ddb = module.website.webinar_subscriptions_ddb
}

module "docs_redirect" {
  count  = var.docs_redirect_is_enabled ? 1 : 0
  source = "./modules/docs_redirect"
  providers = {
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }

  cloudfront_function_code = data.http.docs_redirect_cf_function_code.response_body

  environment = var.environment
  tags        = var.tags
}


module "video_streaming" {
  source = "./modules/video_streaming"

  providers = {
    aws           = aws.eu-central-1
    aws.us-east-1 = aws.us-east-1 #
  }

  project_name = "devportal-${local.env_short[var.environment]}"
  ivs_channels = {
    "channell-01" = {
      name = "channel-01"
    }
  }

  custom_domain_name = "video.${var.dns_domain_name}"
  route53_zone_id    = module.core.hosted_zone_id
  environment        = var.environment
  strapi_api_url     = "https://${keys(var.dns_domain_name_cms)[0]}"
}

module "langfuse" {
  source = "./modules/langfuse"

  count = var.environment == "dev" ? 1 : 0

  environment        = var.environment
  region             = var.aws_region
  vpc_id             = module.cms.vpc.id
  private_subnet_ids = module.cms.vpc.private_subnets
  public_subnet_ids  = module.cms.vpc.public_subnets
  custom_domain_id   = module.core.hosted_zone_id
  custom_domain_name = var.dns_domain_name

  # Use the Cognito User Pool created by the Chatbot module
  cognito_user_pool_id           = module.chatbot[0].cognito_user_pool_id
  cognito_user_pool_endpoint     = module.chatbot[0].cognito_user_pool_endpoint
  master_user_password_param_arn = module.chatbot[0].cognito_master_user_password_param_arn
}


# strapi-v5  for testing purposes only
module "strapi_v5" {
  source = "./modules/strapi5"

  count = var.environment == "dev" ? 1 : 0

  providers = {
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }

  environment       = var.environment
  github_repository = var.github_cms_repository
  tags              = var.tags

  dns_domain_name           = var.dns_domain_name
  dns_domain_name_cms       = "strapiv5.${var.dns_domain_name}"
  hosted_zone_id            = module.core.hosted_zone_id
  ac_integration_is_enabled = var.ac_integration_is_enabled
  ac_base_url_param         = var.ac_integration_is_enabled ? module.active_campaign[0].base_url_param : null
  ac_api_key_param          = var.ac_integration_is_enabled ? module.active_campaign[0].api_key_param : null
  cms_app_image_tag         = var.strapi_v5_image_tag
  rds_scaling_configuration = var.rds_cms_scaling_configuration
}
