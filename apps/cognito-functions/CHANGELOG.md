# cognito-functions

## 2.0.0

### Major Changes

- e9817b7: Precompile Cognito email templates at build time instead of rendering MJML at runtime. This removes the runtime dependency on `mjml`, switches template minification to `html-minifier-next`, and centralizes the default locale used when a localized template is not available.

## 1.2.0

### Minor Changes

- a83ce16: Enhance pre-sign-up handler with field validation for email, given name, family name, and role

## 1.1.2

### Patch Changes

- 973ca7b: Add locale support to otp-message and create-auth-challenge-handler and add English translation strings

## 1.1.1

### Patch Changes

- 5ba5b5b: Fix post-confirmation-handler tests by adding preferred_language support

## 1.1.0

### Minor Changes

- 09d0a9f: Add support to i18n, sanitize input to avoid injection

## 1.0.0

### Major Changes

- a9113ff: Update lambda functions deprecated runtime

### Minor Changes

- 19c9a9d: Fix broken test

### Patch Changes

- bcce26c: Changed in custom message lambda the exit with error mode with a warning and return event
- a9113ff: Upgrade dependencies

## 0.1.2

### Patch Changes

- 4f58966: Set the validity duration of the MFA code

## 0.1.1

### Patch Changes

- ff76c4e: Fix microcopies in confirmation update email attribute's template

## 0.1.0

### Minor Changes

- 6af6358: Handle the event UpdateUserAttribute, triggered when the user updates the email address
