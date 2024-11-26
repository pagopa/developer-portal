# SQS FIFO Queue
resource "aws_sqs_queue" "fifo_queue" {
  name                      = "${local.prefix}-events.fifo"
  fifo_queue                = true
  content_based_deduplication = true

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq_queue.arn
    maxReceiveCount     = 5
  })
}

# Dead Letter Queue (DLQ)
resource "aws_sqs_queue" "dlq_queue" {
  name       = "my-dlq-queue"
  fifo_queue = true
}

# Lambda Role
resource "aws_iam_role" "lambda_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}
