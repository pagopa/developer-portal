locals {
  prefix                    = "${var.module}-${var.environment}"
  langfuse_domain_name      = "mon3.${var.custom_domain_name}"
  langfuse_master_email     = "devportal@pagopa.it"
  langfuse_master_user_name = "master"
}
