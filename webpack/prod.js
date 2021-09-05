const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const base = require("./base");
const phaserVersion = require("../package.json").dependencies.phaser.replace("^", "");

/**
 * The production build loads phaser from Unpkg.com for faster loading from browser cache
 */
base.plugins[2] = new HtmlWebpackPlugin({
  chunks: ["vendor", "main"],
  chunksSortMode: "manual",
  hash: false,
  templateParameters: {
    phaserScript: `<script src="https://unpkg.com/phaser@${phaserVersion}/dist/phaser.min.js"></script>`,
  },
  template: "./index.ejs",
});

const merged = merge(base, {
  mode: "production",
  externals: {
    phaser: "Phaser",
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});

/**
 * Removing phaser from vendor list
 */
delete merged.entry.vendor;

module.exports = merged;
