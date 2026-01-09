locals {
  prefix               = "${var.module}-${var.environment}"
  langfuse_domain_name = "mon3.${var.custom_domain_name}"
}
