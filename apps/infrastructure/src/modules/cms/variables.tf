variable "aws_region" {
  type        = string
  description = "AWS region to create resources. Default Milan"
  default     = "eu-south-1"
}

variable "environment" {
  type        = string
  description = "Environment"
}

variable "github_repository" {
  type        = string
  description = "The repository where the IaC workflows will run"
}

variable "tags" {
  type = map(any)
  default = {
    CreatedBy = "Terraform"
  }
}

variable "dns_domain_name" {
  description = "DNS domain for the Developer Portal product"
  type        = string
}

## CMS Strapi App Port
variable "cms_app_port" {
  description = "The standard app port used by CMS Strapi"
  default     = 1337
}

## CMS Strapi CPU
variable "cms_app_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "1024" ##### 1 vCPU
}

## CMS Strapi RAM
variable "cms_app_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "3072" ##### 3 GB RAM
}

# CMS Strapi DNS
variable "dns_domain_name_cms" {
  description = "DNS domain name of the Developer Portal's CMS"
  type        = map(any)
  default     = null
}

variable "hosted_zone_id" {
  type        = string
  description = "The ID of the hosted zone to create the public DNS records in"
}