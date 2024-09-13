# Chatbot queries

module "dynamodb_chatbot_queries" {
  source = "git::github.com/terraform-aws-modules/terraform-aws-dynamodb-table.git?ref=715399dbe24f6443820bf5de80f6100b35d56355" # v4.0.0

  billing_mode                = "PAY_PER_REQUEST"
  deletion_protection_enabled = false

  name                           = "ChatbotQueries"
  hash_key                       = "id"
  server_side_encryption_enabled = true

  attributes = [
    {
      name = "id"
      type = "S"
    },
  ]
}
