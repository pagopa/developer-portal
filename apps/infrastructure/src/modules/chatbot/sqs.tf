resource "aws_sqs_queue" "chatbot_monitor_queue" {
  name = "${local.prefix}-monitoring-queue"
}

