// vue.config.js
const { codeInspectorPlugin } = require('code-inspector-plugin');
const path = require('path');

module.exports = {
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.plugin('code-inspector-plugin').use(
      codeInspectorPlugin({
        bundler: 'webpack',
      })
    );
    
    // 添加对node_modules的处理
    config.resolve.modules
      .add('node_modules')
      .add(path.resolve(__dirname, './node_modules'));
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'utils': path.resolve(__dirname, 'src/utils'),
      }
    },
  },
};
