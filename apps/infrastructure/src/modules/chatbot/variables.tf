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
    CreatedBy      = "Terraform",
    Wbs            = "BD110 - PORTALS E TOOLS"
    CostCenter     = "BD110 - PORTALS E TOOLS"
    Owner          = "CloudGaaP-AI"
    ManagementTeam = "team_cloudgaap_ai"
  }
}

variable "module" {
  type        = string
  description = "Prefix for resources"
  default     = "chatbot"
}

variable "aws_chatbot_region" {
  type        = string
  description = "AWS region to create AI chatbot's resources"
}

variable "s3_bucket_name_static_content" {
  type        = string
  description = "The name of the S3 bucket for static content"
}

variable "dns_chatbot_hosted_zone" {
  type = object({
    name = string
    id   = string
  })
  description = "The name of the chatbot hosted zone"
}

variable "cognito_user_pool" {
  type = object({
    id        = string
    arn       = string
    domain    = string
    region    = string
    client_id = string
    endpoint  = string
  })
  sensitive   = true
  description = "The cognito user pool used to authenticate api calls"
}

variable "vpc" {
  type = object({
    id                         = string
    cidr_block                 = string
    public_subnets             = list(string)
    database_subnets           = list(string)
    private_subnets            = list(string)
    elasticache_subnets        = list(string)
    database_subnet_group_name = string
  })

  description = "The VPC used to deploy the resources"
}

variable "security_groups" {
  type        = map(string)
  description = "The security groups used to deploy the resources"
}

variable "dns_domain_name" {
  description = "DNS domain for the Developer Portal product"
  type        = string
}

variable "github_repository" {
  type        = string
  description = "The repository where the IaC workflows will run"
}

################################################################################
# ECS - Redis
################################################################################

variable "ecs_redis" {
  type = object({
    cpu       = number
    memory    = number
    image_uri = string
    port      = number
  })
  description = "Redis configuration for the AI chatbot"
}

################################################################################
# API Gateway
################################################################################

variable "api_gateway" {
  type = object({
    integration_timeout_sec = optional(number, 60)
  })

  default = {
    integration_timeout_sec = 60
  }
}

################################################################################
# ECS - Monitoring
################################################################################

variable "ecs_monitoring" {
  type = object({
    cpu       = number
    memory    = number
    image_uri = string
    port      = number
  })
  description = "Langfuse configuration for the AI chatbot"
}

################################################################################
# WAF
################################################################################

variable "waf_ip_rate_limit_limit" {
  type    = number
  default = 100
}

variable "waf_ip_rate_limit_evaluation_window_sec" {
  type    = number
  default = 60
}

variable "waf_block_requests_to_queries_limit" {
  type    = number
  default = 100
}

variable "waf_block_requests_to_queries_evaluation_window_sec" {
  type    = number
  default = 60
}

variable "models" {
  type = object({
    provider   = string
    generation = string
    embeddings = string
    reranker   = string
  })

  description = "The models used by the AI chatbot"
}

variable "hosted_zone_id" {
  type        = string
  description = "The Route53 hosted zone ID for custom domain"
}
