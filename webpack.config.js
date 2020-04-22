const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const postcssPxToViewport = require('postcss-px-to-viewport')
const postcssImport = require('postcss-import')
const postcssUrl = require('postcss-url')
const cssnano = require('cssnano')

module.exports = {
  context: path.resolve(__dirname, 'src'),

  entry: [path.resolve(__dirname, 'src/index.jsx')],

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
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
        enforce: "pre",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', ["@babel/preset-env",{"useBuiltIns": "entry"}]],
          plugins: [
            'react-html-attrs',
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
            'react-hot-loader/babel',
            ["import", { libraryName: "antd-mobile", style: "css" }]
          ]
        }
      },
      {
        test: /\.less$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'src/static')
        ],
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'style-loader',
            options: {
              // singleton: true,
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              sourceMap: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
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
          {
            loader: 'less-loader'
          }
        ]
      },
      // 针对编译外来的UI库antd的css，就要全局编译，不加css module
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src/static')],
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
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
                  unitPrecision: 3,  // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
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
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'static/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(eot|svg|ttf|otf|woff?|woff2?)$/i,
        exclude: /node_modules/,
        loader: 'url-loader?limit=5000'
      }
    ]
  },

  plugins: [
    // html 模板插件
    new htmlWebpackPlugin({
      title: '东西湖 App',
      favicon: __dirname + '/public/favicon.ico',
      template: __dirname + '/public/index.html'
    }),

    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),

    // 在打包时忽略本地化内容
    new webpack.IgnorePlugin(/\/public$/),

    // 在「生产/开发」构建中使用不同的服务URL(Service URLs)
    new webpack.DefinePlugin({
      'process.env': {
        APP_URL: JSON.stringify('http://111.48.124.5:7778')
        //APP_URL: JSON.stringify('http://192.168.2.104:7778')//张恒电脑IP
        // APP_URL: JSON.stringify('http://192.168.2.209:7778')
      }
    })
  ],

  externals: {
    AMap: 'AMap',
    cordova: 'cordova',
    StatusBar: 'StatusBar'
  },

  devServer: {
    contentBase: './public',   //默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
    historyApiFallback: true,   //不跳转。在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    inline: true,   //实时刷新
    hot: true,
    open: true,
    compress: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      // 凡是 '/api' 开头的 http 请求，都会被代理到 localhost:3000 上，由 koa 提供 mock 数据。
      // koa 代码在  ./mock 目录中，启动命令为 npm run mock
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  }
}
