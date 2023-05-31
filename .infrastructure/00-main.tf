terraform {
  required_version = "1.2.8"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.67.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = var.tags
  }
}

locals {
  project = format("%s-%s", substr(var.environment, 0, 1), var.app_name)
}

# Init IaC resources ##########################################################
module "identity" {
  source            = "./identity"
  github_repository = var.github_repository
  tags              = var.tags
}
