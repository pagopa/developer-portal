module.exports = {
  root: true,
  plugins: ["functional"],
  rules: {
    // No exceptions
    'functional/no-promise-reject': 'error',
    'functional/no-throw-statements': 'error',
    'functional/no-try-statements': 'error',
    // No mutations
    'functional/immutable-data': 'error',
    'functional/no-let': 'error',
    'functional/prefer-readonly-type': 'error',
    // No other paradigms
    'functional/no-classes': 'error',
    'functional/no-this-expressions': 'error',
    // No statements
    'functional/no-expression-statements': 'error',
    'functional/no-loop-statements': 'error',
    'functional/no-return-void': 'error',
    // Stylistic
    'functional/prefer-property-signatures': 'warn',
    'functional/prefer-tacit': 'warn',
    // Vanilla
    'no-var': 'error',
    'no-param-reassign': 'error',
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'functional/prefer-readonly-type': 'off',
      },
    },
    {
      // Exclude tests from this rule, allowing us to use describe() and it()
      // Exclude also react components, allowing us to use setState()
      files: ['**/__tests__/*.ts', '**/*.tsx'],
      rules: {
        'functional/no-expression-statements': 'off',
      },
    },
  ],
}
