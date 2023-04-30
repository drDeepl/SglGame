// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const {defineConfig} = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    // plugins: [new NodePolyfillPlugin()],

    resolve: {fallback: {fs: false, os: false, path: false}},
    experiments: {
      topLevelAwait: true,
    },
    optimization: {
      splitChunks: {chunks: 'all'},
    },
  },
});
