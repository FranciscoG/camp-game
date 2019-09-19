const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    vendor: ["phaser"],
    main: path.resolve(__dirname, "../src/index.js")
  },
  devtool: "eval-source-map",
  output: {
    path: path.resolve(__dirname, "../game")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(png|jpg|gif|ico|svg|pvr|pkm|wav|mp3|webm)$/,
        use: ["file-loader?name=assets/[name].[ext]?[hash]"]
      },
      {
        type: "javascript/auto",
        test: [/\.json$/],
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      chunks: ["vendor", "main"],
      chunksSortMode: "manual",
      hash: false
    })
  ]
};
