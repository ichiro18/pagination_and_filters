const path = require('path');
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_TITLE = require('./package.json').title;

module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].inject = false;
      args[0].template = require('html-webpack-template');
      args[0].appMountId = 'app';
      args[0].title = process.env.VUE_APP_TITLE;
      args[0].lang = 'ru';
      args[0].mobile = true;
      args[0].links = [
        {
          href: '/favicon.png',
          rel: 'shortcut icon',
          sizes: '32x32',
          type: 'image/x-icon',
        },
      ];
      return args;
    });
  },
  configureWebpack: {
    // Fast source maps in dev
    devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-eval-source-map',
    resolve: {
      alias: {
        // Alias @ to /src folder for ES/TS imports
        '@': path.join(__dirname, '/src'),
      },
    },
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  publicPath: process.env.BASE_URL || '/',
};
