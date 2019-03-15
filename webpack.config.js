'use strict';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const minify = {
  removeComments: true,
  removeCommentsFromCDATA: true,
  removeCDATASectionsFromCDATA: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeAttributeQuotes: true,
  useShortDoctype: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  removeScriptTypeAttributes: true,
  removeStyleTypeAttributes: true
};

module.exports = (env, { mode, analyze }) => ({
  entry: {
    main: path.resolve(__dirname, 'index.js')
  },
  output: {
    filename: '[name].min.js'
  },
  module: {
    rules: [{}, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: '> 1%, not dead' }]
          ]
        }
      }]
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: { minimize: mode === 'production', ...minify }
      }]
    }, {
      test: /\.s?css$/,
      enforce: 'pre',
      use: [
        { loader: 'css-loader' }
      ]
    }, {
      test: /\.scss$/,
      enforce: 'pre',
      use: [
        { loader: 'sass-loader', options: { outputStyle: 'compressed' } }
      ]
    }]
  },
  plugins: [].concat(
    mode === 'production' ? new CleanWebpackPlugin() : [],
    analyze ? new BundleAnalyzerPlugin() : [],
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      chunks: ['main'],
      chunksSortMode: 'manual',
      minify
    }))
});
