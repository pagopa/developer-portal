###############################################################################
#                           API Gateway REST API                              #
###############################################################################
resource "aws_api_gateway_rest_api" "chatbotapi" {
  name        = "${local.prefix}-chatbotapi-rest-api"
  description = "dos68k Chatbot API Gateway"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

###############################################################################
#                            VPC Link                                         #
###############################################################################
resource "aws_api_gateway_vpc_link" "chatbotapi" {
  name        = "${local.prefix}-chatbotapi-vpc-link"
  target_arns = [module.nlb.arn]
}

###############################################################################
#                        Proxy Resource + Methods                             #
###############################################################################
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.chatbotapi.id
  parent_id   = aws_api_gateway_rest_api.chatbotapi.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  for_each = toset(["GET", "POST", "PUT", "PATCH", "DELETE"])

  rest_api_id      = aws_api_gateway_rest_api.chatbotapi.id
  resource_id      = aws_api_gateway_resource.proxy.id
  http_method      = each.value
  authorization    = "NONE"
  api_key_required = true

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_method" "proxy_options" {
  rest_api_id      = aws_api_gateway_rest_api.chatbotapi.id
  resource_id      = aws_api_gateway_resource.proxy.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

###############################################################################
#                           Integrations                                      #
###############################################################################
resource "aws_api_gateway_integration" "proxy" {
  for_each = aws_api_gateway_method.proxy

  rest_api_id             = aws_api_gateway_rest_api.chatbotapi.id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = each.value.http_method
  type                    = "HTTP_PROXY"
  integration_http_method = each.value.http_method
  uri                     = "http://${module.nlb.dns_name}:${local.container_port}/{proxy}"
  connection_type         = "VPC_LINK"
  connection_id           = aws_api_gateway_vpc_link.chatbotapi.id
  timeout_milliseconds    = 29000

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

resource "aws_api_gateway_integration" "proxy_options" {
  rest_api_id             = aws_api_gateway_rest_api.chatbotapi.id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.proxy_options.http_method
  type                    = "HTTP_PROXY"
  integration_http_method = "OPTIONS"
  uri                     = "http://${module.nlb.dns_name}:${local.container_port}/{proxy}"
  connection_type         = "VPC_LINK"
  connection_id           = aws_api_gateway_vpc_link.chatbotapi.id
  timeout_milliseconds    = 29000

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

###############################################################################
#                     Root Resource Methods                                    #
###############################################################################
resource "aws_api_gateway_method" "root" {
  for_each = toset(["GET", "POST"])

  rest_api_id      = aws_api_gateway_rest_api.chatbotapi.id
  resource_id      = aws_api_gateway_rest_api.chatbotapi.root_resource_id
  http_method      = each.value
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "root" {
  for_each = aws_api_gateway_method.root

  rest_api_id             = aws_api_gateway_rest_api.chatbotapi.id
  resource_id             = aws_api_gateway_rest_api.chatbotapi.root_resource_id
  http_method             = each.value.http_method
  type                    = "HTTP_PROXY"
  integration_http_method = each.value.http_method
  uri                     = "http://${module.nlb.dns_name}:${local.container_port}/"
  connection_type         = "VPC_LINK"
  connection_id           = aws_api_gateway_vpc_link.chatbotapi.id
  timeout_milliseconds    = 29000
}

###############################################################################
#                     Deployment + Stage                                      #
###############################################################################
resource "aws_api_gateway_deployment" "chatbotapi" {
  rest_api_id = aws_api_gateway_rest_api.chatbotapi.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.proxy.id,
      aws_api_gateway_method.proxy,
      aws_api_gateway_integration.proxy,
      aws_api_gateway_method.proxy_options.id,
      aws_api_gateway_integration.proxy_options.id,
      aws_api_gateway_method.root,
      aws_api_gateway_integration.root,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.proxy,
    aws_api_gateway_integration.proxy_options,
    aws_api_gateway_integration.root,
  ]
}

resource "aws_api_gateway_stage" "chatbotapi" {
  deployment_id = aws_api_gateway_deployment.chatbotapi.id
  rest_api_id   = aws_api_gateway_rest_api.chatbotapi.id
  stage_name    = var.environment
}

resource "aws_api_gateway_method_settings" "chatbotapi" {
  rest_api_id = aws_api_gateway_rest_api.chatbotapi.id
  stage_name  = aws_api_gateway_stage.chatbotapi.stage_name
  method_path = "*/*"

  settings {
    logging_level      = "INFO"
    data_trace_enabled = true
    metrics_enabled    = true

    throttling_burst_limit = 80
    throttling_rate_limit  = 50
  }
}

###############################################################################
#                     API Gateway Account (CloudWatch)                        #
###############################################################################
resource "aws_api_gateway_account" "chatbotapi" {
  cloudwatch_role_arn = aws_iam_role.apigateway_cloudwatch.arn
}

###############################################################################
#                     API Key + Usage Plan                                    #
###############################################################################
resource "aws_api_gateway_api_key" "chatbotapi" {
  name    = "${local.prefix}-chatbotapi-api-key"
  enabled = true
}

resource "aws_api_gateway_usage_plan" "chatbotapi" {
  name        = "${local.prefix}-chatbotapi-usage-plan"
  description = "Usage plan for the dos68k Chatbot API"

  api_stages {
    api_id = aws_api_gateway_rest_api.chatbotapi.id
    stage  = aws_api_gateway_stage.chatbotapi.stage_name
  }

  throttle_settings {
    burst_limit = 80
    rate_limit  = 50
  }
}

resource "aws_api_gateway_usage_plan_key" "chatbotapi" {
  key_id        = aws_api_gateway_api_key.chatbotapi.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.chatbotapi.id
}
