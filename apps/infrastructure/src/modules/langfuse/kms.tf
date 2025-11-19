resource "aws_kms_key" "postgres" {
  description = "KMS key for encrypting RDS data"
  tags = {
    Name = "langfuse_postgres_kms"
  }
}
