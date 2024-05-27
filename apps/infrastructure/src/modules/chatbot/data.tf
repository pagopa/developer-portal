data "aws_iam_policy_document" "lambda_policy" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:ListBucket"
    ]

    resources = [
      "arn:aws:s3:::${var.website_bucket_name}",
      "arn:aws:s3:::${var.website_bucket_name}/*"
    ]
  }

  statement {
    actions = [
      "s3:PutObject"
    ]

    resources = [
      "arn:aws:s3:::${module.s3_bucket_kb.name}",
      "arn:aws:s3:::${module.s3_bucket_kb.name}/*"
    ]
  }

  statement {
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]

    resources = [
      aws_sqs_queue.this.arn
    ]
  }
}