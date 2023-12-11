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

## WebinarQuestions database ##

module "dynamodb_webinar_questions" {
  source = "git::git@github.com:terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=715399dbe24f6443820bf5de80f6100b35d56355" # v4.0.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = true

  name                           = "WebinarQuestions"
  hash_key                       = "webinarId"
  range_key                      = "createdAt"
  ttl_enabled                    = true
  ttl_attribute_name             = "expireAt"
  server_side_encryption_enabled = true

  attributes = [
    {
      name = "webinarId"
      type = "S"
    },
    {
      name = "createdAt"
      type = "S"
    },
  ]
}
