'use strict';

var path = require('path');
var combineLoaders = require('webpack-combine-loaders');

module.exports = {
  entry: {
    demo1: __dirname + '/demo1/app.js',
    demos: __dirname + '/demo1/Demos.js',
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
        test: /\.scss/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          plugins: [['code']]
        },
        include: [
          __dirname,
        ],
      },
      {
        test: /\.md$/,
        loader: combineLoaders([{
            loader: 'babel',
          }, {
            loader: path.resolve(__dirname, '../'),
            query: {
              Demo: 'remarkdown-doc'
            }
        }]),
        include: [
          __dirname,
        ]
      },
    ],
  },
  resolve: {
    alias: {
      'remarkdown-loader': path.resolve(__dirname, '../')
    },
  },
};
