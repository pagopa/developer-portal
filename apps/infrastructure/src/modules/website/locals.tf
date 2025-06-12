locals {
  is_standalone = var.website_is_standalone ? toset(["standalone"]) : toset([])
  is_static     = var.website_is_standalone ? toset([]) : toset(["static"])

  dns_domain_name_static_contents = format("static-contents.%s", var.dns_domain_name)
}