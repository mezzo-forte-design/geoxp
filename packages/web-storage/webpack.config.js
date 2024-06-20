const path = require('path');

module.exports = env => {
  const isProduction = Boolean(env.production);
  return {
    entry: './index.ts',
    module: {
      rules: [
        {
          test: /\.([cm]?ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      extensionAlias: {
        ".js": [".js", ".ts"],
        ".cjs": [".cjs", ".cts"],
        ".mjs": [".mjs", ".mts"]
       }
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'web-storage',
      libraryTarget: 'umd',
      clean: true
    },
  };
};
