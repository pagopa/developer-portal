resource "random_password" "encryption_key" {
  length           = 64    # 32 bytes in hexadecimal = 64 characters
  special          = false # Disable special characters
  override_special = ""    # Ensure no special characters are added
}

module "encryption_key" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/langfuse/encryption_key"
  value                = random_password.encryption_key.result
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}

resource "random_id" "salt" {
  byte_length = 32
}

module "salt" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/langfuse/salt"
  value                = random_id.salt.b64_std
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}


resource "random_id" "nextauth_secret" {
  byte_length = 32
}

module "nextauth_secret" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-ssm-parameter.git?ref=77d2c139784197febbc8f8e18a33d23eb4736879" # v1.1.0

  name                 = "/chatbot/langfuse/nextauth_secret"
  value                = random_id.nextauth_secret.b64_std
  type                 = "SecureString"
  secure_type          = true
  ignore_value_changes = true
}
