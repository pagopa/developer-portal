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

variable "website_bucket_name" {
  type        = string
  description = "The name of the website bucket"
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

variable "dns_domain_name" {
  description = "DNS domain for the Developer Portal product"
  type        = string
}

################################################################################
# OpenSearch
################################################################################

variable "opensearch" {
  type = object({
    instance_count           = optional(number, 1)
    dedicated_master_instance_type = optional(string, null)
    node_instance_type = optional(string, "t3.small.search")
    engine_version = optional(string, "OpenSearch_2.13")
    ebs_options = object({
      ebs_enabled = bool
      iops        = number
      throughput  = number
      volume_type = string
      volume_size = number
    })
  })
  description = "OpenSearch configuration for the AI chatbot"
}
