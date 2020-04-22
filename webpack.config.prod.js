'use strict'
const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const postcssPxToViewport = require('postcss-px-to-viewport')
const postcssPresetEnv = require('postcss-preset-env')
const postcssImport = require('postcss-import')
const postcssUrl = require('postcss-url')
const cssnano = require('cssnano')

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index.jsx')
  },
  output: {
    path: path.resolve(__dirname, './cordova/www/'),
    filename: 'js/[name].[chunkhash:5].js',
    publicPath: './'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css','.less', 'json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'iconfont': path.resolve(__dirname, 'src/static/iconfont'),
      'static': path.resolve(__dirname, 'src/static'),
      'store': path.resolve(__dirname, 'src/store'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'public': path.resolve(__dirname, 'public')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', ["@babel/preset-env",{"useBuiltIns": "entry"}]],
          plugins: [
            'react-html-attrs',
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
            ["import", { libraryName: "antd-mobile", style: "css" }]
          ]
        }
      },
      {
        test: /\.(css|less)$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'src/static')
        ],
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../'
          }},
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                // 修复flexbug
                require('postcss-flexbugs-fixes'),
                postcssImport({}),
                postcssUrl({}),
                postcssPresetEnv({}),
                postcssPxToViewport({
                  viewportWidth: 375,  // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
                  viewportHeight: 667,  // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
                  unitPrecision: 5,  // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
                  viewportUnit: 'vw',  // 指定需要转换成的视窗单位，建议使用vw
                  selectorBlackList: ['.ignore', '.hairlines'],  // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
                  minPixelValue: 1,  // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
                  mediaQuery: false  // 允许在媒体查询中转换`px`
                }),
                cssnano({
                  "cssnano-preset-advanced": {
                    zindex: false,
                    autoprefixer: false
                  }
                })
              ]
            }
          },
          { loader: 'less-loader' }
        ]
      },
      // 针对编译外来的UI库antd的css，就要全局编译，不加css module
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src/static')],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                postcssImport({}),
                postcssUrl({}),
                postcssPresetEnv({}),
                postcssPxToViewport({
                  viewportWidth: 375,  // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
                  viewportHeight: 667,  // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
                  unitPrecision: 5,  // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
                  viewportUnit: 'vw',  // 指定需要转换成的视窗单位，建议使用vw
                  selectorBlackList: ['.ignore', '.hairlines'],  // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
                  minPixelValue: 1,  // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
                  mediaQuery: false  // 允许在媒体查询中转换`px`
                }),
                cssnano({
                  "cssnano-preset-advanced": {
                    zindex: false,
                    autoprefixer: false
                  }
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg|bmp)$/i,
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 10240,
              useRelativePath:false,
              outputPath: 'images/'
            }
          },
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-gifsicle')({
                  interlaced: false
                }),
                require('imagemin-mozjpeg')({
                  progressive: true,
                  arithmetic: false
                }),
                require('imagemin-pngquant')({
                  quality: [0.5, 0.9],
                  speed: 2
                }),
                require('imagemin-svgo')({
                  plugins: [
                    { removeTitle: true },
                    { convertPathData: false }
                  ]
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'src/static/iconfont')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|otf|woff?|woff2?)$/,
        include: path.resolve(__dirname, 'src/static/iconfont'),
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },

  // 提供公共代码
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          enforce: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },

  plugins: [
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin('Copyright by xuhongling'),

    // html 模板插件
    new htmlWebpackPlugin({
      title: '东西湖 App',
      favicon: __dirname + '/public/favicon.ico',
      template: __dirname + '/public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      chunksSortMode:'dependency'
    }),

    //删除之前的打包目录
    new CleanWebpackPlugin(),

    // 在打包时忽略本地化内容
    new webpack.IgnorePlugin(/\/public$/),

    // 在「生产/开发」构建中使用不同的服务URL(Service URLs)
    new webpack.DefinePlugin({
      'process.env': {
        APP_URL: JSON.stringify('http://111.48.124.5:7778')
        // APP_URL: JSON.stringify('http://192.168.2.104:7778')//张恒电脑IP
        //APP_URL: JSON.stringify('http://192.168.2.98:7778')
      }
    }),

    // 代码打包的体积变得更小，加快运行的速度
    new webpack.optimize.ModuleConcatenationPlugin(),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurrenceOrderPlugin(),

    // 分离CSS文件
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash:5].css"
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new WorkboxPlugin.GenerateSW({
      skipWaiting: true, // 强制等待中的 Service Worker 被激活
      clientsClaim: true // Service Worker 被激活后使其立即获得页面控制权
    }),

    new CopyWebpackPlugin([
      {
        from: './public/manifest.json',
        to: 'manifest.json'
      },
      {
        from: './public/images/logo_144.png',
        to: 'images/logo_144.png'
      },
      {
        from: path.resolve(__dirname, './public'),
        to: path.resolve(__dirname, './cordova/www/'),
        ignore: ['.*']
      }
    ])
  ],

  externals: {
    AMap: 'AMap',
    cordova: 'cordova',
    StatusBar: 'StatusBar'
  }
}
