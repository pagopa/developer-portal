moved {
  from = aws_wafv2_web_acl.public_albs
  to   = aws_wafv2_web_acl.public_endpoints
}

moved {
  from = aws_wafv2_web_acl_association.public_albs
  to   = aws_wafv2_web_acl_association.regional
}
