module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',

  ],
  "plugins": [
    ["import", {
        "libraryName": "ant-design-vue",
        "libraryDirectory": "es",
        "style": "css"
      },
      'ant-design-vue'
    ], // `style: true` 会加载 less 文件
    ["import", {
        libraryName: "dc-picture-view",
        camel2DashComponentName: false, // 是否需要驼峰转短线
        camel2UnderlineComponentName: false, // 是否需要驼峰转下划线
        style: (name) => {
          // console.log('style-->>', name)
          // // v-easyui123/lib/switch/index.js
          // // 注意这里的name为组件所在的路径，按需加载样式配置提取对应组件名称的css即可
          // return `v-easyui123/lib/style/${name.split('/')[2]}.css`
        },
        customName: (name) => {
          return `dc-picture-view/${name}/index.js`
        },

      },
      'dc-picture-view'
    ]
  ]
}