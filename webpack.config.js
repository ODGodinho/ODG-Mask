const path = require("path");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'ODGMask.js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist/'),
  },
  devServer: {
    host: "0.0.0.0",
    port: 7075,
    contentBase: path.join(__dirname, 'dist')
  }
}