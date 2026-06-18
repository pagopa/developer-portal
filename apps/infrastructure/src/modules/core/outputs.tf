
output "name_servers_records" {
  value = aws_route53_zone.dev_portal.name_servers
}

output "hosted_zone_id" {
  value = aws_route53_zone.dev_portal.zone_id
}

output "ses_domain_identity_arn" {
  value = module.ses_developer_pagopa_it.ses_domain_identity_arn
}

output "dns_chatbot_hosted_zone" {
  value = var.create_chatbot ? {
    name = aws_route53_zone.chatbot[0].name
    id   = aws_route53_zone.chatbot[0].zone_id
  } : {}
}

output "alerting_topic_arn" {
  value = aws_sns_topic.cloudwatch_alarms.arn
}

output "alerting_email" {
  value = aws_ssm_parameter.alerting_email.value
}
