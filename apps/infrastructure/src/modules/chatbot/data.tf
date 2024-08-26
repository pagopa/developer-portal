data "aws_iam_policy_document" "lambda_s3_policy" {
  statement {
    sid       = "ListObjectsInBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [module.s3_bucket_llamaindex.s3_bucket_arn, module.s3_bucket_kb.s3_bucket_arn]
  }

  statement {
    sid       = "ReadWriteInBucket"
    effect    = "Allow"
    actions   = ["s3:*Object"]
    resources = ["${module.s3_bucket_llamaindex.s3_bucket_arn}/*", "${module.s3_bucket_kb.s3_bucket_arn}/*"]
  }
}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}