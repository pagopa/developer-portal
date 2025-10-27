variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "A name for the project to prefix resources."
  type        = string
}

variable "ivs_channels" {
  description = "A map of IVS channels to create. The key will be used for resource identification."
  type = map(object({
    name         = string
    latency_mode = optional(string, "LOW")
    type         = optional(string, "STANDARD")
  }))
  default = {}
}

variable "custom_domain_name" {
  description = "The custom domain name (e.g., video.example.com) to assign to the CloudFront distribution."
  type        = string
  default     = null
}

variable "route53_zone_id" {
  description = "The ID of the existing Route 53 hosted zone for the custom domain."
  type        = string
  default     = null
}