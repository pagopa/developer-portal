# CloudWatch Metrics and Alarms for Chatbot Resources

# API Gateway Metrics and Alarms
resource "aws_cloudwatch_metric_alarm" "api_gateway_5xx_errors" {
  alarm_name          = "${local.prefix}-api-gateway-5xx-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors API Gateway 5XX errors using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "5XXError"
      namespace   = "AWS/ApiGateway"
      period      = "60"
      stat        = "Sum"
      dimensions  = {
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

resource "aws_cloudwatch_metric_alarm" "api_gateway_increased_requests" {
  alarm_name          = "${local.prefix}-api-gateway-increased-requests"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors API Gateway for increased request volume using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Count"
      namespace   = "AWS/ApiGateway"
      period      = "60"
      stat        = "Sum"
      dimensions  = {
        ApiName = aws_api_gateway_rest_api.api.name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "API Gateway Requests (expected)"
    return_data = true
  }
}

resource "aws_cloudwatch_metric_alarm" "api_gateway_4xx_errors" {
  alarm_name          = "${local.prefix}-api-gateway-4xx-errors"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors API Gateway 4XX errors using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "4XXError"
      namespace   = "AWS/ApiGateway"
      period      = "60"
      stat        = "Sum"
      dimensions  = {
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
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Errors"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Sum"
      dimensions  = {
        FunctionName = module.lambda_function.lambda_function_name
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
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors Lambda function for increased invocations using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Invocations"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Sum"
      dimensions  = {
        FunctionName = module.lambda_function.lambda_function_name
      }
    }
  }

  metric_query {
    id          = "e1"
    expression  = "ANOMALY_DETECTION_BAND(m1, 2)"
    label       = "Lambda Invocations (expected)"
    return_data = true
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "${local.prefix}-lambda-duration"
  comparison_operator = "GreaterThanUpperThreshold"
  evaluation_periods  = "5"
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors Lambda function duration using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "Duration"
      namespace   = "AWS/Lambda"
      period      = "60"
      stat        = "Average"
      dimensions  = {
        FunctionName = module.lambda_function.lambda_function_name
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
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors DynamoDB read throttle events for queries table using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "ReadThrottleEvents"
      namespace   = "AWS/DynamoDB"
      period      = "60"
      stat        = "Sum"
      dimensions  = {
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
  threshold_metric_id = "e1"
  alarm_description   = "This metric monitors DynamoDB write throttle events for queries table using anomaly detection"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  metric_query {
    id          = "m1"
    return_data = true
    metric {
      metric_name = "WriteThrottleEvents"
      namespace   = "AWS/DynamoDB"
      period      = "60"
      stat        = "Sum"
      dimensions  = {
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
  metric_name         = "ReadThrottleEvents"
  namespace           = "AWS/DynamoDB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors DynamoDB read throttle events for sessions table"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    TableName = module.dynamodb_chatbot_sessions.dynamodb_table_id
  }
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_write_throttle_sessions" {
  alarm_name          = "${local.prefix}-dynamodb-write-throttle-sessions"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "5"
  metric_name         = "WriteThrottleEvents"
  namespace           = "AWS/DynamoDB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors DynamoDB write throttle events for sessions table"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  
  dimensions = {
    TableName = module.dynamodb_chatbot_sessions.dynamodb_table_id
  }
}

# SNS Topic for Alarms
resource "aws_sns_topic" "alerts" {
  name = "${local.prefix}-cloudwatch-alarms"
}

resource "aws_sns_topic_policy" "alerts" {
  arn = aws_sns_topic.alerts.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.alerts.arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = "arn:aws:cloudwatch:${var.aws_region}:${data.aws_caller_identity.current.account_id}:alarm:*"
          }
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}