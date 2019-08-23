const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js", // change it to ./main.js for building a server app
        chunkFilename: "[name].bundle.js"  
        // publicPath: "/" -- enable this for building a server app
    }, 
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        watchContentBase: true,
        progress: true
    },
    devServer: {
        historyApiFallback: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 2
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            title: "US Legislator Browser",
            filename: "./index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|otf)$/,
                use: ["file-loader"]
            }
        ]
    }
};