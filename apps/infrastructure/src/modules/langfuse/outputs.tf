output "service_discovery_endpoint" {
  description = "The private address of the service discovery of langfuse-web"
  value       = "http://${aws_service_discovery_service.langfuse-web.name}.${aws_service_discovery_private_dns_namespace.langfuse.name}:3000"
}
