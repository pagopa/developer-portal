module "s3_bucket_llamaindex" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git?ref=8eecd4bfe167b3606755a0f8150514e9dcb2bf67" # v.5.10
  providers = {
    aws = aws.eu-west-3
  }

  bucket                  = "${var.module}-llamaindex-${random_integer.ai_kb_bucket_random_integer.result}"
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  versioning = {
    status  = true
    enabled = true
  }
}