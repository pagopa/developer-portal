resource "aws_api_gateway_rest_api" "api" {
  name        = "${local.prefix}-rest-api-gateway"
  description = "Chatbot API Gateway"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "stage" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = var.environment

  depends_on = [
    aws_api_gateway_integration.chatbot
  ]
}

resource "aws_api_gateway_base_path_mapping" "path_mapping" {
  api_id      = aws_api_gateway_rest_api.api.id
  domain_name = aws_api_gateway_domain_name.domain_name.domain_name
  stage_name  = aws_api_gateway_deployment.stage.stage_name
}

resource "aws_api_gateway_domain_name" "domain_name" {
  certificate_arn = module.ssl_certificate_us_east_1.acm_certificate_arn
  domain_name     = "restapi.${var.dns_chatbot_hosted_zone.name}"
}

resource "aws_api_gateway_authorizer" "authorizer" {
  name          = "${local.prefix}-cognito-authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.api.id
  provider_arns = [var.cognito_user_pool.arn]
}

resource "aws_api_gateway_resource" "chatbot" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "chatbot" {
  rest_api_id          = aws_api_gateway_rest_api.api.id
  resource_id          = aws_api_gateway_resource.chatbot.id
  http_method          = "ANY"
  authorization        = "COGNITO_USER_POOLS"
  authorizer_id        = aws_api_gateway_authorizer.authorizer.id
  authorization_scopes = ["openid"]

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_method_settings" "chatbot" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_deployment.stage.stage_name
  method_path = "*/*"
  settings {
    logging_level = "INFO"
    data_trace_enabled = true
    metrics_enabled = true
  }
}

resource "aws_api_gateway_integration" "chatbot" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.chatbot.id
  http_method             = aws_api_gateway_method.chatbot.http_method
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${module.lambda_function.lambda_function_arn}/invocations"
  integration_http_method = "ANY"
  # TODO: fix when AWS quota increase case is resolved
  #   timeout_milliseconds = local.lambda_timeout * 1000
  timeout_milliseconds = 29000
  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

resource "aws_api_gateway_account" "chatbot" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}