module "dynamodb_chatbot_queries" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=715399dbe24f6443820bf5de80f6100b35d56355" # v4.0.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = false

  name                           = "${local.prefix}-queries"
  hash_key                       = "sessionId"
  range_key                      = "id"
  server_side_encryption_enabled = true

  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "sessionId"
      type = "S"
    },
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
      type = "S"  # String (for ISO 8601 timestamp)
    },
  ]

  # GSI for query on created_at
  global_secondary_index {
    name               = "SessionsByCreatedAtIndex"
    hash_key           = "userId"
    range_key          = "createdAt"
    read_capacity      = 5
    write_capacity     = 5
    projection_type    = "ALL"
  }
}
