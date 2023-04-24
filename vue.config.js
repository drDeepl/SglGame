const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const fs = require('fs');
const filebuffer = fs.readFileSync('src/database/sql-murder-mystery.db');
const {defineConfig, definePlugin} = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    plugins: [new NodePolyfillPlugin(), definePlugin({filebuffer: filebuffer})],

    // resolve: { fallback: { fs: false, os: false, path: false } },
    experiments: {
      topLevelAwait: true,
    },
    optimization: {
      splitChunks: {chunks: 'all'},
    },
  },
});
