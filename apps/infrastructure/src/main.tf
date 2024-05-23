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

# Init IaC resources ##########################################################
module "identity" {
  source            = "./identity"
  github_repository = var.github_repository
}

module "website" {
  source = "./_modules/website"

  environment       = var.environment
  github_repository = var.github_repository
  tags              = var.tags

  cdn_custom_headers           = var.cdn_custom_headers
  publish_cloudfront_functions = var.publish_cloudfront_functions
  dns_domain_name              = var.dns_domain_name
  dns_delegate_records         = var.dns_delegate_records
  use_custom_certificate       = var.use_custom_certificate
}

module "cms" {
  source = "./_modules/cms"

  environment     = var.environment
  tags            = var.tags
  dns_domain_name = var.dns_domain_name
}

module "ai" {
  source = "./_modules/ai"

  aws_region  = "eu-west-3"
  environment = var.environment
  tags        = var.tags
}