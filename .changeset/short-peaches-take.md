---
"cognito-functions": major
---

Precompile Cognito email templates at build time instead of rendering MJML at runtime. This removes the runtime dependency on `mjml`, switches template minification to `html-minifier-next`, and centralizes the default locale used when a localized template is not available.
