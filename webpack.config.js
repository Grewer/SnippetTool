const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dotenv = require('dotenv')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const { resolve } = path

dotenv.config()

module.exports = (env, argv) => {
  const webpackEnv = (argv || { mode: 'development' }).mode
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  // console.log(env, argv)
  console.log({ isEnvProduction, webpackEnv })
  // console.log(process.env)

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: '../../' },
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
    ].filter(Boolean)
    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isEnvDevelopment,
        },
      })
    }
    return loaders
  }

  const config = {
    cache: true,
    mode: webpackEnv,
    devtool: 'inline-source-map',
    entry: './src/render/index',
    target: 'electron-renderer',
    // output: {
    //   filename: '[name].js',
    //     libraryTarget: 'commonjs2',
    // path: path.join(__dirname, '/dist/'),
    //     publicPath: './'
    // },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '~': resolve('./src/render'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'assets/index.ejs',
        minify: true,
        cache: true,
        inject: true,
        iconfontUrl: process.env.iconfont,
      }),
      new HtmlWebpackHarddiskPlugin(),
      new webpack.DefinePlugin({
        'process.env.dev': JSON.stringify(isEnvDevelopment),
        'process.env.github_key': JSON.stringify(process.env.github_key),
      }),
      new webpack.WatchIgnorePlugin({
        paths: [
          /\.js$/,
          /\.d\.ts$/,
        ],
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: resolve('src'),
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|bmp)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
          include: resolve('src'),
        },
        {
          test: /\.less$/,
          include: resolve('src'),
          exclude: /global.less/,
          use: [
            ...getStyleLoaders({
              sourceMap: isEnvDevelopment,
              modules: true,
            }),
            {
              loader: 'less-loader',
              options: {
                lessOptions:{
                  javascriptEnabled: true,
                  compress: true,
                },
                sourceMap: isEnvDevelopment
              },
            },
          ],
        },
        {
          test: /global.less$/,
          include: resolve('src'),
          use: [
            ...getStyleLoaders({
              sourceMap: isEnvDevelopment,
              modules: false,
            }),
            {
              loader: 'less-loader',
              options: {
                lessOptions:{
                  javascriptEnabled: true,
                  compress: true,
                },
                sourceMap: isEnvDevelopment
              },
            },
          ],
        },
        {
          test: /\.node$/,
          use: 'node-loader',
          include: resolve('src'),
        },
        {
          test: /\.(png|jpg|gif|ttf|eot|woff|woff2)$/i,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 8192 },
            },
          ],
        },
        {
          test: /\.css$/,
          use: getStyleLoaders({
            sourceMap: isEnvDevelopment,
          }),
        },
      ],
    },
    devServer: {
      host: 'localhost',
      hot: true,
      onBeforeSetupMiddleware() {
        spawn('electron', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
          .on('close', code => process.exit(0))
          .on('error', spawnError => console.error(spawnError))
      },
    },
  }

  // if (isEnvDevelopment) {
  // }

  // new webpack.BannerPlugin({
  //   banner: "hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]"
  // })

  return config
}
