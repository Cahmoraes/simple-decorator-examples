const path = require('path')
const { merge } = require('webpack-merge')
const WebpackBaseConfig = require('./webpack.common.config')
const { SourceMapDevToolPlugin } = require('webpack')

module.exports = merge(WebpackBaseConfig, {
  devtool: false,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/[name].[contenthash].js'
  },
  optimization: {
    runtimeChunk: true
  },
  plugins: [
    new SourceMapDevToolPlugin({})
  ]
})
