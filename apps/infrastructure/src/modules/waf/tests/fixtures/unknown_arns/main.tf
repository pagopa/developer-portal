variable "include_langfuse" {
  description = "Include the optional Langfuse ALB association"
  type        = bool
}

resource "terraform_data" "cms" {
  input = "arn:aws:elasticloadbalancing:eu-south-1:123456789012:loadbalancer/app/cms/0000000000000000"
}

resource "terraform_data" "langfuse" {
  count = var.include_langfuse ? 1 : 0
  input = "arn:aws:elasticloadbalancing:eu-south-1:123456789012:loadbalancer/app/langfuse/0000000000000001"
}

module "waf" {
  source = "../../.."

  environment = "prod"
  associated_resource_arns = merge(
    { cms = terraform_data.cms.output },
    var.include_langfuse ? { langfuse = terraform_data.langfuse[0].output } : {}
  )
}
