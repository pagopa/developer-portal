resource "aws_service_discovery_private_dns_namespace" "langfuse" {
  name        = "langfuse.local"
  description = "Langfuse Service Discovery namespace"
  vpc         = var.vpc_id
}

resource "aws_service_discovery_service" "clickhouse" {
  name = "${local.prefix}-clickhouse"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.langfuse.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  health_check_config {
    failure_threshold = 1
  }
}
