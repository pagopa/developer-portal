output "terraform_backend_bucket_name" {
  value = aws_s3_bucket.terraform_states.bucket
}

output "terraform_dynamodb_lock_table" {
  value = aws_dynamodb_table.dynamodb-terraform-state-lock.name
}
