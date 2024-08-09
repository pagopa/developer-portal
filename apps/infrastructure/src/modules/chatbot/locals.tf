locals {
  prefix = "${var.module}-${var.environment}"

  kv_tags = [ for key, value in var.tags : { key = key, value = value }]
}