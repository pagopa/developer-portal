# Copilot Instructions

## Working Style
- Be concise. Avoid explaining basic language features.
- If a task involves PagoPA infrastructure, prioritize using the custom Terraform modules in `apps/infrastructure/src/modules`.
- When generating React components, ensure WCAG 2.1 AA accessibility standards are met.

## Project Guardrails
- **Infrastructure**: Prefer Terraform-first workflows and the existing infrastructure modules; only suggest manual AWS Console steps when unavoidable or when existing project documentation explicitly requires them.
- **Python**: Use `pydantic` for data validation in the GenAI chatbot logic.
- **Testing**:
  - TS: Use Jest for unit tests.
  - Python: Use `pytest`.
  - Infrastructure: Run `pre-commit` hooks for terraform-docs.

## Context Mapping
- Refer to `apps/nextjs-website` for frontend logic.
- Refer to `apps/infrastructure/src/modules` for AWS resource definitions.