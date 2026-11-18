locals {
  video_waf_alarm_pattern = jsonencode({
    source        = ["aws.cloudwatch"]
    "detail-type" = ["CloudWatch Alarm State Change"]
    resources     = values(module.video_waf.alarm_arns)
    detail = {
      state = { value = ["ALARM"] }
    }
  })
}

data "aws_cloudwatch_event_bus" "video_alerts" {
  name = "default"
}

# CloudWatch SNS actions require a same-Region topic. Forward the CloudFront
# alarm transitions from us-east-1 to the video topic's Region.
resource "aws_cloudwatch_event_rule" "video_waf_alarm_forward" {
  provider = aws.us-east-1

  name          = "${var.project_name}-video-waf-alarm-forward"
  event_pattern = local.video_waf_alarm_pattern
}

resource "aws_cloudwatch_event_rule" "video_waf_alarm_notify" {
  name          = "${var.project_name}-video-waf-alarm-notify"
  event_pattern = local.video_waf_alarm_pattern
}

resource "aws_iam_role" "video_waf_alarm_delivery" {
  name = "${var.project_name}-video-waf-alarm-delivery"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRole"
      Principal = { Service = "events.amazonaws.com" }
      Condition = {
        ArnEquals = {
          "aws:SourceArn" = [
            aws_cloudwatch_event_rule.video_waf_alarm_forward.arn,
            aws_cloudwatch_event_rule.video_waf_alarm_notify.arn,
          ]
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "video_waf_alarm_delivery" {
  name = "deliver-video-waf-alarms"
  role = aws_iam_role.video_waf_alarm_delivery.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "events:PutEvents"
        Resource = data.aws_cloudwatch_event_bus.video_alerts.arn
      },
      {
        Effect   = "Allow"
        Action   = "sns:Publish"
        Resource = aws_sns_topic.alerts.arn
      },
    ]
  })
}

resource "aws_cloudwatch_event_target" "video_waf_alarm_forward" {
  provider = aws.us-east-1

  rule     = aws_cloudwatch_event_rule.video_waf_alarm_forward.name
  arn      = data.aws_cloudwatch_event_bus.video_alerts.arn
  role_arn = aws_iam_role.video_waf_alarm_delivery.arn

  depends_on = [aws_iam_role_policy.video_waf_alarm_delivery]
}

resource "aws_cloudwatch_event_target" "video_waf_alarm_notify" {
  rule     = aws_cloudwatch_event_rule.video_waf_alarm_notify.name
  arn      = aws_sns_topic.alerts.arn
  role_arn = aws_iam_role.video_waf_alarm_delivery.arn

  depends_on = [aws_iam_role_policy.video_waf_alarm_delivery]
}
