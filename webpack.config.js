const path = require("path");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')

const resolve = path.resolve

module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    const config = {
        mode: webpackEnv,
        devtool: "inline-source-map",
        entry: "./src/render/index",
        target: 'electron-renderer',
        // output: {
        //     filename: '[name].js',
        //     libraryTarget: 'commonjs2',
        //     path: path.join(__dirname, '/dist/'),
        //     publicPath: './'
        // },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            alias:{
                '~': resolve('./src/render')
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'assets/index.ejs',
                minify:true,
                cache:true,
                inject:true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader",
                    include: [resolve('src')],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|bmp)$/i,
                    use: [{
                        loader: "file-loader", options: {
                            publicPath: 'dist'
                        }
                    }],
                    include: [resolve('src')],
                },
                {
                    test: /\.node$/,
                    use: 'node-loader',
                    include: [resolve('src')],
                }
            ]
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            stats: {
                colors: true,
                chunks: false,
                children: false
            },
            before() {
                spawn(
                    'electron',
                    ['.'],
                    { shell: true, env: process.env, stdio: 'inherit' }
                )
                    .on('close', code => process.exit(0))
                    .on('error', spawnError => console.error(spawnError))
            }
        }
    }


    return config
}
