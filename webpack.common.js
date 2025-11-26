const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    home: "./src/home/index.js",
    progress: "./src/progress/progress.js",
    activities: "./src/activities/activities.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/home/index.html",
      filename: "index.html",
      chunks: ["home"],
    }),

    new HtmlWebpackPlugin({
      template: "./src/progress/progress.html",
      filename: "progress.html",
      chunks: ["progress"],
    }),

    new HtmlWebpackPlugin({
      template: "./src/activities/activities.html",
      filename: "activities.html",
      chunks: ["activities"],
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
