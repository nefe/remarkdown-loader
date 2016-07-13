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
        loader: 'babel',
        include: [
          __dirname,
        ],
      },
      {
        test: /\.md$/,
        loaders: ['babel', path.resolve(__dirname, '../')],
        include: [
          __dirname,
        ]
      },
    ],
  },
};
