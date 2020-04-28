const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { resolve } = path

module.exports = (env, argv) => {
  const webpackEnv = argv.mode
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  console.log(isEnvProduction, isEnvDevelopment)
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
    entry: './src/index',
    target: 'web',
    // output: {
    //     filename: '[name].js',
    //     libraryTarget: 'commonjs2',
    //     path: path.join(__dirname, '/dist/'),
    //     publicPath: './'
    // },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '~': resolve('./src'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'assets/index.ejs',
        minify: true,
        cache: true,
        inject: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
      new MiniCssExtractPlugin({
        filename: 'dist/css/[name].[contenthash:8].css',
        chunkFilename: 'dist/css/[name].[contenthash:8].chunk.css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          include: resolve('src'),
        },
        {
          test: /\.(png|jpe?g|gif|svg|bmp)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: 'dist',
              },
            },
          ],
          include: resolve('src'),
        },
        {
          test: /\.less$/,
          include: resolve('src'),
          exclude: /global.less/,
          sideEffects: true,
          loader: [
            ...getStyleLoaders({
              sourceMap: isEnvDevelopment,
              modules: true,
            }),
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                compress: true,
              },
            },
          ],
        },
        {
          test: /global.less$/,
          include: resolve('src'),
          sideEffects: true,
          loader: [
            ...getStyleLoaders({
              sourceMap: isEnvDevelopment,
              modules: false,
            }),
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                compress: true,
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
      contentBase: path.resolve(__dirname, 'dist'),
      stats: {
        colors: true,
        chunks: false,
        children: false,
      },
      host: 'localhost',
      progress: true,
      lazy: false,
      // before() {
      //   spawn('electron', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
      //     .on('close', code => process.exit(0))
      //     .on('error', spawnError => console.error(spawnError))
      // },
    },
  }

  // if (isEnvDevelopment) {
  // }

  // new webpack.BannerPlugin({
  //   banner: "hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]"
  // })

  return config
}
