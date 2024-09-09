terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.33.0"
      configuration_aliases = [aws.eu-west-3, aws.us-east-1]
    }

    awscc = {
      source                = "hashicorp/awscc"
      version               = "1.10.0"
      configuration_aliases = [awscc.eu-west-3]
    }
  }
}