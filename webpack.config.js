// Webpack
const path = require("path");
const webpack = require("webpack");

// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/* ------------------------------------------------------ */
// COMMON

const config = {
  mode: process.env.NODE_ENV,
  entry: {
    bundle: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "js/[name].[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            {loader: "css-loader"},
            {loader: "postcss-loader"},
            {loader: "sass-loader"}
          ],
      },
      {
        test: /\.html$/,
        use: "html-loader"
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/"
            }
          },
          "img-loader" // Calling img loader
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.(mov|mp4)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "videos/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/style.[chunkhash].css",
      disable: process.env.NODE_ENV === "development"
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html" // Duplicating and injecting script tags for our output files
    })
  ]
};

/* ------------------------------------------------------ */
// DEVELOPMENT

if (process.env.NODE_ENV == "development") {
  config.plugins.push(
    new BrowserSyncPlugin(
      {
        host: "localhost",
        port: 3000,
        proxy: "http://localhost:8080/"
      },
      {
        reload: false
      }
    ),
    new webpack.HotModuleReplacementPlugin()
  );

  config.devtool = process.env.NODE_ENV == "development" 
    ? "cheap-eval-source-map"
    : "source-map"

  config.devServer = {
    historyApiFallback: true,
    contentBase: "./dist", // Which root-folder devServer should serve
    watchContentBase: true,
    hot: true,
    stats: {
      assets: false,
      hash: false,
      modules: false,
      publicPath: false,
      entrypoints: false,
      version: false,
      warnings: true,
      colors: true,
      children: false,
      chunks: false,
      chunkOrigins: false
    }
  };
}

/* ------------------------------------------------------ */
// PRODUCTION

if (process.env.NODE_ENV == "production") {
  config.output.filename = "js/[name].[hash].js"; // Chuckhash depending of the content in the file. same content = same name
}

module.exports = config;