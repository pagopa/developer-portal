# cognito-functions

AWS Lambda handlers used by the DevPortal Cognito User Pool.

This package contains the Cognito trigger functions for sign-up, custom authentication, OTP verification, and post-confirmation emails. It is bundled as a single Lambda artifact and deployed with different handlers wired to different Cognito triggers.

## What this app does

The package exports these handlers from `src/main.ts`:

- `customMessageHandler`: builds Cognito email messages for sign-up confirmation, resend code, forgot password, and email change confirmation.
- `postConfirmationHandler`: sends the welcome email after successful sign-up confirmation.
- `defineAuthChallengeHandler`: defines the custom auth flow sequence after SRP and password verification.
- `createAuthChallengeHandler`: generates the OTP, emails it to the user through SES, and stores the expected verification code in the private challenge parameters.
- `verifyAuthChallengeHandler`: validates the OTP provided by the user.
- `createPreSignUpHandler`: blocks sign-up attempts from email domains that are not explicitly allowed.

## Runtime configuration

The handlers read their configuration from environment variables.

| Variable | Required by | Purpose |
| --- | --- | --- |
| `DOMAIN` | `customMessageHandler`, `postConfirmationHandler`, `createAuthChallengeHandler` | Public DevPortal domain used to build links and image URLs in emails. |
| `FROM_EMAIL_ADDRESS` | `postConfirmationHandler`, `createAuthChallengeHandler` | Sender address used by SES for OTP and welcome emails. |
| `SIGNUP_ALLOWED_EMAIL_DOMAINS` | `createPreSignUpHandler` | JSON array of allowed email domains, for example `["example.com"]`. |

Notes:

- `customMessageHandler` returns HTML and subject back to Cognito. It does not send email directly.
- `postConfirmationHandler` and `createAuthChallengeHandler` send email with AWS SES.
- Locale selection uses `custom:preferred_language` and falls back to `it`.

## Email templates

Email HTML is not rendered from MJML at runtime.

Instead, the package uses a build-time pipeline:

1. MJML source templates live in `src/templates/template-sources.ts`.
2. `npm run generate:templates` compiles MJML to HTML and minifies it.
3. The generated output is written to `src/templates/generated/precompiled-email-templates.ts`.
4. Runtime code loads the precompiled HTML and replaces placeholders with escaped values such as OTP, links, first name, and domain.

This design keeps `mjml` and `html-minifier-next` out of the Lambda runtime dependency graph while preserving the current email authoring model.

If you change email copy or layout, regenerate the templates before building or testing. The package scripts already do this automatically.

## Scripts

Run commands from the workspace root with `-w cognito-functions`, or from this directory directly.

| Command | Purpose |
| --- | --- |
| `npm run generate:templates` | Compile MJML source templates into the generated HTML module. |
| `npm run clean` | Remove `dist`, `out`, and generated templates. |
| `npm run compile` | Generate templates, then run TypeScript compilation. |
| `npm run build` | Generate templates, bundle the Lambda with esbuild, and zip the artifact in `out/cognito-functions.zip`. |
| `npm run test` | Generate templates, compile TypeScript, and run the Jest suite. |
| `npm run lint` | Run ESLint on `src`. |

## Local development

Typical workflow:

1. Update handler or template code.
2. Run `npm run test -w cognito-functions`.
3. Run `npm run build -w cognito-functions`.
4. Use `out/cognito-functions.zip` as the deployment artifact.

If you are only changing email templates, `npm run generate:templates -w cognito-functions` is enough to validate the precompilation step.

## Auth flow summary

The custom authentication flow is:

1. Cognito performs `SRP_A`.
2. `defineAuthChallengeHandler` requests `PASSWORD_VERIFIER`.
3. After successful password verification, `defineAuthChallengeHandler` requests `CUSTOM_CHALLENGE`.
4. `createAuthChallengeHandler` generates a 6-digit OTP and sends it through SES.
5. `verifyAuthChallengeHandler` compares the user answer with the expected OTP.
6. `defineAuthChallengeHandler` issues tokens only when the custom challenge succeeds.

`OTP_DURATION_MINUTES` is currently set to `15` in `src/create-auth-challenge-handler.ts`.

## Testing

The package uses Jest with `ts-jest`. Existing tests cover:

- Custom message email generation
- OTP email creation and subject localization
- Post-confirmation email sending
- Define and verify auth challenge behavior

Run:

```sh
npm run test -w cognito-functions
```

## Deployment artifact

With the dedicated GitHub workflow **Deploy Cognito Lambda Functions**

Or manually by building the package by running:

```sh
npm run build -w cognito-functions
```

The build produces:

```sh
apps/cognito-functions/out/cognito-functions.zip
```

The artifact can be uploaded direcly to AWS Lambda service via ZIP upload.
