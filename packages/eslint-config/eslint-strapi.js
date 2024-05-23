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
      files: ['**/*.ts'],
      rules: {
        'functional/no-method-signature': 'off',
        'functional/immutable-data': 'off',
        'functional/prefer-readonly-type': 'off',
        'functional/no-expression-statements': 'off',
        'functional/no-throw-statements': 'off',
        'functional/no-return-void': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
}
