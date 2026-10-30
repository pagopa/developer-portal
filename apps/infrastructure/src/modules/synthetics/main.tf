resource "awscc_synthetics_canary" "heartbeat" {
  name                 = var.name
  artifact_s3_location = "s3://${aws_s3_bucket.artifacts.bucket}/${var.artifact_prefix}"
  execution_role_arn   = aws_iam_role.heartbeat.arn
  runtime_version      = var.runtime_version

  code = {
    handler = "pageLoadBlueprint.handler"
    script  = file("${path.module}/pageLoadBlueprint.js")
  }

  browser_configs = [
    { browser_type = "CHROME" },
    { browser_type = "FIREFOX" },
  ]

  schedule = {
    expression          = var.schedule_expression
    duration_in_seconds = "0"
    retry_config = {
      max_retries = 0
    }
  }

  run_config = {
    timeout_in_seconds = var.timeout_in_seconds
    memory_in_mb       = var.memory_in_mb
    active_tracing     = false
    ephemeral_storage  = 1024
    environment_variables = {
      URLS = jsonencode(var.urls)
    }
  }

  success_retention_period     = 31
  failure_retention_period     = 31
  start_canary_after_creation  = true
  provisioned_resource_cleanup = "AUTOMATIC"

  tags = [for key, value in var.tags : { key = key, value = value }]

  depends_on = [
    aws_iam_role_policy_attachment.heartbeat,
    aws_cloudwatch_log_group.heartbeat,
    aws_s3_bucket_public_access_block.artifacts,
    aws_s3_bucket_server_side_encryption_configuration.artifacts,
  ]

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_cloudwatch_log_group" "heartbeat" {
  for_each = var.log_group_names

  name = each.value
  tags = var.tags
}
