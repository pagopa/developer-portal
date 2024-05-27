resource "aws_sqs_queue" "this" {
  name = "${local.prefix}-website-kb-sync-queue"
}

resource "aws_sqs_queue_policy" "allow_external" {
  queue_url = aws_sqs_queue.this.id
  policy    = data.aws_iam_policy_document.sqs_external.json
}