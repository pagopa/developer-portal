# S3 bucket to store all recordings

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "ivs_recordings" {
  bucket = "${var.project_name}-recordings-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "ivs_recordings_pac" {
  bucket = aws_s3_bucket.ivs_recordings.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "ivs_recordings_oc" {
  bucket = aws_s3_bucket.ivs_recordings.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Upload robots.txt to S3 bucket
resource "aws_s3_object" "robots_txt" {
  bucket       = aws_s3_bucket.ivs_recordings.id
  key          = "robots.txt"
  source       = "${path.module}/robots.txt"
  content_type = "text/plain"
  etag         = filemd5("${path.module}/robots.txt")
}

# S3 bucket for Athena query results
resource "aws_s3_bucket" "athena_results" {
  bucket = "${var.project_name}-athena-results-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "athena_results_pac" {
  bucket = aws_s3_bucket.athena_results.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "athena_results_lifecycle" {
  bucket = aws_s3_bucket.athena_results.id

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


# A single IAM Role and Policy for IVS to access the S3 Bucket
resource "aws_iam_role" "ivs_recording_role" {
  name = "${var.project_name}-ivs-s3-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "ivs.amazonaws.com" },
    }]
  })
}

resource "aws_iam_policy" "ivs_recording_policy" {
  name = "${var.project_name}-ivs-s3-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = ["s3:PutObject"],
        Effect   = "Allow",
        Resource = "${aws_s3_bucket.ivs_recordings.arn}/*",
      },
      {
        Action   = ["s3:GetBucketLocation"],
        Effect   = "Allow",
        Resource = aws_s3_bucket.ivs_recordings.arn,
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ivs_recording_attach" {
  role       = aws_iam_role.ivs_recording_role.name
  policy_arn = aws_iam_policy.ivs_recording_policy.arn
}

# A single Recording Configuration to be shared by all channels
resource "aws_ivs_recording_configuration" "main" {
  name = "${var.project_name}-s3-recording-config"
  destination_configuration {
    s3 {
      bucket_name = aws_s3_bucket.ivs_recordings.id
    }
  }
  # Ensure the IAM role exists before creating this
  depends_on = [aws_iam_role.ivs_recording_role]
}


# Create multiple IVS channels using a for_each loop
resource "aws_ivs_channel" "channels" {
  for_each = var.ivs_channels

  name         = each.value.name
  latency_mode = each.value.latency_mode
  type         = each.value.type

  recording_configuration_arn = aws_ivs_recording_configuration.main.arn

  tags = {
    Name      = var.project_name
    ChannelID = each.key
  }
}

data "aws_ivs_stream_key" "channels" {
  for_each    = var.ivs_channels
  channel_arn = aws_ivs_channel.channels[each.key].arn
}

