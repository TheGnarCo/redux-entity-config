const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    index: './config.js',
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)|(\.test\.js$)/,
        use: [
          'babel-loader',
        ],
      }
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src'),
    ],
  },
};
