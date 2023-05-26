import path, { dirname } from "path";
import { fileURLToPath } from "url";
import wpCommonConfig from "./webpack.common.js";
import { merge } from "webpack-merge";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));

const wpProdConfg = merge(wpCommonConfig, {
  mode: "production",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [new CleanWebpackPlugin()],
});

export default wpProdConfg;
