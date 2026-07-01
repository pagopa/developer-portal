# CloudWatch Metrics and Alarms for Chatbot Resources

# API Gateway Metrics and Alarms
resource "aws_cloudwatch_metric_alarm" "api_gateway_5xx_errors" {
  alarm_name          = "${local.prefix}-api-gateway-5xx-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors API Gateway 5XX errors using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "5XXError"
      namespace   = "AWS/ApiGateway"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        ApiName = aws_api_gateway_rest_api.api.name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "5XXError (expected)"
    return_data = true
  }
}

resource "aws_cloudwatch_metric_alarm" "api_gateway_4xx_errors" {
  alarm_name          = "${local.prefix}-api-gateway-4xx-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors API Gateway 4XX errors using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "4XXError"
      namespace   = "AWS/ApiGateway"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        ApiName = aws_api_gateway_rest_api.api.name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "4XXError (expected)"
    return_data = true
  }
}

# Lambda Function Metrics and Alarms
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${local.prefix}-lambda-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors Lambda function errors using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Errors"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        FunctionName = aws_lambda_function.chatbot_lambda.function_name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "Lambda Errors (expected)"
    return_data = true
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_increased_invocations" {
  alarm_name          = "${local.prefix}-lambda-increased-invocations"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "5"
  datapoints_to_alarm = "3"
  treat_missing_data  = "notBreaching"
  metric_name         = "Invocations"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "150"
  alarm_description   = "This metric monitors Lambda function for increased invocations with static threshold"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    FunctionName = aws_lambda_function.chatbot_lambda.function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "${local.prefix}-lambda-duration"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors Lambda function duration using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Duration"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Average"
      dimensions = {
        FunctionName = aws_lambda_function.chatbot_lambda.function_name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "Lambda Duration (expected)"
    return_data = true
  }
}

# DynamoDB Metrics and Alarms
resource "aws_cloudwatch_metric_alarm" "dynamodb_read_throttle_queries" {
  alarm_name          = "${local.prefix}-dynamodb-read-throttle-queries"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  treat_missing_data  = "notBreaching"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors DynamoDB read throttle events for queries table using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "ReadThrottleEvents"
      namespace   = "AWS/DynamoDB"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        TableName = module.dynamodb_chatbot_queries.dynamodb_table_id
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "ReadThrottleEvents (expected)"
    return_data = true
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_write_throttle_queries" {
  alarm_name          = "${local.prefix}-dynamodb-write-throttle-queries"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  treat_missing_data  = "notBreaching"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors DynamoDB write throttle events for queries table using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "WriteThrottleEvents"
      namespace   = "AWS/DynamoDB"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        TableName = module.dynamodb_chatbot_queries.dynamodb_table_id
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "WriteThrottleEvents (expected)"
    return_data = true
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_read_throttle_sessions" {
  alarm_name          = "${local.prefix}-dynamodb-read-throttle-sessions"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "5"
  treat_missing_data  = "notBreaching"
  metric_name         = "ReadThrottleEvents"
  namespace           = "AWS/DynamoDB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors DynamoDB read throttle events for sessions table"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    TableName = module.dynamodb_chatbot_sessions.dynamodb_table_id
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_write_throttle_sessions" {
  alarm_name          = "${local.prefix}-dynamodb-write-throttle-sessions"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "5"
  treat_missing_data  = "notBreaching"
  metric_name         = "WriteThrottleEvents"
  namespace           = "AWS/DynamoDB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors DynamoDB write throttle events for sessions table"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    TableName = module.dynamodb_chatbot_sessions.dynamodb_table_id
  }
}

# lambda index errors alarm
resource "aws_cloudwatch_metric_alarm" "lambda_index_errors" {
  alarm_name          = "${local.prefix}-index-lambda-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors chatbot-index Lambda function errors using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Errors"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        FunctionName = aws_lambda_function.chatbot_index_lambda.function_name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "Lambda Errors (expected)"
    return_data = true
  }
}

# lambda index DLQ messages alarm — any message landing in the DLQ means a failed indexing run
resource "aws_cloudwatch_metric_alarm" "lambda_index_dlq_messages" {
  alarm_name          = "${local.prefix}-index-lambda-dlq-messages"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  datapoints_to_alarm = "1"
  treat_missing_data  = "notBreaching"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "60"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Messages in the chatbot-index DLQ indicate failed Lambda indexing invocations"
  alarm_actions       = [var.alerting_topic_arn]

  dimensions = {
    QueueName = aws_sqs_queue.chatbot_index_dlq.name
  }
}

# lambda evaluate alarm
resource "aws_cloudwatch_metric_alarm" "lambda_evaluate_errors" {
  alarm_name          = "${local.prefix}-evaluate-lambda-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors Lambda function errors using anomaly detection"
  alarm_actions       = [var.alerting_topic_arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Errors"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Sum"
      dimensions = {
        FunctionName = aws_lambda_function.chatbot_evaluate_lambda.function_name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "Lambda Errors (expected)"
    return_data = true
  }
}