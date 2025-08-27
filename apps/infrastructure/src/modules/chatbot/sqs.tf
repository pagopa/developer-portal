resource "aws_sqs_queue" "chatbot_evaluate_queue" {
  name                        = "${local.prefix}-evaluate-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "messageGroup"
  fifo_throughput_limit       = "perMessageGroupId"
}

