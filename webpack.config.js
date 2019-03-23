const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
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
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "ts-loader",
      options: {
        configFile: resolve('tsconfig.test.json')
      }
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
