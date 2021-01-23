const path = require('path');

module.exports = {
  mode: 'development',
  entry: './example/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'example'),
  },
  devServer: {
    contentBase: './example'
  }
};
