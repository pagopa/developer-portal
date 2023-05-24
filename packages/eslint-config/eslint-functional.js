module.exports = {
  root: true,
  plugins: ["functional"],
  rules: {
    // No exceptions
    'functional/no-promise-reject': 'error',
    'functional/no-try-statements': 'error',
    // No mutations
    'functional/no-let': 'error',
    'functional/immutable-data': 'error',
    // No other paradigms
    // No statements
    'functional/no-loop-statements': 'error',
    // Stylistic
    'functional/prefer-property-signatures': 'warn',
    'functional/prefer-tacit': 'warn',
    'functional/readonly-type': 'error',
  }
}
