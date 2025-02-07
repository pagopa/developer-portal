resource "aws_route53_zone" "docs_pagopa_it" {
  name = "docs.pagopa.it"
}

resource "aws_route53_record" "www_website" {
  zone_id = aws_route53_zone.docs_pagopa_it.zone_id
  name    = var.domain_to_redirect.from
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "google_search_docs" {
  zone_id = aws_route53_zone.docs_pagopa_it.zone_id
  ttl     = 3600
  name    = "odjlbhot6ftk"
  type    = "CNAME"
  records = ["gv-6xpbz6ot22lrxo.dv.googlehosted.com."]
}
