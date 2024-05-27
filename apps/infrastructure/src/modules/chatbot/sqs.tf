resource "aws_sqs_queue" "this" {
  name  = "${local.prefix}-website-kb-sync-queue"
}

data "aws_iam_policy_document" "sqs_external" {
  statement {
    effect  = "Allow"
    actions = ["sqs:SendMessage"]

    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }

    resources = [aws_sqs_queue.this[0].arn]
  }
}

resource "aws_sqs_queue_policy" "allow_external" {
  queue_url = aws_sqs_queue.this[0].id
  policy    = data.aws_iam_policy_document.sqs_external.json
}