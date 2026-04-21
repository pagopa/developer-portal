---
description: "Explain terraform plan."
agent: "agent"
tools: ["read", "execute"]
---

# Given this Terraform plan output ${file} (preferably terraform show -json plan.tfplan):

* List every resource marked for destruction or replacement (- and -/+, or delete actions).
* Explain the cause for each.
* Suggest safer alternatives:
* terraform apply -replace=RESOURCE_ADDR
* lifecycle { create_before_destroy = true }
* lifecycle { prevent_destroy = true }