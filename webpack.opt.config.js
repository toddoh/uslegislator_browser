var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var terserJsPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new terserJsPlugin()
    ],
  },
  plugins: [
    new OptimizeCssAssetsPlugin(),
  ],
}