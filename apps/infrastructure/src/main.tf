terraform {
  required_version = "1.5.7"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.64.0"
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

  create_chatbot = var.create_chatbot
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
}

module "cms" {
  source = "./modules/cms"

  providers = {
    aws           = aws
    aws.us-east-1 = aws.us-east-1
  }

  environment       = var.environment
  github_repository = var.github_repository
  tags              = var.tags

  dns_domain_name     = var.dns_domain_name
  dns_domain_name_cms = var.dns_domain_name_cms
  hosted_zone_id      = module.core.hosted_zone_id
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

  website_bucket_name     = module.website.website_bucket.name
  dns_chatbot_hosted_zone = module.core.dns_chatbot_hosted_zone
  cognito_user_pool       = module.website.cognito_user_pool
  vpc                     = module.cms.vpc
  security_groups         = module.cms.security_groups
  dns_domain_name         = var.dns_domain_name
  ecs_redis               = var.chatbot_ecs_redis
  github_repository       = var.github_repository
}

module "cicd" {
  source = "./modules/cicd"

  environment = var.environment
  tags        = var.tags

  create_chatbot    = var.create_chatbot
  vpc               = module.cms.vpc
  security_groups   = var.create_chatbot ? merge(module.cms.security_groups, module.chatbot[0].security_groups) : module.cms.security_groups
  redis_port        = var.chatbot_ecs_redis.port
  github_repository = var.github_repository

  website_bucket = module.website.website_bucket
  website_cdn    = module.website.website_cdn
}
