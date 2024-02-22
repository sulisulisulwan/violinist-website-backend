import * as path from 'path'
import * as url from 'url'
const { fileURLToPath }  = url
const  { dirname } = path

const __dirname = dirname(fileURLToPath(import.meta.url))

import.meta

export default {
  mode: 'development',
  target: 'node',
  entry: __dirname + '/src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: path.resolve(__dirname, "./build/"),
    filename: 'main.cjs'
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
}