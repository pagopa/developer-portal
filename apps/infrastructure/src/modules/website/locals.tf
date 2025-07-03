locals {

  opennext_domain = "open-next.${var.dns_domain_name}"

  dns_domain_name_static_contents = format("static-contents.%s", var.dns_domain_name)

  # This is the temporary domain name for the old static website.
  domain_name_static_website = format("static.%s", var.dns_domain_name)
}