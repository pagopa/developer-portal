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


# S3 bucket for CloudFront access logs
resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "${var.project_name}-cloudfront-logs-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "cloudfront_logs_pac" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "cloudfront_logs_oc" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "cloudfront_logs_acl" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  acl    = "private"

  depends_on = [aws_s3_bucket_ownership_controls.cloudfront_logs_oc]
}

# S3 bucket policy to allow CloudFront to write logs
resource "aws_s3_bucket_policy" "cloudfront_logs_policy" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AWSCloudFrontLogDeliveryWrite",
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action   = "s3:PutObject",
        Resource = "${aws_s3_bucket.cloudfront_logs.arn}/*",
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
          }
        }
      },
      {
        Sid    = "AWSCloudFrontLogDeliveryAclCheck",
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action   = "s3:GetBucketAcl",
        Resource = aws_s3_bucket.cloudfront_logs.arn,
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.cloudfront_logs_pac]
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

# Athena Database
resource "aws_athena_database" "cloudfront_logs" {
  name   = "${replace(var.project_name, "-", "_")}_cloudfront_logs"
  bucket = aws_s3_bucket.athena_results.id
}

# Athena Workgroup
resource "aws_athena_workgroup" "cloudfront_logs" {
  name = "${var.project_name}-cloudfront-logs"

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
resource "aws_athena_named_query" "create_cloudfront_logs_table" {
  name      = "create_cloudfront_logs_table"
  database  = aws_athena_database.cloudfront_logs.name
  workgroup = aws_athena_workgroup.cloudfront_logs.id
  query     = <<-EOQ
    CREATE EXTERNAL TABLE IF NOT EXISTS cloudfront_logs (
      log_date DATE,
      log_time STRING,
      x_edge_location STRING,
      sc_bytes BIGINT,
      c_ip STRING,
      cs_method STRING,
      cs_host STRING,
      cs_uri_stem STRING,
      sc_status INT,
      cs_referer STRING,
      cs_user_agent STRING,
      cs_uri_query STRING,
      cs_cookie STRING,
      x_edge_result_type STRING,
      x_edge_request_id STRING,
      x_host_header STRING,
      cs_protocol STRING,
      cs_bytes BIGINT,
      time_taken FLOAT,
      x_forwarded_for STRING,
      ssl_protocol STRING,
      ssl_cipher STRING,
      x_edge_response_result_type STRING,
      cs_protocol_version STRING,
      fle_status STRING,
      fle_encrypted_fields INT,
      c_port INT,
      time_to_first_byte FLOAT,
      x_edge_detailed_result_type STRING,
      sc_content_type STRING,
      sc_content_len BIGINT,
      sc_range_start BIGINT,
      sc_range_end BIGINT
    )
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY '\t'
    LOCATION 's3://${aws_s3_bucket.cloudfront_logs.bucket}/'
    TBLPROPERTIES ('skip.header.line.count'='2')
  EOQ

  description = "Creates the CloudFront access logs table for querying video distribution access logs"
}

# Athena Named Query for sample queries
resource "aws_athena_named_query" "sample_cloudfront_queries" {
  name      = "sample_cloudfront_log_queries"
  database  = aws_athena_database.cloudfront_logs.name
  workgroup = aws_athena_workgroup.cloudfront_logs.id
  query     = <<-EOQ
    -- Sample queries for CloudFront access logs

    -- 1. Count requests by HTTP status
    SELECT sc_status, COUNT(*) as count
    FROM cloudfront_logs
    GROUP BY sc_status
    ORDER BY count DESC;

    -- 2. Top 10 most accessed videos
    SELECT cs_uri_stem, COUNT(*) as access_count
    FROM cloudfront_logs
    WHERE cs_uri_stem LIKE '%.m3u8' OR cs_uri_stem LIKE '%.ts'
    GROUP BY cs_uri_stem
    ORDER BY access_count DESC
    LIMIT 10;

    -- 3. Requests by client IP
    SELECT c_ip, COUNT(*) as request_count
    FROM cloudfront_logs
    GROUP BY c_ip
    ORDER BY request_count DESC
    LIMIT 20;

    -- 4. Total bytes served by day
    SELECT 
      log_date,
      SUM(sc_bytes) as total_bytes_sent,
      COUNT(*) as total_requests
    FROM cloudfront_logs
    GROUP BY log_date
    ORDER BY log_date DESC;

    -- 5. Cache hit/miss analysis
    SELECT 
      x_edge_result_type,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
    FROM cloudfront_logs
    GROUP BY x_edge_result_type
    ORDER BY count DESC;

    -- 6. Error requests (4xx and 5xx)
    SELECT log_date, log_time, c_ip, cs_method, cs_uri_stem, sc_status, x_edge_result_type
    FROM cloudfront_logs
    WHERE sc_status >= 400
    ORDER BY log_date DESC, log_time DESC
    LIMIT 100;

    -- 7. Average response time by URI
    SELECT 
      cs_uri_stem,
      COUNT(*) as request_count,
      ROUND(AVG(time_taken), 3) as avg_time_taken,
      ROUND(AVG(time_to_first_byte), 3) as avg_ttfb
    FROM cloudfront_logs
    GROUP BY cs_uri_stem
    HAVING COUNT(*) > 10
    ORDER BY avg_time_taken DESC
    LIMIT 20;

    -- 8. Bandwidth consumption by edge location
    SELECT 
      x_edge_location,
      COUNT(*) as requests,
      SUM(sc_bytes) as total_bytes
    FROM cloudfront_logs
    GROUP BY x_edge_location
    ORDER BY total_bytes DESC
    LIMIT 15;

    -- 9. User agents analysis (devices/browsers accessing videos)
    SELECT 
      CASE 
        WHEN cs_user_agent LIKE '%Mobile%' THEN 'Mobile'
        WHEN cs_user_agent LIKE '%Tablet%' OR cs_user_agent LIKE '%iPad%' THEN 'Tablet'
        ELSE 'Desktop'
      END as device_type,
      COUNT(*) as count
    FROM cloudfront_logs
    GROUP BY CASE 
        WHEN cs_user_agent LIKE '%Mobile%' THEN 'Mobile'
        WHEN cs_user_agent LIKE '%Tablet%' OR cs_user_agent LIKE '%iPad%' THEN 'Tablet'
        ELSE 'Desktop'
      END;
  EOQ

  description = "Sample queries for analyzing CloudFront access logs"
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

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.ivs_recordings.bucket_regional_domain_name
    origin_id                = "S3-${var.project_name}-ivs-recordings"
    origin_access_control_id = aws_cloudfront_origin_access_control.video_oac.id
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "CDN for IVS video recordings"
  #default_root_object = "index.html" # Optional, good practice

  # Enable access logging
  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.cloudfront_logs.bucket_domain_name
    prefix          = "cloudfront/"
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

data "aws_route53_zone" "selected" {
  zone_id = var.route53_zone_id
}


resource "aws_cloudfront_response_headers_policy" "cors_policy" {
  name    = "cors-policy-video-streaming"
  comment = "Cors policy for video streaming."

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

# Policy that allows CloudFront (via OAC) to read from the bucket
resource "aws_s3_bucket_policy" "allow_cloudfront_oac" {
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
            "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
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
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
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

locals {
  filename = "${path.root}/../../ivs-functions/out/ivs-functions.zip"
}

resource "aws_lambda_function" "ivs_video_processing_function" {
  function_name = local.ivs_video_processing_lambda_name
  description   = "Lambda function that processes IVS video recordings when they become available."

  handler = "index.handler" # filename.exported_function_name
  runtime = "nodejs22.x"

  # Point to the placeholder code package
  filename         = local.filename
  source_code_hash = filebase64sha256(local.filename)

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

  /*
  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }
  */

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