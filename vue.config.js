// vue.config.js
const { codeInspectorPlugin } = require('code-inspector-plugin');

module.exports = {
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.plugin('code-inspector-plugin').use(
      codeInspectorPlugin({
        bundler: 'webpack',
      })
    );
  },
};