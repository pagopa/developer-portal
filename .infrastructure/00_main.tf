terraform {
  required_version = "1.5.7"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.32.1"
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
