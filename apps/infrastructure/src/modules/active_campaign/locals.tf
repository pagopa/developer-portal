locals {
  prefix = "${var.module}-${var.environment}"

  sqs_message_group_id = "userEvents"
}