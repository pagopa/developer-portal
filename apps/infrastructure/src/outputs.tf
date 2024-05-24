output "terraform_backend_bucket_name" {
  value = module.identity.terraform_backend_bucket_name
}

output "terraform_lock_dynamodb_table" {
  value = module.identity.terraform_lock_dynamodb_table
}