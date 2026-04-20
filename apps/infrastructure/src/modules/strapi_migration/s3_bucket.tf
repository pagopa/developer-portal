## Bucket S3 for CMS Strapi Medialibrary
resource "random_integer" "bucket_random_integer" {
  min = 1
  max = 9999
}

module "s3_bucket_cms" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-s3-bucket.git?ref=8eecd4bfe167b3606755a0f8150514e9dcb2bf67" # v.5.10

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