locals {
  is_standalone = var.website_is_standalone ? toset(["standalone"]) : toset([])
  is_static     = var.website_is_standalone ? toset([]) : toset(["static"])
}