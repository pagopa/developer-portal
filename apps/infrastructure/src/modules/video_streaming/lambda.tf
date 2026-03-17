## Lambda function for webinar metrics ##

locals {
  webinar_metrics_lambda_name = "${var.project_name}-webinar-metrics"
}

data "archive_file" "webinar_metrics" {
  type        = "zip"
  source_file = "${path.root}/../../webinar-metrics-functions/lambda.py"
  output_path = "${path.root}/../../webinar-metrics-functions/out/webinar-metrics.zip"
}

resource "aws_cloudwatch_log_group" "webinar_metrics_logs" {
  name              = "/aws/lambda/${local.webinar_metrics_lambda_name}"
  retention_in_days = 14
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