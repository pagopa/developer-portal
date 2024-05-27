resource "aws_sqs_queue" "this" {
  provider = aws.chatbot_region

  name                       = "${local.prefix}-website-kb-sync-queue"
  visibility_timeout_seconds = local.lambda_timeout
  delay_seconds              = 0
  receive_wait_time_seconds  = 0
}

resource "aws_sqs_queue_policy" "allow_external" {
  provider = aws.chatbot_region

  queue_url = aws_sqs_queue.this.id
  policy    = data.aws_iam_policy_document.sqs_external.json
}