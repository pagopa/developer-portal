## Heartbeat Collection Resources — eu-south-1 ##
#
# All resources in this file are deployed to eu-south-1 so that heartbeat
# data is ingested, stored, and queried closer to the Cognito user pool and
# the front-end origin.  The caller must supply an `aws.eu-south-1` provider alias.

data "aws_partition" "current" {}

# ---------------------------------------------------------------------------
# 1. S3 Bucket for heartbeat storage
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "heartbeat_storage" {
  provider = aws.eu-south-1
  bucket   = "${var.project_name}-webinar-heartbeats-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "heartbeat_storage_pac" {
  provider = aws.eu-south-1
  bucket   = aws_s3_bucket.heartbeat_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ---------------------------------------------------------------------------
# 2. S3 Bucket for Athena query results
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "athena_results" {
  provider = aws.eu-south-1
  bucket   = "${var.project_name}-athena-results-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "athena_results_pac" {
  provider = aws.eu-south-1
  bucket   = aws_s3_bucket.athena_results.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "athena_results_lifecycle" {
  provider = aws.eu-south-1
  bucket   = aws_s3_bucket.athena_results.id

  rule {
    id     = "delete-old-results"
    status = "Enabled"

    filter {
      prefix = ""
    }

    expiration {
      days = 30
    }
  }
}

# ---------------------------------------------------------------------------
# 3. Kinesis Data Firehose (direct-put → S3)
# ---------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "firehose_delivery_logs" {
  provider          = aws.eu-south-1
  name              = "/aws/kinesisfirehose/${var.project_name}-webinar-viewer-count"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_stream" "firehose_delivery_logs" {
  provider       = aws.eu-south-1
  name           = "IcebergDelivery"
  log_group_name = aws_cloudwatch_log_group.firehose_delivery_logs.name
}

resource "aws_kinesis_firehose_delivery_stream" "s3_delivery" {
  provider    = aws.eu-south-1
  name        = "${var.project_name}-webinar-viewer-count"
  destination = "iceberg"

  iceberg_configuration {
    role_arn           = aws_iam_role.firehose_role.arn
    catalog_arn        = "arn:${data.aws_partition.current.partition}:glue:eu-south-1:${data.aws_caller_identity.current.account_id}:catalog"
    buffering_size     = 10
    buffering_interval = 300

    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.firehose_delivery_logs.name
      log_stream_name = aws_cloudwatch_log_stream.firehose_delivery_logs.name
    }

    s3_configuration {
      role_arn            = aws_iam_role.firehose_role.arn
      bucket_arn          = aws_s3_bucket.heartbeat_storage.arn
      error_output_prefix = "errors/iceberg/!{firehose:error-output-type}/"
    }

    destination_table_configuration {
      database_name = aws_athena_database.webinar_db.name
      table_name    = aws_glue_catalog_table.webinar_heartbeats_iceberg.name
    }
  }
}

resource "aws_iam_role" "firehose_role" {
  provider = aws.eu-south-1
  name     = "heartbeat_firehose_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "firehose.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "firehose_s3_policy" {
  provider = aws.eu-south-1
  role     = aws_iam_role.firehose_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["s3:PutObject", "s3:GetObject", "s3:GetBucketLocation", "s3:AbortMultipartUpload", "s3:ListBucket", "s3:ListBucketMultipartUploads"]
        Effect = "Allow"
        Resource = [
          aws_s3_bucket.heartbeat_storage.arn,
          "${aws_s3_bucket.heartbeat_storage.arn}/*",
        ]
      },
      {
        Action = [
          "glue:GetDatabase",
          "glue:GetDatabases",
          "glue:GetTable",
          "glue:GetTables",
          "glue:GetTableVersion",
          "glue:GetTableVersions",
          "glue:UpdateTable",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action   = ["logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "${aws_cloudwatch_log_group.firehose_delivery_logs.arn}:log-stream:*"
      },
    ]
  })
}

# ---------------------------------------------------------------------------
# 3. Ingest Lambda function
# ---------------------------------------------------------------------------

data "archive_file" "ingest_lambda_function" {
  type        = "zip"
  source_file = "${path.root}/../../webinar-metrics-functions/collect-metrics.py"
  output_path = "${path.root}/../../webinar-metrics-functions/out/collect-metrics.py.zip"
}

resource "aws_iam_role" "lambda_role" {
  provider = aws.eu-south-1
  name     = "heartbeat_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_kinesis_policy" {
  provider = aws.eu-south-1
  role     = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["kinesis:PutRecord", "kinesis:PutRecords"]
      Effect   = "Allow"
      Resource = aws_kinesis_firehose_delivery_stream.s3_delivery.arn
    }]
  })
}

resource "aws_cloudwatch_log_group" "ingest_lambda_logs" {
  provider          = aws.eu-south-1
  name              = "/aws/lambda/${var.project_name}-heartbeat-ingest"
  retention_in_days = 14
}

resource "aws_iam_role_policy" "lambda_logging_policy" {
  provider = aws.eu-south-1
  name     = "heartbeat_lambda_logging"
  role     = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ]
      Effect   = "Allow"
      Resource = "${aws_cloudwatch_log_group.ingest_lambda_logs.arn}:*"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_firehose_policy" {
  provider = aws.eu-south-1
  name     = "lambda_firehose_direct_put"
  role     = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = "firehose:PutRecord"
      Effect   = "Allow"
      Resource = aws_kinesis_firehose_delivery_stream.s3_delivery.arn
    }]
  })
}

