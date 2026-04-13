###############################################################################
#                    SSM Parameters for sensitive env vars                    #
###############################################################################

module "ssm_model_api_key" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/dos68k-chatbotapi/model_api_key"
  value                = "placeholder"
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

module "ssm_model_id" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/dos68k-chatbotapi/model_id"
  value                = "placeholder"
  type                 = "String"
  ignore_value_changes = true
}

module "ssm_embed_model_id" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/dos68k-chatbotapi/embed_model_id"
  value                = "placeholder"
  type                 = "String"
  ignore_value_changes = true
}

module "ssm_redis_host" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name  = "/dos68k-chatbotapi/redis_host"
  value = format("redis:%s", var.redis_host)
  type  = "String"
}
