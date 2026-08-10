## Webinar Certificate Lambda — eu-south-1 ##
#
# Exposes a GET /certificate endpoint (JWT-protected via Cognito) that returns
# the list of webinar IDs for which the authenticated user may obtain a certificate.
# The Lambda executes the Athena query in
#   apps/webinar-certificate-function/athena/search-certificates-by-user.sql

locals {
  webinar_certificate_lambda_name = "${var.project_name}-webinar-certificate"
}

# ---------------------------------------------------------------------------
# 1. Package the Python function
# ---------------------------------------------------------------------------

data "archive_file" "webinar_certificate" {
  type = "zip"
  # Include both the handler and the SQL file it reads at runtime
  source_dir  = "${path.root}/../../webinar-certificate-function"
  output_path = "${path.root}/../../webinar-certificate-function/out/webinar-certificate.zip"
  excludes    = ["out", "package.json"]
}

# ---------------------------------------------------------------------------
# 2. CloudWatch Log Group
# ---------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "webinar_certificate_logs" {
  provider          = aws.eu-south-1
  name              = "/aws/lambda/${local.webinar_certificate_lambda_name}"
  retention_in_days = 14
}

# ---------------------------------------------------------------------------
# 3. IAM Role
# ---------------------------------------------------------------------------

resource "aws_iam_role" "webinar_certificate" {
  provider              = aws.eu-south-1
  name                  = "${var.project_name}-webinar-certificate-role"
  force_detach_policies = true

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "webinar_certificate" {
  provider = aws.eu-south-1
  name     = "${var.project_name}-webinar-certificate-policy"
  role     = aws_iam_role.webinar_certificate.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Logging"
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "${aws_cloudwatch_log_group.webinar_certificate_logs.arn}:*"
      },
      {
        Sid    = "AthenaQuery"
        Effect = "Allow"
        Action = [
          "athena:StartQueryExecution",
          "athena:GetQueryExecution",
          "athena:GetQueryResults",
        ]
        Resource = aws_athena_workgroup.webinar_analytics.arn
      },
      {
        Sid    = "GlueRead"
        Effect = "Allow"
        Action = [
          "glue:GetDatabase",
          "glue:GetTable",
          "glue:GetPartitions",
        ]
        Resource = "*"
      },
      {
        Sid    = "HeartbeatS3Read"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
        ]
        Resource = [
          aws_s3_bucket.heartbeat_storage.arn,
          "${aws_s3_bucket.heartbeat_storage.arn}/*",
        ]
      },
      {
        Sid    = "AthenaResultsS3"
        Effect = "Allow"
        Action = [
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject",
        ]
        Resource = [
          aws_s3_bucket.athena_results.arn,
          "${aws_s3_bucket.athena_results.arn}/*",
        ]
      },
    ]
  })
}

# ---------------------------------------------------------------------------
# 4. Lambda Function
# ---------------------------------------------------------------------------

resource "aws_lambda_function" "webinar_certificate" {
  provider      = aws.eu-south-1
  function_name = local.webinar_certificate_lambda_name
  description   = "Returns the list of webinar IDs for which the user may obtain a certificate."

  handler = "lambda_function.handler"
  runtime = "python3.12"

  filename         = data.archive_file.webinar_certificate.output_path
  source_code_hash = data.archive_file.webinar_certificate.output_base64sha256

  timeout       = 120
  memory_size   = 256
  architectures = ["x86_64"]
  role          = aws_iam_role.webinar_certificate.arn

  environment {
    variables = {
      ATHENA_DATABASE        = aws_athena_database.webinar_db.name
      ATHENA_OUTPUT_LOCATION = "s3://${aws_s3_bucket.athena_results.bucket}/query-results/"
      ATHENA_WORKGROUP       = aws_athena_workgroup.webinar_analytics.name
    }
  }

  depends_on = [aws_cloudwatch_log_group.webinar_certificate_logs]

  tags = {
    Name = local.webinar_certificate_lambda_name
  }
}

# ---------------------------------------------------------------------------
# 5. API Gateway HTTP API — GET /certificate (JWT-protected)
# ---------------------------------------------------------------------------

resource "aws_apigatewayv2_api" "webinar_certificate" {
  provider      = aws.eu-south-1
  name          = "${var.project_name}-certificate-api"
  protocol_type = "HTTP"
  description   = "HTTP API for webinar certificate eligibility"

  cors_configuration {
    allow_origins = compact([
      "http://localhost:3000",
      "https://${data.aws_route53_zone.selected.name}",
    ])
    allow_methods = ["GET", "OPTIONS"]
    allow_headers = [
      "Authorization",
      "Content-Type",
    ]
    max_age = 300
  }
}

resource "aws_apigatewayv2_integration" "webinar_certificate" {
  provider               = aws.eu-south-1
  api_id                 = aws_apigatewayv2_api.webinar_certificate.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.webinar_certificate.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_authorizer" "webinar_certificate_cognito" {
  provider         = aws.eu-south-1
  api_id           = aws_apigatewayv2_api.webinar_certificate.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "${var.project_name}-certificate-cognito-authorizer"

  jwt_configuration {
    audience = [var.cognito_user_pool_client_id]
    issuer   = "https://${var.cognito_user_pool_endpoint}"
  }
}

resource "aws_apigatewayv2_route" "webinar_certificate" {
  provider           = aws.eu-south-1
  api_id             = aws_apigatewayv2_api.webinar_certificate.id
  route_key          = "GET /certificate"
  target             = "integrations/${aws_apigatewayv2_integration.webinar_certificate.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.webinar_certificate_cognito.id
}

resource "aws_apigatewayv2_stage" "webinar_certificate" {
  provider    = aws.eu-south-1
  api_id      = aws_apigatewayv2_api.webinar_certificate.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_webinar_certificate" {
  provider      = aws.eu-south-1
  statement_id  = "AllowAPIGatewayCertificateInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.webinar_certificate.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.webinar_certificate.execution_arn}/*/*"
}
