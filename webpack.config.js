const path = require('path');

module.exports = {
  mode: 'development',
  entry: './example-app/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'example-app'),
  },
  devServer: {
    contentBase: './example-app'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options: {
          query: {
            name: 'static/media/[name].[hash:8].[ext]'
          }
        },
      },
    ],
  }
};
