const path = require('path');

module.exports = {
  mode: 'development',
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './'),
  },
  devServer: {
    contentBase: './example-app'
  },
  devtool: 'eval-source-map'
};
