# SQS FIFO Queue
resource "aws_sqs_queue" "fifo_queue" {
  name                        = "${local.prefix}-events.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  deduplication_scope         = "messageGroup"
  fifo_throughput_limit       = "perMessageGroupId"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.fifo_dlq_queue.arn
    maxReceiveCount     = 1
  })

  policy = jsonencode({
    "Version" : "2008-10-17",
    "Id" : "__default_policy_ID",
    "Statement" : [
      {
        "Sid" : "__owner_statement",
        "Effect" : "Allow",
        "Principal" : {
          "AWS" : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        },
        "Action" : "SQS:*",
        "Resource" : "arn:aws:sqs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${local.prefix}-events.fifo"
      },
      {
        "Sid" : "AllowFromEventBridge",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "events.amazonaws.com"
        },
        "Action" : "sqs:SendMessage",
        "Resource" : "arn:aws:sqs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${local.prefix}-events.fifo",
        "Condition" : {
          "ArnEquals" : {
            "aws:SourceArn" : aws_cloudwatch_event_rule.cognito_events.arn
          }
        }
      },
      {
        "Sid" : "AllowFromEventPipes",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "pipes.amazonaws.com"
        },
        "Action" : "sqs:SendMessage",
        "Resource" : "arn:aws:sqs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${local.prefix}-events.fifo",
        "Condition" : {
          "ArnEquals" : {
            "aws:SourceArn" : "arn:aws:pipes:${var.aws_region}:${data.aws_caller_identity.current.account_id}:pipe/${local.prefix}-webinar-subscriptions-pipe"
          }
        }
      }
    ]
  })
}

# Dead Letter Queue (DLQ)
resource "aws_sqs_queue" "fifo_dlq_queue" {
  name       = "${local.prefix}-events-dlq.fifo"
  fifo_queue = true
}
