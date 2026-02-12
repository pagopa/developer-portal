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

# variable "availability_zones" {
#   description = "Availability zones for the VPC"
#   type        = list(string)
#   default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
# }

variable "vpc_id" {
  description = "VPC ID for Your Langfuse Environment"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs on which to deploy Langfuse worker / Clickhouse / Aurora Serverless v2 / ElastiCache"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs used to expose Langfuse through the load balancer"
  type        = list(string)
}

variable "database_user" {
  description = "Database user for Langfuse Aurora Serverless v2"
  type        = string
  default     = "langfuse"
}

variable "custom_domain_name" {
  description = "Langfuse and Grafana custom domain name. If you set example.com, the domain will be langfuse.example.com and grafana.example.com"
  type        = string
}

variable "custom_domain_id" {
  description = "Route53 Hosted Zone ID for custom domain"
  type        = string
}

variable "cache_node_type" {
  description = "Node type for Langfuse Cache/Queue(ElastiCache)"
  default     = "cache.t4g.micro"
}

# variable "is_spot_instance" {
#   description = "Whether to use spot instances for Langfuse Worker(s) / Clickhouse node"
#   type        = bool
#   default     = false
# }

variable "worker_desire_count" {
  description = "Desired count for Langfuse Worker(s)"
  type        = number
  default     = 1
}

variable "web_desire_count" {
  description = "Desired count for Langfuse Web"
  type        = number
  default     = 1
}

variable "database_max_capacity" {
  description = "Maximum capacity for Langfuse DB Aurora Serverless v2"
  type        = number
  default     = 10
}

variable "database_min_capacity" {
  description = "Minimum capacity for Langfuse DB Aurora Serverless v2"
  type        = number
  default     = 0.5
}

variable "force_delete" {
  description = "Whether to force delete resources"
  type        = bool
  default     = false
}

variable "cognito_user_pool_id" {
  description = "Existing Cognito user pool ID to reuse instead of creating a dedicated one"
  type        = string
  default     = null
}

variable "cognito_user_pool_endpoint" {
  description = "Existing Cognito user pool endpoint to reuse instead of creating a dedicated one"
  type        = string
  default     = null
}

variable "master_user_password_param_arn" {
  description = "ARN of the SSM parameter containing the Cognito master user password when reusing an existing user pool"
  type        = string
  default     = null
}

variable "lambda_security_group_id" {
  description = "Security group ID of the lambda monitor to allow access to langfuse-web"
  type        = string
  default     = null
}
