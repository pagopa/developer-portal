locals {

  opennext_domain = "open-next.${var.dns_domain_name}"

  dns_domain_name_static_contents = format("static-contents.%s", var.dns_domain_name)
}