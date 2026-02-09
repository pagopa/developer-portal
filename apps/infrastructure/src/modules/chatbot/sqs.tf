resource "aws_sqs_queue" "chatbot_evaluate_queue_dlq" {
  name                        = "${local.prefix}-evaluate-queue-dlq.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  message_retention_seconds   = 604800 # 7 days
}

resource "aws_sqs_queue" "chatbot_evaluate_queue" {
  name                        = "${local.prefix}-evaluate-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "messageGroup"
  fifo_throughput_limit       = "perMessageGroupId"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.chatbot_evaluate_queue_dlq.arn
    maxReceiveCount     = 2
  })
}

resource "aws_sqs_queue" "chatbot_monitor_queue_dlq" {
  name                        = "${local.prefix}-monitor-queue-dlq.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  message_retention_seconds   = 604800 # 7 days
}

resource "aws_sqs_queue" "chatbot_monitor_queue" {
  name                        = "${local.prefix}-monitor-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "messageGroup"
  fifo_throughput_limit       = "perMessageGroupId"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.chatbot_monitor_queue_dlq.arn
    maxReceiveCount     = 2
  })
}

