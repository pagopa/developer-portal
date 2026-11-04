# Webinar questions database

module "dynamodb_webinar_questions" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=c3b294d847c0fda84461b4693bf0eb6c95757180" # v4.4.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = true

  name                                  = "WebinarQuestions"
  hash_key                              = "webinarId"
  range_key                             = "createdAt"
  server_side_encryption_enabled        = true
  point_in_time_recovery_enabled        = true
  point_in_time_recovery_period_in_days = var.environment == "prod" ? 35 : 7

  attributes = [
    {
      name = "webinarId"
      type = "S"
    },
    {
      name = "createdAt"
      type = "S"
    },
  ]
}

# Webinar subscriptions

module "dynamodb_webinar_subscriptions" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=c3b294d847c0fda84461b4693bf0eb6c95757180" # v4.4.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = true

  name                                  = "WebinarSubscriptions"
  hash_key                              = "username"
  range_key                             = "webinarId"
  server_side_encryption_enabled        = true
  point_in_time_recovery_enabled        = true
  point_in_time_recovery_period_in_days = var.environment == "prod" ? 35 : 7

  stream_enabled   = true
  stream_view_type = "KEYS_ONLY"

  attributes = [
    {
      name = "username"
      type = "S"
    },
    {
      name = "webinarId"
      type = "S"
    },
  ]
}