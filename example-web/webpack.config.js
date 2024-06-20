const path = require('path');

module.exports = env => {
  const isProduction = Boolean(env.production);
  return {
    entry: './app.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './'),
    },
    devServer: {
      contentBase: './example-web'
    },
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.mp3$/,
          loader: "url-loader",
          options: {
            limit: Infinity // everything
          }
        },
      ]
    },
  };
};
