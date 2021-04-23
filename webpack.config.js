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
  }
};
