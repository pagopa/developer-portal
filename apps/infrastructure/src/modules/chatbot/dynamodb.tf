module "dynamodb_chatbot_queries" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=715399dbe24f6443820bf5de80f6100b35d56355" # v4.0.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = false

  name                           = "${local.prefix}-queries"
  hash_key                       = "sessionId"
  range_key                      = "id"
  server_side_encryption_enabled = true
  ttl_attribute_name             = "expiresAt"
  ttl_enabled                    = true

  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "sessionId"
      type = "S"
    },
    {
      name = "createdAt"
      type = "S"
    },
    {
      name = "createdAtDate"
      type = "S"
    },
  ]

  # LSI for query on created_at
  local_secondary_indexes = [
    {
      name            = "QueriesByCreatedAtIndex"
      hash_key        = "userId"
      range_key       = "createdAt"
      projection_type = "ALL"
    }
  ]
  global_secondary_indexes = [
    {
      name            = "QueriesByCreatedAtDateIndex"
      hash_key        = "createdAtDate"
      range_key       = "sessionId"
      projection_type = "ALL"
    }
  ]
}

module "dynamodb_chatbot_sessions" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=715399dbe24f6443820bf5de80f6100b35d56355" # v4.0.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = false

  name                           = "${local.prefix}-sessions"
  hash_key                       = "userId"
  range_key                      = "id"
  server_side_encryption_enabled = true
  ttl_attribute_name             = "expiresAt"
  ttl_enabled                    = true

  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "userId"
      type = "S"
    },
    {
      name = "createdAt"
      type = "S"
    },
  ]

  # LSI for query on created_at
  local_secondary_indexes = [
    {
      name            = "SessionsByCreatedAtIndex"
      hash_key        = "userId"
      range_key       = "createdAt"
      projection_type = "ALL"
    }
  ]
}

module "dynamodb_chatbot_salts" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=715399dbe24f6443820bf5de80f6100b35d56355" # v4.0.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = false

  name                           = "${local.prefix}-salts"
  hash_key                       = "sessionId"
  server_side_encryption_enabled = true
  ttl_attribute_name             = "expiresAt"
  ttl_enabled                    = true

  attributes = [
    {
      name = "sessionId"
      type = "S"
    }
  ]
}