## --- CloudFront Distribution for Playback --- ##
resource "aws_cloudfront_origin_access_control" "video_oac" {
  name                              = "${var.project_name}-video-s3-oac"
  description                       = "OAC for the IVS recording bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "vod" {
  origin {
    domain_name              = aws_s3_bucket.ivs_recordings.bucket_regional_domain_name
    origin_id                = "S3-${var.project_name}-ivs-recordings"
    origin_access_control_id = aws_cloudfront_origin_access_control.video_oac.id
  }

  # API Gateway HTTP API origin for the ingest endpoint
  origin {
    domain_name = replace(aws_apigatewayv2_api.ingest.api_endpoint, "https://", "")
    origin_id   = "APIGW-${var.project_name}-ingest"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "CDN for IVS video recordings"
  #default_root_object = "index.html" # Optional, good practice

  # Cache behavior for the ingest API endpoint
  ordered_cache_behavior {
    path_pattern     = "/ingest"
    allowed_methods  = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "APIGW-${var.project_name}-ingest"

    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_disabled.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.ingest_cors_policy.id

    viewer_protocol_policy = "https-only"
    compress               = true
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-ivs-recordings"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600  # Cache objects for 1 hour by default
    max_ttl                = 86400 # Cache objects for up to 24 hours

    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_policy.id
  }

  # Standard restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # custom domain configuration
  aliases = var.custom_domain_name != null ? [var.custom_domain_name] : []

  # Use the default CloudFront SSL/TLS certificate
  viewer_certificate {
    acm_certificate_arn            = var.custom_domain_name != null ? aws_acm_certificate_validation.cdn_cert_validation[0].certificate_arn : null
    ssl_support_method             = var.custom_domain_name != null ? "sni-only" : null
    cloudfront_default_certificate = var.custom_domain_name == null ? true : false
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  tags = {
    Name = "${var.project_name} video streaming distribution"
  }
}

# AWS Managed Cache Policies
data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host_header" {
  name = "Managed-AllViewerExceptHostHeader"
}

data "aws_route53_zone" "selected" {
  zone_id = var.route53_zone_id
}


resource "aws_cloudfront_response_headers_policy" "cors_policy" {
  name    = "cors-policy-video-streaming"
  comment = "Cors policy for video streaming."

  custom_headers_config {
    items {
      header   = "Server"
      override = true
      value    = "None"
    }
  }

  security_headers_config {
    frame_options {
      frame_option = "SAMEORIGIN"
      override     = true
    }
  }

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }


    access_control_allow_methods {
      items = ["GET", "HEAD"]
    }


    access_control_allow_origins {
      items = ["https://${data.aws_route53_zone.selected.name}"]
    }

    origin_override = true
  }
}

resource "aws_cloudfront_response_headers_policy" "ingest_cors_policy" {
  name    = "cors-policy-ingest-api"
  comment = "CORS policy for the ingest API endpoint."

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = [
        "Authorization",
        "Content-Type",
        "X-Amz-Date",
        "X-Api-Key",
        "X-Amz-Security-Token"
      ]
    }

    access_control_allow_methods {
      items = ["GET", "POST", "OPTIONS"]
    }

    access_control_allow_origins {
      items = compact([
        "http://localhost:3000",
        "https://${data.aws_route53_zone.selected.name}",
      ])
    }

    access_control_max_age_sec = 300
    origin_override            = true
  }
}

