const path = require('path');

module.exports = env => {
  const isProduction = Boolean(env.production);
  return {
    mode: 'development',
    entry: './app.js',
    resolve: {
      alias: {
        geoxp: isProduction ? './dist/geoxp' : '../dist/geoxp',
      },
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './'),
    },
    devServer: {
      contentBase: './example-app'
    },
    devtool: 'eval-source-map'
  };
};
