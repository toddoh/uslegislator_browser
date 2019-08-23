const path = require("path");
const nodeExternals = require("webpack-node-externals");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    mode: 'development',
    target: 'node',
    node: {
        __dirname: false
    },
    externals: [nodeExternals()],
    entry: "./src/server/index.js",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    output: {
        path: path.resolve(__dirname, 'server'),
        filename: '[name]'
    }
};