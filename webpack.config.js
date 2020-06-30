const path = require('path')//处理路径信息
const HtmlWebpackPlugin = require('html-webpack-plugin')//引入html-webpack-plugin
const CopyPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV
const copyPath = NODE_ENV === 'development' ? 'dist' : 'build'

console.log('*********', path.resolve(__dirname, 'static'))

const config = {
  mode: 'development', // development || production
  entry: path.resolve(__dirname, 'src/index.ts'),//webpack 打包入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),//打包完成放置位置
    filename: 'index.js'//打包后的文件名
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        enforce: "pre",
        test: /.(js|ts)$/,
        loader: "source-map-loader"
      },
      {
        test:/.(png|svg|jpg|gif)$/,
        use:[
          { 
            loader:'url-loader',
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: "file-loader",
      },
    ]
  },
  //插件，用于生产模板和各项功能
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'static'),
        to: path.resolve(__dirname, 'dist'),
      }],
    }),
  ],
  //配置webpack开发服务器功能
  devServer: {
    // 设置基本目录结构
    contentBase: path.resolve(__dirname, 'dist'),
    //服务器的ip地址 可以使用ip也可以使用localhost
    host: 'localhost',
    open: true,
    //服务器压缩是否开启
    compress: false,
    //配置服务端口号
    port: 9999
  }
}
module.exports = config
