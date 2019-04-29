const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')
const resolve = (filePath) => path.resolve(__dirname, filePath)

const buildPath = resolve('example/dist')
module.exports = {
  module: 'development',
  entry: resolve('example/src/index.tsx'),
  output: {
    path: buildPath,
    filename: '[name].[hash].bundle.js'
  },
  devtool: "cheap-module-eval-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      '@':path.resolve(__dirname,'src')
    }
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "ts-loader",
      options: {
        getCustomTransformers: () => ({
          before: [
            tsImportPluginFactory({
                libraryDirectory: 'es',
                libraryName: 'antd',
                style: true
            })
          ]
        })
      }
    },{
      test:/\.less$/,
      use:[
        'style-loader', //上面的简写方式
        'css-loader',
        {
          loader:'less-loader',
          options:{
            javascriptEnabled:true
          }
        }
      ]
    },{
      test:/\.scss$/,
      use:[
        'style-loader', //上面的简写方式
        'css-loader',
        'sass-loader'
      ]
    }],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('example/index.html'),
      filename: 'index.html',
      reject: true
    })
  ],
  devServer: {
    contentBase: false,
    hot: true,
    compress: true,
    port: 9000,
    quiet: false,
    publicPath: '/',
    watchOptions: {
      poll: false
    }
  }
}
