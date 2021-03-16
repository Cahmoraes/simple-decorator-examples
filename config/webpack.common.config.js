const HtmlWebpackPlugun = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin')

module.exports = {
  entry: {
    main: {
      import: './src/index.js',
      dependOn: 'shared'
    },
    shared: ['./src/js/so.js', './src/js/sd.js']
  },
  devServer: {
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.ts', '.scss', '.css']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
    new ProvidePlugin({
      so: ['../src/js/so.js', 'default']
    }),
    new MiniCssExtractPlugin({
      filename: './css/style.[chunkhash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/',
          to: './assets/'
        }
      ]
    }),
    new HtmlWebpackPlugun({
      title: 'Webpack Revisão',
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['main', 'shared'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugun({
      title: '404',
      filename: '404.html',
      template: './src/404.html',
      chunks: ['main'],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new BaseHrefWebpackPlugin({
      baseHref: process.env.NODE_ENV === 'development' ? '/' : '/simple-decorator-examples/'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /(node_modules)/,
        use: 'babel-loader'
      },
      {
        test: /\.(s?css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-es6-template-loader'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            filename: '[name][contenthash].[ext]',
            outputPath: './assets/img'
          }
        }
      }
    ]
  }
}
