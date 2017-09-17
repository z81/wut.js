const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
WebpackDevServer.entry.push("webpack-dev-server/client?http://localhost:7575/");
const config = require("./webpack.config.js");
const compiler = webpack(config);
const server = new WebpackDevServer(compiler);
server.listen(8080);
