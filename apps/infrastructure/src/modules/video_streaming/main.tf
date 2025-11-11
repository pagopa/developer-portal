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


# 1. Archive the Lambda source code into a ZIP file.
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../../ivs-functions"
  output_path = "${path.module}/../../builds/ivs-video-processing.zip"
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

resource "aws_lambda_function" "ivs_video_processing_function" {
  function_name = local.ivs_video_processing_lambda_name
  description   = "Lambda function that processes IVS video recordings when they become available."

  handler = "index.handler" # filename.exported_function_name
  runtime = "nodejs22.x"

  # Point to the placeholder code package
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  timeout       = 30
  memory_size   = 512
  architectures = ["x86_64"]
  role          = aws_iam_role.ivs_video_processing_function.arn

  environment {
    variables = {
      VIDEO_BASE_URL           = "https://${var.custom_domain_name}"
      STRAPI_API_URL           = var.strapi_api_url
      STRASTRAPI_IVS_API_TOKEN = aws_ssm_parameter.strapi_api_key.name
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
