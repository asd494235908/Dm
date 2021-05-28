# DM商城
[![](https://img.shields.io/badge/version-1.0-brightgreen)](https://github.com/asd494235908/DM)
[![GitHub stars](https://img.shields.io/github/stars/asd494235908/DM.svg?style=social&label=Stars)](https://github.com/asd494235908/DM)
[![GitHub forks](https://img.shields.io/github/forks/asd494235908/DM.svg?style=social&label=Fork)](https://github.com/asd494235908/Dm)
 - [若图片显示不完整请跳转码云](https://gitee.com/dcmaomi/Dm)
### 项目已部署，在线Demo
- 前台商城：https://www.dcmaomi.com
- 后台管理系统：https://tm.dcmaomi.com

### 单体版获取
- 单体DM 分布式 可跑在1g1核服务器上
- 获取方式：进入商城 https://www.dcmaomi.com 登陆后随意测试支付商品 填写捐赠信息 支付成功后将自动发至您填写的邮箱

### 前台页面为基于Vue3.0的独立项目

### 作者其他项目推荐
- [DCPay个人免签收款支付系统](https://dcpay.dcmaomi.com) 无需挂机App 半自动回调

- [DM微信小程序 APP前端 现已开源！](https://github.com/asd494235908/DM-Mobile-terminal)
    
    [![WX20190924-234416@2x.png](https://www.dcmaomi.com:3010/serverImage/20210305010710_12523.png)](https://github.com/asd494235908/DM-Mobile-terminal)

- [DM-TM后端](https://github.com/asd494235908/TerMinal)

    ![](https://www.dcmaomi.com:3010/serverImage/20210305011146_16923.png)

### 基于SOA架构的分布式购物电商商城
- [x] 后台管理系统：管理商品、订单、类目、商品规格属性、用户、权限、系统统计、系统日志以及前台内容等功能
- [x] 前台系统：用户可以在前台系统中进行注册、登录、浏览商品、首页、下单等操作
- [x] 用户系统：用户可以在该系统中查询已下的订单、管理订单、我的优惠券等信息
- [x] 订单系统：提供下单、查询订单、修改订单状态、定时处理订单
- [x] 搜索系统：提供商品的搜索功能
- [x] 单点登录系统：为多个系统之间提供用户登录凭证以及查询登录用户的信息

### v1.0更新日志(需更新前后台代码及SQL)
- [x] 接入自己开源的[DcPay个人免签收款支付系统](https://dcpay.dcmaomi.com)
- [x] 解决服务器跨域问题
- [x] 修改金额字段类型优化SQL与备注
- [x] 优化后台页面 修复用户修改BUG 优化批量删除 优化商品分类添加
- [x] 重构首页，后台可配置。
- [x] 增添订单统计报表
- [x] 添加前后端分离极验验证码
- [x] 取消快速搜索接口需前端配置
- [x]  首页导航栏可后台配置

![](https://www.dcmaomi.com:3010/serverImage/20210305000838_16208.png "后台首页")

![](https://www.dcmaomi.com:3010/serverImage/20210305011146_13147.png "商品管理")

![](https://www.dcmaomi.com:3010/serverImage/20210305011146_16878.png "系统日志")

![](https://www.dcmaomi.com:3010/serverImage/20210305011146_17326.png "前台首页")

![](https://www.dcmaomi.com:3010/serverImage/20210305011146_16426.png "用户管理")

### 前端所用技术
- 后台页面
    - [vue 2.x](https://cn.vuejs.org/)：vue全家桶
    - [echarts](http://echarts.apache.org/zh/)：图表插件
    - [Element](https://element.eleme.cn/#/zh-CN)：Element-UI 组件库
    - 第三方接口
    - [中国天气网](https://cj.weather.com.cn/plugin/standard)：中国天气网 天气插件
- 前台页面
    - 感谢 [Exrick](https://github.com/Exrick/xmall) 的开源 
    - [vue 3.0](https://www.vue3js.cn/docs/zh/) + Vuex + Vue Router + Ant Desing vue + ES6 + webpack + axios + Node.js
### 后端所用技术
- 主要
   - [Node Js](https://nodejs.org/zh-cn/)：Node.js
   - [express](https://www.expressjs.com.cn/)基于 Node.js 平台， Web 开发框架
   - [mysql](https://www.mysql.com/)基于 Node.js 平台， Web 开发框架
   - [Swagger2](https://www.dcmaomi.com:3000/api/swagger/#/)：Api文档生成
   - [svg-captcha](https://www.npmjs.com/package/svg-captcha)：登录验证码
   - [silly-datetime](https://www.npmjs.com/package/silly-datetime)：时间格式化工具
   - [qr-image](https://www.npmjs.com/package/silly-datetime)：链接生成二维码
- 第三方接口
  - 高德地图城市列表API：获取全国省/市/县(区)三级列表 需要注册appid
  - [天气api](http://www.tianqiapi.com/index/doc?version=day)：根据Ip地址获取城市天气（服务器主要用来获取城市）需要注册appid
- 第三方SDK
  - [alipay-sdk](http://www.tianqiapi.com/index/doc?version=day)：支付宝支付Sdk
- 服务器
  - [宝塔建站](https://www.bt.cn/)：宝塔建站
  - [Apache](http://httpd.apache.org/)
### DM商城本地运行
- 前后端分离请先运行[后端](https://github.com/asd494235908/DM-Server)
- node.js 版本(v12.18.3) 
- vue-cli 版本(@vue/cli 4.5.4)
- 下载zip直接解压或安装git后执行克隆命令 `git clone https://github.com/asd494235908/Dm.git`
- 右键进入PowerShell 


初始化项目
```
npm install
```

```javascript
// src/main.js 配置
axios.defaults.baseURL = "http://您的本地服务器地址:3000"  //注意http与https
```
运行项目
```
npm run serve
```
### 更新日志
  - 登录增加了rsa加密。
  - 优化打包配置
### 技术疑问交流
- 免费交流群 `949139553` [![](http://pub.idqqimg.com/wpa/images/group.png)](https://qm.qq.com/cgi-bin/qm/qr?k=dtD6X04E3q7v3C8wuOnUENoW5S7hdGHO&jump_from=webapi)
- 作者邮箱 asd494235908@qq.com
### 商用授权
- 个人学习使用遵循GPL开源协议
- 商用需联系作者低价授权
### [捐赠](https://www.dcmaomi.com)