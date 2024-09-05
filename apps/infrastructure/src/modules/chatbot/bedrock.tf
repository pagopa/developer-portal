resource "awscc_bedrock_guardrail" "guardrail" {
  provider                  = awscc.eu-west-3
  name                      = "${local.prefix}-safety-block-guardrail"
  blocked_input_messaging   = "Mi dispiace, non mi è consentito elaborare contenuti inappropriati.\nRiformula la domanda in modo che non violi queste linee guida."
  blocked_outputs_messaging = "Mi dispiace, non mi è consentito elaborare contenuti inappropriati.\nRiformula la domanda in modo che non violi queste linee guida."
  description               = "Guardrail that blocks offensive language and PII entities"

  content_policy_config = {
    filters_config = [
      {
        input_strength  = "MEDIUM",
        output_strength = "MEDIUM",
        type            = "SEXUAL"
      },
      {
        input_strength  = "MEDIUM",
        output_strength = "MEDIUM",
        type            = "HATE"
      },
      {
        input_strength  = "MEDIUM",
        output_strength = "MEDIUM",
        type            = "VIOLENCE"
      },
      {
        input_strength  = "MEDIUM",
        output_strength = "MEDIUM",
        type            = "INSULTS"
      },
      {
        input_strength  = "MEDIUM",
        output_strength = "MEDIUM",
        type            = "MISCONDUCT"
      },
      {
        input_strength  = "MEDIUM",
        output_strength = "NONE",
        type            = "PROMPT_ATTACK"
      }
    ]

    sensitive_information_policy_config = {
      pii_entities_config = [
        {
          action = "ANONYMIZE",
          type   = "NAME"
        },
        {
          action = "ANONYMIZE",
          type   = "PHONE"
        },
        {
          action = "ANONYMIZE",
          type   = "EMAIL"
        },
        {
          action = "ANONYMIZE",
          type   = "ADDRESS"
        },
        {
          action = "ANONYMIZE",
          type   = "USERNAME"
        },
        {
          action = "ANONYMIZE",
          type   = "PASSWORD"
        },
        {
          action = "ANONYMIZE",
          type   = "LICENSE_PLATE"
        },
        {
          action = "ANONYMIZE",
          type   = "DRIVER_ID"
        },
        {
          action = "ANONYMIZE",
          type   = "VEHICLE_IDENTIFICATION_NUMBER"
        },
        {
          action = "ANONYMIZE",
          type   = "CREDIT_DEBIT_CARD_CVV"
        },
        {
          action = "ANONYMIZE",
          type   = "CREDIT_DEBIT_CARD_NUMBER"
        },
        {
          action = "ANONYMIZE",
          type   = "PIN"
        },
        {
          action = "ANONYMIZE",
          type   = "SWIFT_CODE"
        },
        {
          action = "ANONYMIZE",
          type   = "INTERNATIONAL_BANK_ACCOUNT_NUMBER"
        },
        {
          action = "ANONYMIZE",
          type   = "AWS_ACCESS_KEY"
        },
        {
          action = "ANONYMIZE",
          type   = "AWS_SECRET_KEY"
        },
        {
          action = "ANONYMIZE",
          type   = "US_PASSPORT_NUMBER"
        },
        {
          action = "ANONYMIZE",
          type   = "US_BANK_ACCOUNT_NUMBER"
        },
        {
          action = "ANONYMIZE",
          type   = "US_SOCIAL_SECURITY_NUMBER"
        },
        {
          action = "ANONYMIZE",
          type   = "US_BANK_ROUTING_NUMBER"
        },
        {
          action = "ANONYMIZE",
          type   = "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER"
        }
      ]

      regexes_config = [
        {
          action  = "ANONYMIZE"
          name    = "IT_PASSPORT",
          pattern = "^[A-Za-z0-9]{2}[0-9]{7}$"
        },
        {
          action  = "ANONYMIZE"
          name    = "IT_FISCAL_CODE",
          pattern = "^[BCDFGHJKLMNPQRSTVWXYZ]{3}[BCDFGHJKLMNPQRSTVWXYZ]{3}[0-9]{2}[A-EHLMPRT]{1}[0-9]{2}[0-9]{4}[0-9]$"
        },
        {
          action  = "ANONYMIZE"
          name    = "IT_VAT_CODE",
          pattern = "^(IT|it|It|iT)[ .,-]?(\\d{11})$"
        },
        {
          action  = "ANONYMIZE"
          name    = "IT_IDENTITY_CARD",
          pattern = "^[A-Za-z]{2}[0-9]{7}$"
        },
        {
          action  = "ANONYMIZE"
          name    = "IT_DRIVE_LICENSE",
          pattern = "^[A-Za-z][AVav][0-9]{7}[A-Za-z]$"
        }
      ]
    }
  }

  tags = local.kv_tags
}

resource "awscc_bedrock_guardrail_version" "guardrail" {
  provider             = awscc.eu-west-3
  guardrail_identifier = awscc_bedrock_guardrail.guardrail.guardrail_id
  description          = "Guardrail Version"
}

module "bedrock_log_group" {
  count = var.environment == "dev" ? 1 : 0
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-cloudwatch.git//modules/log-group?ref=bf969da953bdbea229392255d2b36e7b720e917e" # v5.3.0
  providers = {
    aws = aws.eu-west-3
  }
  name              = "/chatbot/bedrock"
  retention_in_days = 14
}

resource "aws_bedrock_model_invocation_logging_configuration" "this" {
  count = var.environment == "dev" ? 1 : 0
  provider = aws.eu-west-3
  logging_config {
    embedding_data_delivery_enabled = false
    image_data_delivery_enabled     = false
    text_data_delivery_enabled      = true
    cloudwatch_config {
      log_group_name = module.bedrock_log_group[0].cloudwatch_log_group_name
      role_arn       = module.iam_role_bedrock_logging[0].iam_role_arn
    }
  }
}