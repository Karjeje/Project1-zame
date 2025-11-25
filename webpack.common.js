const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    home: "./src/home/index.js",
    page1: "./src/page1/page1.js",
    page2: "./src/page2/page2.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/home/index.html",
      filename: "index.html",
      chunks: ["home"],
    }),

    new HtmlWebpackPlugin({
      template: "./src/page1/page1.html",
      filename: "page1.html",
      chunks: ["page1"],
    }),

    new HtmlWebpackPlugin({
      template: "./src/page2/page2.html",
      filename: "page2.html",
      chunks: ["page2"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
