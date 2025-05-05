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

resource "aws_s3_bucket_policy" "cloudfront" {
  for_each = local.is_static
  bucket   = aws_s3_bucket.website.id
  policy   = data.aws_iam_policy_document.website_iam_policy["static"].json
}

# Standalone static content
resource "aws_s3_bucket" "website_standalone" {
  bucket = "devportal-${var.environment}-website-static-content"
}

resource "aws_s3_bucket_public_access_block" "website_standalone" {
  bucket                  = aws_s3_bucket.website_standalone.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "website_standalone" {
  bucket = aws_s3_bucket.website_standalone.id
  versioning_configuration {
    status = "Suspended"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "website_standalone" {
  # Must have bucket versioning enabled first
  depends_on = [aws_s3_bucket_versioning.website_standalone]

  bucket = aws_s3_bucket.website_standalone.id

  rule {
    id = "Remove noncurrent versions"

    noncurrent_version_expiration {
      noncurrent_days = 1
    }

    status = "Enabled"
  }
}