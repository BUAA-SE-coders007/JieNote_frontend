// vue.config.js
const { codeInspectorPlugin } = require('code-inspector-plugin');
const path = require('path');

module.exports = {
  runtimeCompiler: true,
  devServer: {
    port: 8080,
    proxy: {
      '/sockjs-node': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      },
      
    }
  },
  chainWebpack: (config) => {
    config.devServer
        .hot(true)
        .inline(true)
        .overlay(true)
    config.plugin('code-inspector-plugin').use(
      codeInspectorPlugin({
        bundler: 'webpack',
      })
    );
    config.plugin('html').tap(args => {
      args[0].favicon = './src/assets/img/logo4.png' // 根据你图标路径改
      return args
    });
    // 添加对node_modules的处理
    config.resolve.modules
      .add('node_modules')
      .add(path.resolve(__dirname, './node_modules'));
  },
  configureWebpack: {
    cache: true,
    devtool: 'cheap-module-source-map',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'utils': path.resolve(__dirname, 'src/utils'),
      }
    },
  },
};
