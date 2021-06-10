const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'geoxp.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'GeoXp',
      type: 'umd',
      export: 'default'
    }
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './example-app'
  },
  devtool: 'source-map'
};
