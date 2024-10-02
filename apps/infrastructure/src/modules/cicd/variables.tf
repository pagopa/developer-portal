variable "aws_region" {
  type        = string
  description = "AWS region to create resources. Default Milan"
  default     = "eu-south-1"
}

variable "environment" {
  type        = string
  description = "Environment"
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

variable "create_chatbot" {
  type        = bool
  description = "Defines if chatbot should be created"
  default     = false
}