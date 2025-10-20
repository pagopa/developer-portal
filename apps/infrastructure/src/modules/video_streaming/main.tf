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
  }

  # Standard restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Use the default CloudFront SSL/TLS certificate
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name} video streaming distribution"
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