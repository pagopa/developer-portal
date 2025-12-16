resource "aws_s3_bucket" "langfuse_blob" {
  bucket        = "${local.prefix}-langfuse-blob"
  force_destroy = var.force_delete
}

resource "aws_s3_bucket" "langfuse_event" {
  bucket        = "${local.prefix}-langfuse-event"
  force_destroy = var.force_delete
}

# resource "aws_s3_bucket" "langfuse_clickhouse" {
#   bucket        = "${local.prefix}-langfuse-clickhouse"
#   force_destroy = var.force_delete
# }