resource "aws_lambda_function" "ingest_lambda" {
  provider         = aws.eu-south-1
  filename         = data.archive_file.ingest_lambda_function.output_path
  function_name    = "${var.project_name}-heartbeat-ingest"
  role             = aws_iam_role.lambda_role.arn
  handler          = "collect-metrics.lambda_handler"
  runtime          = "python3.13"
  source_code_hash = data.archive_file.ingest_lambda_function.output_base64sha256

  environment {
    variables = {
      DELIVERY_STREAM_NAME = aws_kinesis_firehose_delivery_stream.s3_delivery.name
    }
  }

  depends_on = [aws_cloudwatch_log_group.ingest_lambda_logs]
}

# ---------------------------------------------------------------------------
# 4. API Gateway HTTP API for ingest
# ---------------------------------------------------------------------------

resource "aws_apigatewayv2_api" "ingest" {
  provider      = aws.eu-south-1
  name          = "${var.project_name}-ingest-api"
  protocol_type = "HTTP"
  description   = "HTTP API for heartbeat ingest Lambda"

  cors_configuration {
    allow_origins = compact([
      "http://localhost:3000",
      "https://${data.aws_route53_zone.selected.name}",
    ])
    allow_methods = ["POST", "GET", "OPTIONS"]
    allow_headers = [
      "Content-Type",
      "Authorization",
      "X-Amz-Date",
      "X-Api-Key",
      "X-Amz-Security-Token",
    ]
    expose_headers = ["Content-Length", "Content-Type"]
    max_age        = 300
  }
}

resource "aws_apigatewayv2_integration" "ingest_lambda" {
  provider               = aws.eu-south-1
  api_id                 = aws_apigatewayv2_api.ingest.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.ingest_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_authorizer" "ingest_cognito" {
  provider         = aws.eu-south-1
  api_id           = aws_apigatewayv2_api.ingest.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "${var.project_name}-ingest-cognito-authorizer"

  jwt_configuration {
    audience = [var.cognito_user_pool_client_id]
    issuer   = "https://${var.cognito_user_pool_endpoint}"
  }
}

resource "aws_apigatewayv2_route" "ingest" {
  provider           = aws.eu-south-1
  api_id             = aws_apigatewayv2_api.ingest.id
  route_key          = "POST /ingest"
  target             = "integrations/${aws_apigatewayv2_integration.ingest_lambda.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.ingest_cognito.id
}

resource "aws_apigatewayv2_stage" "ingest" {
  provider    = aws.eu-south-1
  api_id      = aws_apigatewayv2_api.ingest.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_ingest" {
  provider      = aws.eu-south-1
  statement_id  = "AllowAPIGatewayHTTPInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ingest_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ingest.execution_arn}/*/*"
}

# ---------------------------------------------------------------------------
# 5. Athena Database, Workgroup and Named Query
# ---------------------------------------------------------------------------

resource "aws_athena_database" "webinar_db" {
  provider = aws.eu-south-1
  name     = "webinar_analytics"
  bucket   = aws_s3_bucket.heartbeat_storage.id
}

resource "aws_athena_workgroup" "webinar_analytics" {
  provider = aws.eu-south-1
  name     = "${var.project_name}-webinar-analytics"

  configuration {
    enforce_workgroup_configuration    = true
    publish_cloudwatch_metrics_enabled = true

    result_configuration {
      output_location = "s3://${aws_s3_bucket.athena_results.bucket}/query-results/"

      encryption_configuration {
        encryption_option = "SSE_S3"
      }
    }
  }
}

resource "aws_glue_catalog_table" "webinar_heartbeats_iceberg" {
  provider      = aws.eu-south-1
  name          = "webinar_heartbeats"
  database_name = aws_athena_database.webinar_db.name

  table_type = "EXTERNAL_TABLE"
  parameters = {
    format = "parquet"
  }

  # Glue's Iceberg engine writes/updates runtime-managed parameters
  # (iceberg.table.uuid, iceberg.table.lastUpdatedMs, metadata_hashcode,
  # previous_metadata_location, write.parquet.compression-codec, ...) every
  # time Firehose commits a new snapshot. Terraform must not fight over these.
  lifecycle {
    ignore_changes = [parameters]
  }

  open_table_format_input {
    iceberg_input {
      metadata_operation = "CREATE"
      version            = 2

      iceberg_table_input {
        location = "s3://${aws_s3_bucket.heartbeat_storage.bucket}/webinars/"

        schema {
          schema_id = 0
          type      = "struct"

          fields {
            id       = 1
            name     = "webinarid"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 2
            name     = "userid"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 3
            name     = "clientip"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 4
            name     = "receivedat"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 5
            name     = "islive"
            required = false
            type     = "\"boolean\""
          }

          fields {
            id       = 6
            name     = "action"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 7
            name     = "year"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 8
            name     = "month"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 9
            name     = "day"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 10
            name     = "startedAt"
            required = false
            type     = "\"string\""
          }

          fields {
            id       = 11
            name     = "consent"
            required = false
            type     = "\"boolean\""
          }

          fields {
            id       = 12
            name     = "duration"
            required = false
            type     = "\"double\""
          }
        }

        partition_spec {
          spec_id = 0

          fields {
            name      = "webinarid"
            source_id = 1
            transform = "identity"
          }

          fields {
            name      = "year"
            source_id = 7
            transform = "identity"
          }

          fields {
            name      = "month"
            source_id = 8
            transform = "identity"
          }

          fields {
            name      = "day"
            source_id = 9
            transform = "identity"
          }
        }
      }
    }
  }
}
