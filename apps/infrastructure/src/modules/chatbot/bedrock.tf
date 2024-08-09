resource "awscc_bedrock_guardrail" "guardrail" {
  name                      = "${var.module}-${var.environment}-safety-block-guardrail"
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
  guardrail_identifier = awscc_bedrock_guardrail.guardrail.guardrail_id
  description          = "Guardrail Version"
}
