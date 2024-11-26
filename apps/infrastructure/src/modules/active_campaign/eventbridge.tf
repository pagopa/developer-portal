

# DynamoDB Stream Source
data "aws_dynamodb_table" "existing_table" {
  name = "existing-dynamodb-table"
}

# EventBridge Pipe for DynamoDB Stream -> SQS FIFO
resource "aws_eventbridge_pipe" "dynamodb_to_sqs" {
  name           = "${local.prefix}-webinar-subscriptions-pipe"
  source         = var.webinar_subscriptions_ddb_stream_arn
  target         = aws_sqs_queue.fifo_queue.arn
  role_arn       = aws_iam_role.lambda_role.arn

  source_parameters {
    dynamodb_stream_parameters {
      starting_position = "LATEST"
    }
  }
}

# EventBridge Rule to Capture Cognito Events
resource "aws_cloudwatch_event_rule" "cognito_events" {
  name        = "${local.prefix}-cognito-events-rule"
  event_pattern = jsonencode({
    source = ["aws.cognito-idp"]
    detail-type = ["AWS API Call via CloudTrail"],
  detail = {
    eventSource = ["cognito-idp.amazonaws.com"],
    eventName = ["UpdateUserAttributes", "DeleteUser", "ConfirmSignUp"]
  }
  })
}

resource "aws_cloudwatch_event_target" "cognito_to_sqs" {
  rule      = aws_cloudwatch_event_rule.cognito_events.name
  arn       = aws_sqs_queue.fifo_queue.arn
  role_arn  = aws_iam_role.lambda_role.arn
}