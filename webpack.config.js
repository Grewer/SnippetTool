const path = require("path");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    const config = {
        mode: webpackEnv,
        devtool: "inline-source-map",
        entry: "./app.ts",
        output: {
            filename: "bundle.js"
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.(png|jpe?g|gif|svg|bmp)$/i,
                    use: [{
                        loader: "file-loader", options: {
                            publicPath: 'dist'
                        }
                    }]
                },
            ]
        }
    }


    return config
}
