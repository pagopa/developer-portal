{
  "openapi": "3.0.1",
  "info": {
    "title": "${api_name}",
    "description": "API for interacting with the Chatbot service.",
    "version": "0.1.0"
  },
  "paths": {
    "/health": {
      "get": {
        "tags": ["Health Checks"],
        "summary": "Check Chatbot API service is running",
        "operationId": "health_check_health_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/health",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "GET",
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    },
    "/health/db": {
      "get": {
        "tags": ["Health Checks"],
        "summary": "Check Chatbot API database connectivity",
        "operationId": "health_check_db_health_db_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/health/db",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "GET",
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    },
    "/sessions/all": {
      "get": {
        "tags": ["Sessions"],
        "summary": "Get all sessions for the authenticated user",
        "operationId": "get_sessions_sessions_all_get",
        "parameters": [
          {
            "name": "x-user-id",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "X-User-Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessions retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SessionResponseDTO"
                  },
                  "title": "Response Get Sessions Sessions All Get"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/sessions/all",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "GET",
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    },
    "/sessions/{session_id}": {
      "get": {
        "tags": ["Sessions"],
        "summary": "Get a session by its ID",
        "operationId": "get_session_sessions__session_id__get",
        "parameters": [
          {
            "name": "session_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "Session Id"
            }
          },
          {
            "name": "x-user-id",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "X-User-Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Session retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SessionResponseDTO"
                }
              }
            }
          },
          "404": {
            "description": "Session not found"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/sessions/{session_id}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "GET",
          "requestParameters": {
            "integration.request.path.session_id": "method.request.path.session_id"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "delete": {
        "tags": ["Sessions"],
        "summary": "Delete a session by its ID",
        "operationId": "delete_session_sessions__session_id__delete",
        "parameters": [
          {
            "name": "session_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "Session Id"
            }
          },
          {
            "name": "x-user-id",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "X-User-Id"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Session deleted successfully"
          },
          "404": {
            "description": "Session not found"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/sessions/{session_id}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "DELETE",
          "requestParameters": {
            "integration.request.path.session_id": "method.request.path.session_id"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    },
    "/sessions": {
      "post": {
        "tags": ["Sessions"],
        "summary": "Create a new session for the authenticated user",
        "operationId": "create_session_sessions_post",
        "parameters": [
          {
            "name": "x-user-id",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "X-User-Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateSessionDTO"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Session created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SessionResponseDTO"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/sessions",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "POST",
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    },
    "/sessions/{session_id}/clear": {
      "post": {
        "tags": ["Sessions"],
        "summary": "Clear the selected session for the authenticated user",
        "operationId": "clear_session_sessions__session_id__clear_post",
        "parameters": [
          {
            "name": "session_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "Session Id"
            }
          },
          {
            "name": "x-user-id",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "X-User-Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Session cleared successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SessionResponseDTO"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/sessions/{session_id}/clear",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "POST",
          "requestParameters": {
            "integration.request.path.session_id": "method.request.path.session_id"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    },
    "/queries/{session_id}": {
      "get": {
        "tags": ["Queries"],
        "summary": "Get queries for a session",
        "operationId": "get_queries_queries__session_id__get",
        "parameters": [
          {
            "name": "session_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "Session Id"
            }
          },
          {
            "name": "x-user-id",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "X-User-Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Queries retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/QueryResponseDTO"
                  },
                  "title": "Response Get Queries Queries  Session Id  Get"
                }
              }
            }
          },
          "404": {
            "description": "Session not found"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/queries/{session_id}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "GET",
          "requestParameters": {
            "integration.request.path.session_id": "method.request.path.session_id"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      },
      "post": {
        "tags": ["Queries"],
        "summary": "Create a new query for a session",
        "operationId": "create_query_queries__session_id__post",
        "parameters": [
          {
            "name": "session_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Session Id"
            }
          },
          {
            "name": "x-user-id",
            "in": "header",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid",
              "title": "X-User-Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateQueryDTO"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Query created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QueryResponseDTO"
                }
              }
            }
          },
          "404": {
            "description": "Session not found"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [{ "api_key": [] }],
        "x-amazon-apigateway-integration": {
          "uri": "${nlb_base_uri}/queries/{session_id}",
          "connectionId": "${vpc_link_id}",
          "httpMethod": "POST",
          "requestParameters": {
            "integration.request.path.session_id": "method.request.path.session_id"
          },
          "connectionType": "VPC_LINK",
          "passthroughBehavior": "when_no_match",
          "timeoutInMillis": 29000,
          "type": "http_proxy"
        }
      }
    }
  },
  "components": {
    "schemas": {
      "CreateQueryDTO": {
        "properties": {
          "question": {
            "type": "string",
            "title": "Question"
          }
        },
        "type": "object",
        "required": ["question"],
        "title": "CreateQueryDTO"
      },
      "CreateSessionDTO": {
        "properties": {
          "title": {
            "type": "string",
            "title": "Title"
          }
        },
        "type": "object",
        "required": ["title"],
        "title": "CreateSessionDTO"
      },
      "FileContext": {
        "properties": {
          "chunkId": {
            "type": "integer",
            "title": "Chunkid"
          },
          "content": {
            "type": "string",
            "title": "Content"
          },
          "score": {
            "anyOf": [{ "type": "number" }, { "type": "null" }],
            "title": "Score"
          }
        },
        "type": "object",
        "required": ["chunkId", "content", "score"],
        "title": "FileContext"
      },
      "HTTPValidationError": {
        "properties": {
          "detail": {
            "items": {
              "$ref": "#/components/schemas/ValidationError"
            },
            "type": "array",
            "title": "Detail"
          }
        },
        "type": "object",
        "title": "HTTPValidationError"
      },
      "QueryResponseDTO": {
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "title": "Id"
          },
          "sessionId": {
            "type": "string",
            "format": "uuid",
            "title": "Sessionid"
          },
          "question": {
            "type": "string",
            "title": "Question"
          },
          "answer": {
            "type": "string",
            "title": "Answer"
          },
          "badAnswer": {
            "type": "boolean",
            "title": "Badanswer"
          },
          "topic": {
            "items": { "type": "string" },
            "type": "array",
            "title": "Topic"
          },
          "context": {
            "additionalProperties": {
              "items": {
                "$ref": "#/components/schemas/FileContext"
              },
              "type": "array"
            },
            "type": "object",
            "title": "Context"
          },
          "createdAt": {
            "type": "string",
            "title": "Createdat"
          },
          "expiresAt": {
            "anyOf": [{ "type": "string" }, { "type": "null" }],
            "title": "Expiresat"
          }
        },
        "type": "object",
        "required": ["id", "sessionId", "question", "answer", "badAnswer", "topic", "context", "createdAt", "expiresAt"],
        "title": "QueryResponseDTO"
      },
      "SessionResponseDTO": {
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "title": "Id"
          },
          "userId": {
            "type": "string",
            "format": "uuid",
            "title": "Userid"
          },
          "title": {
            "type": "string",
            "title": "Title"
          },
          "createdAt": {
            "type": "string",
            "title": "Createdat"
          },
          "expiresAt": {
            "anyOf": [{ "type": "string" }, { "type": "null" }],
            "title": "Expiresat"
          }
        },
        "type": "object",
        "required": ["id", "userId", "title", "createdAt", "expiresAt"],
        "title": "SessionResponseDTO"
      },
      "ValidationError": {
        "properties": {
          "loc": {
            "items": {
              "anyOf": [{ "type": "string" }, { "type": "integer" }]
            },
            "type": "array",
            "title": "Location"
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        },
        "type": "object",
        "required": ["loc", "msg", "type"],
        "title": "ValidationError"
      }
    },
    "securitySchemes": {
      "api_key": {
        "type": "apiKey",
        "name": "x-api-key",
        "in": "header"
      }
    }
  }
}
