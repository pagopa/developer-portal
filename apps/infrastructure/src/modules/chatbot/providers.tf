terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.33.0"
    }

    awscc = {
      source  = "hashicorp/awscc"
      version = "1.10.0"
    }
  }
}