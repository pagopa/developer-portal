resource "aws_sqs_queue" "chatbot_evaluation_queue" {
  name = "${local.prefix}-evaluation-queue"
}

