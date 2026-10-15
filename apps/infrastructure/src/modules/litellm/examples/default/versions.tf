terraform {
  required_version = "~> 1.16.4"

  backend "s3" {
    bucket       = "terraform-backend-20230531161049141900000001"
    key          = "dev/litellm/examples/default/tfstate"
    region       = "eu-south-1"
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.67.0"
    }

    awscc = {
      source  = "hashicorp/awscc"
      version = "~> 1.84.0"
    }
  }
}