# Policy that allows access to the S3 bucket recordings.
resource "aws_s3_bucket_policy" "allow_access_recordings" {
  bucket = aws_s3_bucket.ivs_recordings.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "cloudfront.amazonaws.com" },
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.ivs_recordings.arn}/*",
        Condition = {
          StringEquals = {
            # This condition is crucial: it restricts access to ONLY this specific CloudFront distribution
            "AWS:SourceArn" = aws_cloudfront_distribution.vod.arn
          }
        }
      },
      {
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        },
        Action   = "s3:PutObject",
        Resource = "${aws_s3_bucket.ivs_recordings.arn}/*"
        Condition = {
          ArnLike = {
            "aws:PrincipalArn" = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/aws-reserved/sso.amazonaws.com/eu-west-1/AWSReservedSSO_DevPortalContentsManager*"
          }
        }
      }
    ]
  })

  # Depends on the public access block to ensure it is evaluated correctly
  depends_on = [aws_s3_bucket_public_access_block.ivs_recordings_pac]
}


# CloudFront Custom Domain and Route 53 Record (if provided) #

resource "aws_acm_certificate" "cdn_cert" {

  count = var.custom_domain_name != null ? 1 : 0


  provider          = aws.us-east-1
  domain_name       = var.custom_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in toset(aws_acm_certificate.cdn_cert[0].domain_validation_options) : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    } if var.custom_domain_name != null
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.route53_zone_id
}

resource "aws_acm_certificate_validation" "cdn_cert_validation" {

  count = var.custom_domain_name != null ? 1 : 0

  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.cdn_cert[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}


# Create a DNS record for the custom domain
resource "aws_route53_record" "cdn_alias_record" {
  count = var.custom_domain_name != null && var.route53_zone_id != null ? 1 : 0

  zone_id = var.route53_zone_id
  name    = var.custom_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.vod.domain_name
    zone_id                = aws_cloudfront_distribution.vod.hosted_zone_id
    evaluate_target_health = false
  }
}

## Lambda function that notifiy when a recording is available ##

resource "aws_cloudwatch_log_group" "lambda_index_logs" {
  name              = "/aws/lambda/${aws_lambda_function.ivs_video_processing_function.function_name}"
  retention_in_days = 14
}

resource "aws_iam_role" "ivs_video_processing_function" {
  name                  = "ivs-video-processing-lambda-role"
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

resource "aws_iam_role_policy" "ivs_video_processing_policy" {
  name = "ivs-video-processing-lambda-policy"
  role = aws_iam_role.ivs_video_processing_function.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ]
        Effect   = "Allow"
        Resource = aws_ssm_parameter.strapi_api_key.arn
      },
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.ivs_recordings.arn}/*",
          aws_s3_bucket.ivs_recordings.arn
        ]
      }
    ]
  })
}


locals {
  ivs_video_processing_lambda_name = "${var.project_name}-ivs-video-processing"
}


resource "aws_ssm_parameter" "strapi_api_key" {
  name        = "/ivs/strapi_api_key"
  description = "Strapi api key for IVS video processing"
  type        = "SecureString"
  value       = "TODO"

  lifecycle {
    ignore_changes = [
      insecure_value,
      value
    ]
  }
}

# WARN: This Lambda function is deployed with GitHub Actions, so it is not automatically deployed by Terraform. 
# The code package is a placeholder that needs to be updated with the actual code and deployment process in GitHub Actions.
data "archive_file" "ivs_function" {
  type        = "zip"
  source_file = "${path.root}/../../ivs-functions/src/index.ts"
  output_path = "${path.root}/../../ivs-functions/out/ivs-functions.zip"
}

resource "aws_lambda_function" "ivs_video_processing_function" {
  function_name = local.ivs_video_processing_lambda_name
  description   = "Lambda function that processes IVS video recordings when they become available."

  handler = "index.handler" # filename.exported_function_name
  runtime = "nodejs22.x"

  # Point to the placeholder code package
  filename         = data.archive_file.ivs_function.output_path
  source_code_hash = data.archive_file.ivs_function.output_base64sha256

  timeout       = 30
  memory_size   = 512
  architectures = ["x86_64"]
  role          = aws_iam_role.ivs_video_processing_function.arn

  environment {
    variables = {
      VIDEO_BASE_URL       = "https://${var.custom_domain_name}"
      STRAPI_API_URL       = var.strapi_api_url
      STRAPI_IVS_API_TOKEN = aws_ssm_parameter.strapi_api_key.name
    }
  }

  lifecycle {
    ignore_changes = [
      source_code_hash,
    ]
  }

  tags = {
    Name = local.ivs_video_processing_lambda_name
  }
}

resource "aws_lambda_permission" "allow_s3_invoke_ivs_video_processing_function" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ivs_video_processing_function.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.ivs_recordings.arn
}


resource "aws_s3_bucket_notification" "index_lambda_trigger" {
  bucket = aws_s3_bucket.ivs_recordings.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.ivs_video_processing_function.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = ""
    filter_suffix       = "recording-ended.json"
  }

  depends_on = [aws_lambda_permission.allow_s3_invoke_ivs_video_processing_function]
}



## POC Hearthbeat API ##

# 1. S3 Bucket for Storage
resource "aws_s3_bucket" "heartbeat_storage" {
  bucket = "${var.project_name}-webinar-heartbeats-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "heartbeat_storage_pac" {
  bucket = aws_s3_bucket.heartbeat_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 2. Kinesis Firehose 
resource "aws_kinesis_firehose_delivery_stream" "s3_delivery" {
  name        = "${var.project_name}-webinar-viewer-count"
  destination = "extended_s3"

  # No 'kinesis_source_configuration' block means it defaults to DIRECT_PUT

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = aws_s3_bucket.heartbeat_storage.arn

    # Prefixing for Athena optimization
    prefix              = "webinars/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/"
    error_output_prefix = "errors/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/!{firehose:error-output-type}/"

    buffering_size     = 5  # MB
    buffering_interval = 60 # Seconds
  }
}

# Firehose Role (To read from Kinesis and write to S3)
resource "aws_iam_role" "firehose_role" {
  name = "heartbeat_firehose_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = { Service = "firehose.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy" "firehose_s3_policy" {
  role = aws_iam_role.firehose_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = ["s3:PutObject", "s3:GetBucketLocation"],
        Effect = "Allow",
        Resource = [
          "${aws_s3_bucket.heartbeat_storage.arn}",
          "${aws_s3_bucket.heartbeat_storage.arn}/*"
        ]
      },
    ]
  })
}

# 3. Lambda Function

data "archive_file" "ingest_lambda_function" {
  type        = "zip"
  source_file = "${path.root}/../../webinar-metrics-functions/collect-metrics.py"
  output_path = "${path.root}/../../webinar-metrics-functions/out/collect-metrics.py.zip"
}

# Lambda Role (To write to Kinesis)
resource "aws_iam_role" "lambda_role" {
  name = "heartbeat_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = { Service = "lambda.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_kinesis_policy" {
  role = aws_iam_role.lambda_role.id
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
  name              = "/aws/lambda/${var.project_name}-heartbeat-ingest"
  retention_in_days = 14
}

resource "aws_iam_role_policy" "lambda_logging_policy" {
  name = "heartbeat_lambda_logging"
  role = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Effect   = "Allow"
      Resource = "${aws_cloudwatch_log_group.ingest_lambda_logs.arn}:*"
    }]
  })
}

resource "aws_lambda_function" "ingest_lambda" {
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

# Lambda needs permission to put directly to Firehose
resource "aws_iam_role_policy" "lambda_firehose_policy" {
  name = "lambda_firehose_direct_put"
  role = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = "firehose:PutRecord"
      Effect   = "Allow"
      Resource = aws_kinesis_firehose_delivery_stream.s3_delivery.arn
    }]
  })
}

# Create the Athena Database
resource "aws_athena_database" "webinar_db" {
  name   = "webinar_analytics"
  bucket = aws_s3_bucket.heartbeat_storage.id
}

# Athena Workgroup
resource "aws_athena_workgroup" "webinar_analytics" {
  name = "${var.project_name}-webinar-analytics"

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


# Athena Named Query for creating the CloudFront access logs table
resource "aws_athena_named_query" "create_webinar_count_table" {
  name      = "create_webinar_count_table"
  database  = aws_athena_database.webinar_db.name
  workgroup = aws_athena_workgroup.webinar_analytics.id
  query     = <<-EOQ
CREATE EXTERNAL TABLE webinar_heartbeats(
webinarid string, 
userid string, 
clientip string, 
receivedat string,
isLive boolean,
action string)
PARTITIONED BY ( 
  year string, 
  month string, 
  day string, 
  hour string)
ROW FORMAT SERDE 
  'org.openx.data.jsonserde.JsonSerDe' 
WITH SERDEPROPERTIES ( 
  'ignore.malformed.json'='true') 
STORED AS INPUTFORMAT 
  'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.IgnoreKeyTextOutputFormat'
LOCATION
  's3://${aws_s3_bucket.heartbeat_storage.bucket}/'
TBLPROPERTIES (
  'projection.day.digits'='2', 
  'projection.day.range'='1,31', 
  'projection.day.type'='integer', 
  'projection.enabled'='true', 
  'projection.hour.digits'='2', 
  'projection.hour.range'='0,23', 
  'projection.hour.type'='integer', 
  'projection.month.digits'='2', 
  'projection.month.range'='1,12', 
  'projection.month.type'='integer', 
  'projection.year.range'='2025,2050', 
  'projection.year.type'='integer', 
  'storage.location.template'='s3://${aws_s3_bucket.heartbeat_storage.bucket}/webinars/year=$${year}/month=$${month}/day=$${day}/hour=$${hour}/', 
  'transient_lastDdlTime'='1767892143')
  EOQ

  description = "Creates the Webinar count table for querying video distribution access logs"
}


## enbd POC Hearthbeat API ##