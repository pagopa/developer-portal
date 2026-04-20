###############################################################################
#                           API Gateway REST API                              #
###############################################################################
resource "aws_api_gateway_rest_api" "chatbotapi" {
  name        = "${local.prefix}-chatbotapi-rest-api"
  description = "dos68k Chatbot API Gateway"

  body = templatefile("${path.module}/openapi/api-spec.json.tpl", {
    api_name     = "${local.prefix}-chatbotapi-rest-api"
    nlb_base_uri = "http://${module.nlb.dns_name}:${local.container_port}"
    vpc_link_id  = aws_api_gateway_vpc_link.chatbotapi.id
  })

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
#                     Deployment + Stage                                      #
###############################################################################
resource "aws_api_gateway_deployment" "chatbotapi" {
  rest_api_id = aws_api_gateway_rest_api.chatbotapi.id

  triggers = {
    redeployment = sha1(aws_api_gateway_rest_api.chatbotapi.body)
  }

  lifecycle {
    create_before_destroy = true
  }
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
