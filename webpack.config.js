const path = require('path');

module.exports = {
  mode: 'development',
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
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.mp3$/,
        loader: "url-loader",
        options: {
          limit: Infinity // everything
        }
      }
    ]
  }
};
