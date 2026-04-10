# Copilot Instructions

## Working Style
- Be concise. Avoid explaining basic language features.
- If a task involves PagoPA infrastructure, prioritize using the custom Terraform modules found in the `apps/infrastructure/src/modules` repository pattern.
- When generating React components, ensure WCAG 2.1 AA accessibility standards are met.

## Project Guardrails
- **Infrastructure**: Do not suggest manual AWS Console steps; everything must be via Terraform.
- **Python**: Use `pydantic` for data validation in the GenAI chatbot logic.
- **Testing**:
  - TS: Use Vitest/Jest for unit tests.
  - Python: Use `pytest`.
  - Infrastructure: Run `pre-commit` hooks for terraform-docs.

## Context Mapping
- Refer to `apps/nextjs-website` for frontend logic.
- Refer to `apps/infrastructure/src/modules` for AWS resource definitions.