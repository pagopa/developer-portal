{
  "openapi": "3.0.1",
  "info": {
    "title": "${api_name}",
    "description": "dos68k Chatbot API Gateway",
    "version": "1.0.0"
  },
  "paths": {
    "/{proxy+}": {
      "get": {
        "parameters": [
          {
            "name": "proxy",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_proxy_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "GET",
          "requestParameters": {
            "integration.request.path.proxy": "method.request.path.proxy"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "post": {
        "parameters": [
          {
            "name": "proxy",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_proxy_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "POST",
          "requestParameters": {
            "integration.request.path.proxy": "method.request.path.proxy"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "put": {
        "parameters": [
          {
            "name": "proxy",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_proxy_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "PUT",
          "requestParameters": {
            "integration.request.path.proxy": "method.request.path.proxy"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "patch": {
        "parameters": [
          {
            "name": "proxy",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_proxy_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "PATCH",
          "requestParameters": {
            "integration.request.path.proxy": "method.request.path.proxy"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "delete": {
        "parameters": [
          {
            "name": "proxy",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_proxy_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "DELETE",
          "requestParameters": {
            "integration.request.path.proxy": "method.request.path.proxy"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "options": {
        "parameters": [
          {
            "name": "proxy",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_proxy_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "OPTIONS",
          "requestParameters": {
            "integration.request.path.proxy": "method.request.path.proxy"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    },
    "/": {
      "get": {
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_root_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "GET",
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "post": {
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_root_uri}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "POST",
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "api_key": {
        "type": "apiKey",
        "name": "x-api-key",
        "in": "header"
      }
    }
  }
}
