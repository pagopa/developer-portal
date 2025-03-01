# EventBridge Pipe for DynamoDB Stream -> SQS FIFO
resource "aws_pipes_pipe" "dynamodb_to_sqs" {
  name     = "${local.prefix}-webinar-subscriptions-pipe"
  source   = var.webinar_subscriptions_ddb.stream_arn
  target   = aws_sqs_queue.fifo_queue.arn
  role_arn = aws_iam_role.pipes_role.arn

  log_configuration {
    include_execution_data = ["ALL"]
    level                  = "ERROR"
    cloudwatch_logs_log_destination {
      log_group_arn = aws_cloudwatch_log_group.pipe.arn
    }
  }

  source_parameters {
    dynamodb_stream_parameters {
      batch_size        = 1
      starting_position = "LATEST"
    }
  }

  target_parameters {
    input_template = <<EOF
{
  "detail": {
    "eventName": "Dynamo<$.eventName>",
    "additionalEventData": {
      "sub": "<$.dynamodb.Keys.username.S>"
    }
  },
  "webinarId": "<$.dynamodb.Keys.webinarId.S>",
  "eventID": "<$.eventID>"
}
EOF
    sqs_queue_parameters {
      message_group_id = "$.eventID"
    }
  }
}

resource "aws_cloudwatch_log_group" "pipe" {
  name              = "${local.prefix}-webinar-subscriptions-pipe"
  retention_in_days = 30
}

# EventBridge Rule to Capture Cognito Events
resource "aws_cloudwatch_event_rule" "cognito_events" {
  name = "${local.prefix}-cognito-events-rule"
  event_pattern = jsonencode({
    source      = ["aws.cognito-idp"]
    detail-type = ["AWS API Call via CloudTrail"],
    detail = {
      eventSource = ["cognito-idp.amazonaws.com"],
      eventName   = ["UpdateUserAttributes", "DeleteUser", "ConfirmSignUp"]
    }
  })
}

resource "aws_cloudwatch_event_target" "cognito_events_sqs" {
  target_id = aws_sqs_queue.fifo_queue.name
  rule      = aws_cloudwatch_event_rule.cognito_events.name
  arn       = aws_sqs_queue.fifo_queue.arn

  sqs_target {
    message_group_id = local.sqs_message_group_id
  }
}
