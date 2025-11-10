variable "module" {
  type        = string
  description = "Prefix for resources"
  default     = "langfuse"
}

variable "environment" {
  type        = string
  description = "Environment"
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

variable "cache_node_type" {
  description = "Node type for Langfuse Cache/Queue(ElastiCache)"
  default     = "cache.t4g.micro"
}
