const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = env => {

  const isProduction = Boolean(env.production);

  return {
    mode: isProduction ? 'production' : 'development',
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
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    plugins: [
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx']
      })
    ],
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
};
