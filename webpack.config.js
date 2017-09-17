module.exports = {
  devtool: "inline-source-map",
  entry: ["./main.ts"],
  output: {
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: false,
          target: "ES5"
        }
      }
    ]
  }
};
