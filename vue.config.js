const path = require('path')
const isProduction = process.env.NODE_ENV === 'production';
//gzip 压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
//去除console.log
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer')
const {
  IgnorePlugin,
  HashedModuleIdsPlugin
} = require('webpack')
//语言包优化
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");

function resolve(dir) {
  // path.join()方法用于连接路径
  return path.join(__dirname, dir)
}
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
  // 生产环境
  build: {
    css: [],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@3.0.0-beta.24/dist/vue.global.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@4.0.0/dist/vuex.global.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',
      'https://cdn.jsdelivr.net/npm/dayjs@1.10.4/dayjs.min.js',
      'https://cdn.jsdelivr.net/npm/vue3-lazyload@0.2.2-beta/dist/vue3-lazyload.min.js'
    ]
  }
}
const externals = {
  Vue: 'Vue',
  Vuex: 'Vuex',
  axios: 'axios',
  dayjs: 'dayjs',
  'vue3-lazyload': 'VueLazyload'
}
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  lintOnSave: true,
  devServer: {
    open: true, // 自动启动浏览器
    host: '0.0.0.0', // localhost
    port: 8080, // 端口号
    hotOnly: false, // 热更新

    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true
    },
    proxy: {
      //配置跨域
      '/api': {
        target: 'https://www.dcmaomi.com', // 接口的域名
        // ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  configureWebpack: config => {
    config.plugins.push(new IgnorePlugin(/^\.\/locale$/, /moment$/))


    if (isProduction) {

      config.externals = externals

      config.plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false, // 去掉注释
          },
          warnings: false,
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'] //移除console
          }
        }
      }))
      config.plugins.push(new HashedModuleIdsPlugin())
      //gzip压缩
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip', // 使用gzip压缩
        test: /\.js$|\.html$|\.css$/, // 匹配文件名
        filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
        minRatio: 1, // 压缩率小于1才会压缩
        threshold: 10240, // 对超过10k的数据压缩
        minRatio: 0.8,
        deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      }))
      //打包分析
      config.plugins.push(new BundleAnalyzerPlugin())
    }

  },
  chainWebpack: config => {
    if (isProduction) {
      //图片压缩
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true
        })
      //语言包优化
      config.plugin("ignore").use(new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/));
      /**
       * 添加CDN参数到htmlWebpackPlugin配置中
       */
      config.plugin('html-index')
        .tap(args => {
          // console.log(args)
          if (isProduction) {
            args[0].cdn = cdn.build;
          } else {
            args[0].cdn = cdn.dev;
          }

          // console.log(args)
          return args;
        });
    }

  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#ff9344',
            'link-color': '#ff9344',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'DM商城',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    subpage: 'src/main.js'
  }
};