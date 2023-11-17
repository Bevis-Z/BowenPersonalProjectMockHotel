// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress')
module.exports = defineConfig({
  e2e: {
    testIsolation: false,
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    supportFile: './cypress/support/component.js',
  },
})
