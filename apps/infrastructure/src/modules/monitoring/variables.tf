variable "module" {
  type        = string
  description = "Prefix for resources"
  default     = "monitoring"
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

variable "region" {
  description = "AWS region on which to deploy"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for Your Langfuse Environment"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs on which to deploy Langfuse worker / Clickhouse / Aurora Serverless v2 / ElastiCache"
  type        = list(string)
}
