locals {
  chatbot_queues = toset(["evaluate", "monitor"])
}

resource "aws_sqs_queue" "chatbot_dlq" {
  for_each = local.chatbot_queues

  name                        = "${local.prefix}-${each.key}-queue-dlq.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  message_retention_seconds   = 604800 # 7 days
}

resource "aws_sqs_queue" "chatbot_queue" {
  for_each = local.chatbot_queues

  name                        = "${local.prefix}-${each.key}-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "messageGroup"
  fifo_throughput_limit       = "perMessageGroupId"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.chatbot_dlq[each.key].arn
    maxReceiveCount     = 2
  })
}

