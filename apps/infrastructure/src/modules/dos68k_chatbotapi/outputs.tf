output "ecs_cluster_arn" {
  value       = module.ecs_cluster.arn
  description = "The ARN of the ECS cluster"
}

output "ecr_repository_url" {
  value       = module.ecr.repository_url
  description = "The URL of the ECR repository"
}

output "api_gateway_invoke_url" {
  value       = aws_api_gateway_stage.chatbotapi.invoke_url
  description = "The invoke URL of the API Gateway stage"
}

output "api_key_id" {
  value       = aws_api_gateway_api_key.chatbotapi.id
  description = "The ID of the API key"
}

output "api_key_value" {
  value       = aws_api_gateway_api_key.chatbotapi.value
  description = "The value of the API key"
  sensitive   = true
}
