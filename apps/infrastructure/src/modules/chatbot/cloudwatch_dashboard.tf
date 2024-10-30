# CloudWatch Dashboard for Chatbot Infrastructure

resource "aws_cloudwatch_dashboard" "chatbot_dashboard" {
  dashboard_name = "${local.prefix}-chatbot-dashboard"
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "text"
        width  = 24
        height = 1
        properties = {
          markdown = "# Chatbot Infrastructure Dashboard"
        }
      },
      {
        type   = "alarm"
        width  = 24
        height = 6
        properties = {
          title = "Chatbot Health Overview"
          alarms = [
            aws_cloudwatch_metric_alarm.api_gateway_5xx_errors.arn,
            aws_cloudwatch_metric_alarm.lambda_errors.arn,
            aws_cloudwatch_metric_alarm.lambda_duration.arn,
            aws_cloudwatch_metric_alarm.dynamodb_read_throttle_queries.arn,
            aws_cloudwatch_metric_alarm.dynamodb_write_throttle_queries.arn
          ]
        }
      },
      {
        type   = "text"
        width  = 24
        height = 1
        properties = {
          markdown = "## API Gateway Metrics"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            [{ "expression" = "ANOMALY_DETECTION_BAND(m1, 2)", "label" = "Anomaly Detection Band", "id" = "e1", "color" = "#666666" }],
            ["AWS/ApiGateway", "5XXError", "ApiName", aws_api_gateway_rest_api.api.name, { "id" = "m1", "stat" = "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway 5XX Errors with Anomaly Detection"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            [{ "expression" = "ANOMALY_DETECTION_BAND(m1, 2)", "label" = "Anomaly Detection Band", "id" = "e1", "color" = "#666666" }],
            ["AWS/ApiGateway", "4XXError", "ApiName", aws_api_gateway_rest_api.api.name, { "id" = "m1", "stat" = "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway 4XX Errors with Anomaly Detection"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiName", aws_api_gateway_rest_api.api.name],
            [".", "Latency", ".", "."],
            [".", "IntegrationLatency", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Gateway Requests and Latency"
        }
      },
      {
        type   = "text"
        width  = 24
        height = 1
        properties = {
          markdown = "## Lambda Function Metrics"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            [{ "expression" = "ANOMALY_DETECTION_BAND(m1, 2)", "label" = "Anomaly Detection Band", "id" = "e1", "color" = "#666666" }],
            ["AWS/Lambda", "Errors", "FunctionName", module.lambda_function.lambda_function_name, { "id" = "m1", "stat" = "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Errors with Anomaly Detection"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            [{ "expression" = "ANOMALY_DETECTION_BAND(m1, 2)", "label" = "Anomaly Detection Band", "id" = "e1", "color" = "#666666" }],
            ["AWS/Lambda", "Duration", "FunctionName", module.lambda_function.lambda_function_name, { "id" = "m1", "stat" = "Average" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Duration with Anomaly Detection"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", module.lambda_function.lambda_function_name],
            [".", "ConcurrentExecutions", ".", "."],
            [".", "Throttles", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Invocations, Concurrency, and Throttles"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "ColdStart", "FunctionName", module.lambda_function.lambda_function_name, { "stat" = "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Lambda Cold Starts"
        }
      },
      {
        type   = "text"
        width  = 24
        height = 1
        properties = {
          markdown = "## DynamoDB Metrics"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            [{ "expression" = "ANOMALY_DETECTION_BAND(m1, 2)", "label" = "Anomaly Detection Band", "id" = "e1", "color" = "#666666" }],
            ["AWS/DynamoDB", "ReadThrottleEvents", "TableName", module.dynamodb_chatbot_queries.dynamodb_table_id, { "id" = "m1", "stat" = "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Read Throttle Events with Anomaly Detection"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            [{ "expression" = "ANOMALY_DETECTION_BAND(m1, 2)", "label" = "Anomaly Detection Band", "id" = "e1", "color" = "#666666" }],
            ["AWS/DynamoDB", "WriteThrottleEvents", "TableName", module.dynamodb_chatbot_queries.dynamodb_table_id, { "id" = "m1", "stat" = "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Write Throttle Events with Anomaly Detection"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", module.dynamodb_chatbot_queries.dynamodb_table_id],
            [".", "ConsumedWriteCapacityUnits", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Consumed Capacity Units"
        }
      }
    ]
  })
}