# AGENTS.md

## Repository Overview
This is the PagoPA Developer Portal repository. It is a multi-language project:
- **Frontend**: Next.js (TypeScript) application.
- **AI/Backend**: Python-based GenAI Chatbot.
- **Infrastructure**: Terraform (HCL) targeting AWS.

## General Conventions
- **Language**: All code and documentation must be in English.
- **Formatting**: Run `prettier` for TS/JS before finishing.
- **Safety**: Never hardcode secrets or PagoPA-specific internal credentials.

## Technology Stack Specifics
### Next.js (apps/nextjs-website)
- Use functional components with TypeScript interfaces.
- Tailor UI components to follow the PagoPA Design System (refer to internal `design-system` packages).
- Use `npx changeset` for versioning.

### Python / GenAI
- Target Python 3.10+.
- Use type hints for all function signatures.
- For GenAI prompts, use a clear separation between "System" and "User" instructions.

### Terraform (infra/)
- Follow the PagoPA standard modules pattern.
- Always run `terraform fmt` and `tflint`.
- Infrastructure is AWS-based. Use tags for cost allocation (Project: DevPortal).