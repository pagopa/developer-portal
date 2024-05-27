locals {
  prefix         = "${var.module}-${var.environment}"
  lambda_timeout = "900"
}