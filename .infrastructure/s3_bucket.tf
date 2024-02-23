resource "random_integer" "website_bucket_random_integer" {
  min = 1
  max = 9999
}

locals {
  bucket_name = join("-", ["website-bucket", random_integer.website_bucket_random_integer.result])
}

resource "aws_s3_bucket" "website" {
  bucket = local.bucket_name
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket                  = aws_s3_bucket.website.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  versioning_configuration {
    status = "Suspended"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "website" {
  # Must have bucket versioning enabled first
  depends_on = [aws_s3_bucket_versioning.website]

  bucket = aws_s3_bucket.website.id

  rule {
    id = "Remove noncurrent versions"

    noncurrent_version_expiration {
      noncurrent_days = 1
    }

    status = "Enabled"
  }
}

data "aws_iam_policy_document" "website_iam_policy" {
  statement {
    actions = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      "${aws_s3_bucket.website.arn}",
      "${aws_s3_bucket.website.arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.main.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "cloudfront" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.website_iam_policy.json
}

## Bucket S3 for CMS Strapi Medialibrary
resource "random_integer" "bucket_random_integer" {
  min = 1
  max = 9999
}

data "aws_iam_policy_document" "s3_iam_policy_cms" {
  statement {
    actions = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      "${module.s3_bucket_cms.s3_bucket_arn}",
      "${module.s3_bucket_cms.s3_bucket_arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = module.cloudfront_cms.cloudfront_origin_access_identity_iam_arns
    }
  }
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
