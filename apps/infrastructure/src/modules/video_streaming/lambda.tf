## Lambda function for webinar metrics ##

locals {
  webinar_metrics_lambda_name   = "${var.project_name}-webinar-metrics"
  webinar_metrics_lambda_source = "${path.root}/../../webinar-metrics-function/lambda.py"
}

data "archive_file" "webinar_metrics" {
  type        = "zip"
  source_file = local.webinar_metrics_lambda_source
  output_path = "${path.root}/../../webinar-metrics-function/out/webinar-metrics.zip"
}

resource "aws_cloudwatch_log_group" "webinar_metrics_logs" {
  name              = "/aws/lambda/${local.webinar_metrics_lambda_name}"
  retention_in_days = 14
}

resource "aws_iam_role" "webinar_metrics" {
  name                  = "${var.project_name}-webinar-metrics-role"
  force_detach_policies = true
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "webinar_metrics" {
  name = "${var.project_name}-webinar-metrics-policy"
  role = aws_iam_role.webinar_metrics.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.webinar_metrics_logs.arn}:*"
      },
      {
        Effect = "Allow"
        Action = [
          "athena:StartQueryExecution",
          "athena:GetQueryExecution",
          "athena:GetQueryResults"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "glue:GetTable",
          "glue:GetPartitions",
          "glue:GetDatabase"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.cloudfront_logs.arn,
          "${aws_s3_bucket.cloudfront_logs.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:GetBucketLocation",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.athena_results.arn,
          "${aws_s3_bucket.athena_results.arn}/*"
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudwatch:GetMetricStatistics"]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["ivs:ListStreamSessions"]
        Resource = "arn:aws:ivs:*:*:channel/*"
      }
    ]
  })
}

resource "aws_lambda_function" "webinar_metrics" {
  function_name = local.webinar_metrics_lambda_name
  description   = "Lambda function that collects webinar metrics from IVS and Athena."

  handler = "lambda.lambda_handler"
  runtime = "python3.12"

  filename         = data.archive_file.webinar_metrics.output_path
  source_code_hash = data.archive_file.webinar_metrics.output_base64sha256

  timeout       = 120
  memory_size   = 256
  architectures = ["x86_64"]
  role          = aws_iam_role.webinar_metrics.arn

  environment {
    variables = merge(
      {
        ATHENA_DATABASE       = aws_athena_database.cloudfront_logs.name
        ATHENA_RESULTS_BUCKET = aws_s3_bucket.athena_results.id
      },
      var.webinar_metrics_channel_key != null ? {
        IVS_CHANNEL_ARN = aws_ivs_channel.channels[var.webinar_metrics_channel_key].arn
      } : {}
    )
  }

  depends_on = [aws_cloudwatch_log_group.webinar_metrics_logs]

  tags = {
    Name = local.webinar_metrics_lambda_name
  }
}