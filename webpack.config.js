const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './config.js',
  ],
  output: {
    filename: 'index.js',
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
