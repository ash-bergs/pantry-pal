const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './modules/index.ts', // Existing entry for index.html
    list: './modules/list.ts', //
  },
  output: {
    filename: '[name].js', // [name] placeholder will generate index.js and list.js - https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: './about.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'list.html',
      template: './list.html',
      chunks: ['list'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'assets', to: 'assets' },
        { from: 'README.md', to: 'README.md' },
      ],
    }),
  ],
};
