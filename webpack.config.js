const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./index.js",
    output: {
      path: path.resolve(__dirname, "./build"),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /.(css|scss)$/,
          exclude: [/node_modules/, /client\/stylesheets\/modules/],
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.ttf$/,
          use: [
            {
              loader: 'ttf-loader',
              options: {
                name: './font/[hash].[ext]',
              },
            },
          ]
        }
      ],
    },

    devServer: {
      host: "localhost",
      port: 8080,
      // match the output path
      static: {
        directory: path.resolve(__dirname, "dist"),
        // match the output 'publicPath'
        publicPath: "/",
      },
      // enable HMR on the devServer
      hot: true,
      historyApiFallback: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      proxy: {
        "/api": {
          target: "http://localhost:3000/",
          secure: false,
        },
        "/assets": {
          target: "http://localhost:3000/",
          secure: false,
        },
      },
    },

    plugins: [new HtmlWebpackPlugin({ template: "./index.html" })],
  };    