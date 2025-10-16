# A single S3 bucket to store all recordings
resource "aws_s3_bucket" "ivs_recordings" {
  bucket = "${var.project_name}-recordings-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
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