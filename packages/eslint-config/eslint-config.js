module.exports = {
  root: true,
  // This is required, or else ESLint will throw errors as it tries to parse
  // TypeScript code as if it were regular JavaScript
  parser: "@typescript-eslint/parser",
  plugins: [
    // This allows you to use typescript-eslint's rules within your codebase
    '@typescript-eslint',
    // Runs Prettier as an ESLint rule and reports differences as individual
    // ESLint issues
    'prettier',
  ],
  extends: [
   // Load rules to enforce the functional paradigm
    './eslint-functional.js',
    // Load eslint recommended rules
    "eslint:recommended",
    // Load ts recommended rules
    "plugin:@typescript-eslint/recommended",
    // Load prettier recommended rules
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error", {
        // prettier options
        "singleQuote": true,
        "jsxSingleQuote": true
      }
    ],
  }
}
