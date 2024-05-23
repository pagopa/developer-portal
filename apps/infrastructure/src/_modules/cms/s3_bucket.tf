## Bucket S3 for CMS Strapi Medialibrary
resource "random_integer" "bucket_random_integer" {
  min = 1
  max = 9999
}

module "s3_bucket_cms" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git?ref=3a1c80b29fdf8fc682d2749456ec36ecbaf4ce14" # v4.1.0

  bucket                  = "cms-medialibrary-${random_integer.bucket_random_integer.result}"
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  versioning = {
    status  = true
    enabled = true
  }

  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_iam_policy_cms.json
}

resource "random_integer" "ai_kb_bucket_random_integer" {
  min = 1
  max = 9999
}

module "s3_bucket_ai_kb" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git?ref=3a1c80b29fdf8fc682d2749456ec36ecbaf4ce14" # v4.1.0

  bucket                  = "ai-knowledge-base-${random_integer.ai_kb_bucket_random_integer.result}"
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  versioning = {
    status  = true
    enabled = true
  }
}
