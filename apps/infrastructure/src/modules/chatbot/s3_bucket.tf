resource "random_integer" "ai_kb_bucket_random_integer" {
  min = 1
  max = 9999
}

module "s3_bucket_kb" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git?ref=3a1c80b29fdf8fc682d2749456ec36ecbaf4ce14" # v4.1.0
  providers = {
    aws = aws.chatbot_region
  }

  bucket                  = "chatbot-knowledge-base-${random_integer.ai_kb_bucket_random_integer.result}"
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  versioning = {
    status  = true
    enabled = true
  }
}
