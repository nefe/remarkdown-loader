'use strict';

var path = require('path');

module.exports = {
  entry: {
    demo1: __dirname + '/demo1/app.js',
  },
  devtool: 'inline-source-map',
  output: {
    path: __dirname,
    filename: '[name]/build.js',
  },
  webpackServer: {
    hot: true,
  },
  debug: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          __dirname,
        ],
      },
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, '../'),
        include: [
          __dirname,
        ]
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        include: [
          path.join(__dirname, '../node_modules/highlight.js'),
        ]
      }
    ],
  },
};
