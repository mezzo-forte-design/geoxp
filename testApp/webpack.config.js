const path = require('path');

const PORT = 9990;

module.exports = {
  mode: 'development',
  entry: {
     intro      : './src/index.js',
     experience : './src/experience.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist/js')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/js/',
    compress: true,
    // host: '0.0.0.0',
    port: PORT
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
