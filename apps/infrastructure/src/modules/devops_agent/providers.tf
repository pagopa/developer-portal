terraform {
  required_providers {
    awscc = {
      source  = "hashicorp/awscc"
      version = ">= 1.105.0"
    }

    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.67.0"
    }

    time = {
      source  = "hashicorp/time"
      version = ">= 0.14.0"
    }
  }
}
