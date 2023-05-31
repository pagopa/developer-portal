output "terraform_backend_bucket_name" {
  value = aws_s3_bucket.terraform_states.bucket
}

output "terraform_lock_dynamodb_table" {
  value = aws_dynamodb_table.dynamodb-terraform-state-lock.name
}
