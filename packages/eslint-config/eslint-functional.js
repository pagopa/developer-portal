module.exports = {
  root: true,
  plugins: ["functional"],
  rules: {
    // No exceptions
    'functional/no-promise-reject': 'error',
    'functional/no-throw-statements': 'warn',
    'functional/no-try-statements': 'error',
    // No mutations
    'functional/immutable-data': 'error',
    'functional/no-let': 'error',
    // No other paradigms
    'functional/no-classes': 'error',
    'functional/no-this-expressions': 'error',
    // No statements
    'functional/no-loop-statements': 'error',
    'functional/no-return-void': 'error',
    // Stylistic
    'functional/prefer-property-signatures': 'warn',
    'functional/prefer-tacit': 'warn',
    'functional/readonly-type': 'error',
    // Vanilla
    'no-var': 'error',
    'no-param-reassign': 'error',
  }
}
