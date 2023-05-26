import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import wpCommonConfig from "./webpack.common.js";
import { merge } from "webpack-merge";

const __dirname = dirname(fileURLToPath(import.meta.url));

const wpDevConfig = merge(wpCommonConfig, {
  mode: "development",
  output: {
    // filename: "[name].[contenthash].js",
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
});

export default wpDevConfig;
