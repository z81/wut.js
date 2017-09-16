const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config.js");
const compiler = webpack(config);
const server = new WebpackDevServer(compiler);
server.listen(8080);
