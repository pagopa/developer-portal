module.exports = {
  root: true,
  extends: [
    // Load common config
    "./eslint-config.js",
  ],
  plugins: [
    // Use the react plugin
    'react',
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
}
