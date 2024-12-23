/**
 * CleanWebpackPlugin - removes/cleans build folders before building, this ensures no duplicate folders/files
 * HtmlWebPackPlugin - Simplifies creation of HTML files to serve webpack bundles. This will generate an HTML file that includes all webpack bundles in the body using script tags.  https://webpack.js.org/plugins/html-webpack-plugin/
 * CopyPlugin - copies individual files or entire directories, which already exist, to the build directory. https://www.npmjs.com/package/copy-webpack-plugin
 */

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");

// init path for src directory and dist directory
const SRC_DIR = path.resolve(__dirname, "client/src");
const DIST_DIR = path.resolve(__dirname, "dist");

module.exports = {
  // stats allows us to control what bundle info gets displayed
  stats: {
    excludeModules: /node_modules/, // don't add node_modules to build output
  },

  // entry point for bundling
  entry: {
    app: path.resolve(SRC_DIR, "index.jsx"),
  },

  // where webpack will place our bundled files
  output: {
    path: DIST_DIR,
    filename: "bundle.js", // sets the filename for our bundled file
  },

  // allows team to not have to include file types on import statements
  // ex: instead of import FakeData from './fakeData.js' we can write import FakeData from './fakeData'
  // Webpack will try each extension listed below until it finds a match
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

  // setup for telling webpack how to process different file types
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // tests file types ending in js or jsx
        exclude: /node_modules/, // exclude node_modules folder from being processed
        use: {
          loader: "babel-loader", // connect babel and webpack
          options: {
            presets: [
              // converts modern JS to older version code syntax via babel
              "@babel/preset-env",
              // preset to allow react-specific code to be processed by babel
              ["@babel/preset-react", { runtime: "automatic" }], // set runtime to automatic so we don't have to create import React statements in multiple files
            ],
          },
        },
      },
      {
        // css processing
        test: /\.css$/, // tests file types ending in .less or .css
        use: [
          "style-loader", //! NOT SECURE FOR LIVE PROD ENV
          "css-loader", // takes the CSS files and returns the files with imports and url(...) resolved
        ],
      },
    ],
  },

  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_DIR, "index.html"),
    }),
  ],

  devServer: {
    static: {
      directory: DIST_DIR,
    },
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api/stoic-quote"],
        target: "https://stoic.tekloon.net",
        changeOrigin: true,
        secure: true,
        pathRewrite: { "^/api/stoic-quote": "/stoic-quote" },
      },

      {
        context: ["/api"],
        target: "http://localhost:4000",
      },
    ],
  },
};
