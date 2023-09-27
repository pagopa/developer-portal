module.exports = {
  root: true,
  extends: [
    // Load common config
    "./eslint-config.js",
    // Load pagopa eslint config
    "@pagopa/eslint-config/strong",
  ],
  overrides: [
    {
      /*
       * Version 5.0.0 (https://github.com/eslint-functional/eslint-plugin-functional/releases/tag/v5.0.0)
       * add a breaking change that renames the rule no-method-signature to
       * prefer-property-signatures.
       *
       * Disable rule coming from @pagopa/eslint-rules and enable (with the very same level
       * used by the PagoPA's linter) the rule renamed in version 5.
       */
      files: ['*'],
      rules: {
        'functional/no-method-signature': 'off',
        'functional/prefer-property-signatures': 'error'
      },
    },
  ],
}
