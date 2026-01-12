resource "random_integer" "website_bucket_random_integer" {
  min = 1
  max = 9999
}

# Standalone static content
resource "aws_s3_bucket" "website_standalone" {
  bucket = "devportal-${var.environment_information.env_short}-website-static-content"
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

    #TODO: this is warkaround for TF not allowing empty prefix. I might be fixed in future versions
    filter {
      prefix = ""
    }

  }
}

resource "aws_s3_bucket_policy" "website_standalone" {
  bucket = aws_s3_bucket.website_standalone.id
  policy = data.aws_iam_policy_document.website_standalone_iam_policy.json
}
