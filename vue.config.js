const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const {defineConfig} = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],

    resolve: {fallback: {fs: false, os: false, path: false}},
    experiments: {
      topLevelAwait: true,
    },
    optimization: {
      splitChunks: {chunks: 'all'},
    },
  },
});
