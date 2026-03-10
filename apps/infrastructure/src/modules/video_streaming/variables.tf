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

variable "environment" {
  type        = string
  description = "Environment"
}

variable "strapi_api_url" {
  description = "The URL of the Strapi API."
  type        = string
}

variable "webinar_metrics_channel_key" {
  description = "The key from ivs_channels to use for the webinar metrics Lambda. If null, IVS_CHANNEL_ARN is not set and the Lambda uses its default."
  type        = string
  default     = null
}

variable "webinar_metrics_stage_name" {
  description = "The api webinar metrics stage name."
  type        = string
  default     = "v1"
}

variable "github_repository" {
  description = "The GitHub repository (e.g., org/repo) allowed to assume the deploy role via OIDC."
  type        = string
}