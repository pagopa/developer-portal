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
  project = format("%s-%s", var.app_name, var.env_short)
}

data "aws_caller_identity" "current" {}
