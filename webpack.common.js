import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import webpack from "webpack";
import dotenv from "dotenv";

/**
 * pathing alt for ES6
 *     - https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules/50052194#50052194
 */
const __dirname = dirname(fileURLToPath(import.meta.url));

const newDotEnv = dotenv.config({
  path: path.join(__dirname, ".env"),
});

const wpCommonConfig = {
  entry: {
    index: "./test/index.js",
  },
  resolve: {
    enforceExtension: false,
    extensions: [".js", "..."],
    // alias: {
    //   sample1: path.resolve(__dirname, "src/sample1/"),
    //   Sample2: path.resolve(__dirname, "src/sample2/"),
    // },
    mainFiles: ["index"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": newDotEnv.parsed,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
        // use:["html-loader"],
        options: {
          // Disables attributes processing
          sources: true,
        },
      },
      /**
       * This can be ommitted at the time of writing ( html-loader works with images )
       * - Disabled for now, duplicates the emission of static files
       * - deprecated in webpack 5
       */
      // {
      //     test:/\.svg$/,
      //     use:{
      //         loader: "file-loader",
      //         options: {
      //             name: "[name].[ext]",
      //             outputPath: "static"
      //         }

      //     }
      // },
    ],
  },
  optimization: {
    minimize: false,
  },
};

export default wpCommonConfig;
