const path = require('path')
const { merge } = require('webpack-merge')
const WebpackBaseConfig = require('./webpack.common.config')

module.exports = merge(WebpackBaseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './js/[name].[contenthash].js',
    publicPath: '/simple-decorator-examples/'
  },
  optimization: {
    runtimeChunk: true
  }
})
