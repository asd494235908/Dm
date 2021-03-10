import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dayjs from 'dayjs'
// import 'default-passive-events'
const app = createApp(App)
// 引入Antd配置文件
import Antd from './ant/ant.js'
// 引入css
import 'ant-design-vue/dist/antd.less';

app.use(Antd)


import axios from 'axios'
import VueLazyLoad from 'vue3-lazyload'
import { getStore } from "@/utils/storage.js";

axios.defaults.baseURL = "https://www.dcmaomi.com:3000"  //注意http与https


//每次发送请求时候都要获取token，有token就是登录的，没有就是为登录
axios.interceptors.request.use(config => {
    const token = getStore('my_token')
    if (token) {
        // 用户已登录,设置请求头
        config.headers.common.Authorization = token

    }
    //使用的这个方法后必须要 return 对象出去 不然会报错
    return config
}, err => {
    console.log(err)
})
app.config.globalProperties.$http = axios
app.config.globalProperties.$dayjs = dayjs
// app.use(VueAxios, axios)
app.use(VueLazyLoad, {
    preLoad: 1.3,
    error: require('../public/static/img/logding.gif'),
    loading: require('../public/static/img/logding.gif'),
    // dispatchEvent: true,
    attempt: 1
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    // 每次进入一个页面之后都要发送请求查看是否为登陆状态
    axios.post('/api/validate', {}).then(res => {
        const data = res.data
        // console.log(data)
        if (data.success !== true) {
            // 用户要登录
            if (to.matched.some(res => res.meta.islogin)) {
                // 用户未登录 需要跳转登录页面
                next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    }
                })
            } else {
                next()
            }
        } else {
            //是登录状态的话保存用户信息
            store.commit('seveLogin', data.data)
            store.commit('modifyLogin', true)
            if (to.path === '/login') {
                router.push({
                    path: '/',
                })
            }
            next()
        }
    }).catch(err => {
        console.log(err)
    })
})
app.use(store).use(router).mount('#app')
