terraform {
  required_version = "1.5.7"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.33.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = var.tags
  }
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"

  default_tags {
    tags = var.tags
  }
}

provider "aws" {
  alias  = "chatbot_region"
  region = var.aws_chatbot_region

  default_tags {
    tags = var.tags
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
  source = "./modules/chatbot"
  providers = {
    aws           = aws
    aws.chatbot_region = aws.chatbot_region
  }

  aws_chatbot_region = var.aws_chatbot_region
  environment = var.environment
  tags        = var.tags
}
