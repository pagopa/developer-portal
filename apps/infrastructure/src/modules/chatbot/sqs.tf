resource "aws_sqs_queue" "chatbot_evaluate_queue" {
  name = "${local.prefix}-evaluate-queue"
}

