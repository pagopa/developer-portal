variable "aws_region" {
  type        = string
  description = "AWS region to create resources. Default Milan"
  default     = "eu-south-1"
}

variable "environment" {
  type        = string
  description = "Environment"
}

variable "environment_information" {
  type = object({
    prefix          = string
    env_short       = string
    location        = string
    domain          = optional(string)
    app_name        = string
    instance_number = string
  })
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}

variable "module" {
  type        = string
  description = "Prefix for resources"
  default     = "cicd"
}

variable "github_repository" {
  type        = string
  description = "The repository where the IaC workflows will run"
}

variable "build_timeout" {
  type        = number
  description = "The timeout for the build process in minutes"
  default     = 480
}

variable "vpc" {
  type = object({
    id                  = string
    cidr_block          = string
    public_subnets      = list(string)
    database_subnets    = list(string)
    private_subnets     = list(string)
    elasticache_subnets = list(string)
  })

  description = "The VPC used to deploy the resources"
}

variable "security_groups" {
  type        = map(string)
  description = "The security groups used to deploy the resources"
}

variable "redis_port" {
  type        = number
  description = "Redis port"
  default     = 6379
}

variable "website_bucket" {
  type = object({
    name = string
    arn  = string
  })

  description = "The S3 bucket used to store the website"
}

variable "website_cdn" {
  type = object({
    arn = string
  })

  description = "The CloudFront distribution used to serve the website"
}

variable "opennext_cdn_distribution_id" {
  type        = string
  description = "The ID of the CloudFront distribution used to serve the OpenNext website"
}

variable "assets_opennext_bucket" {
  type = object({
    name = string
    arn  = string
  })

  description = "The S3 bucket used to store the assets"

}

variable "lambda_code_opennext_bucket" {
  type = object({
    name = string
    arn  = string
  })

  description = "The S3 bucket used to store the lambda code"
}

variable "create_chatbot" {
  type        = bool
  description = "Defines if chatbot should be created"
  default     = false
}

variable "chatbot_env_vars" {
  type        = map(string)
  description = "Chatbot environment variables"
  default     = {}
}

variable "website_is_standalone" {
  type        = bool
  description = "If true, the website will be deployed in standalone mode (Amplify), otherwise static deployment is used (S3 + Cloudfront)"
  default     = false
}


variable "lambda_initializer_arn" {
  type        = string
  description = "The ARN of the lambda initializer function"
}