terraform {
  required_providers {
    awscc = {
      source  = "hashicorp/awscc"
      version = ">= 1.84.0"
    }

    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.33.0"
      configuration_aliases = [aws.service]
    }

    random = {
      source = "hashicorp/random"
    }

    archive = {
      source = "hashicorp/archive"
    }

    time = {
      source = "hashicorp/time"
    }
  }
}
