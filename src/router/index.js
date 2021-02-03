import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index/index.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      title: 'DM商城'
    }
  },
  {
    path: '/Home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/home/home.vue'),
    meta: {
      title: 'DM商城'
    }
  },
  {
    path: '/Login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/login/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/GoodInfo',
    name: 'GoodInfo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/goodInfo/index.vue'),
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/commodity',
    name: 'commodity',
    component: () => import('../views/commodity/index.vue'),
    meta: {
      title: '商品列表'
    }
  },
  {
    path: '/ShoppingCart',
    name: 'ShoppingCart',
    component: () => import('../views/ShoppingCart/index.vue'),
    meta: {
      islogin: true,
      title: '购物车'
    }
  },
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import('../views/order_list/index.vue'),
    meta: {
      islogin: true,
      title: '订单详情'
    }
  },
  {
    path: '/UpDataOrder',
    name: 'UpDataOrder',
    component: () => import('../views/up_data_order/index.vue'),
    meta: {
      islogin: true,
      title: '提交订单'
    }
  },
  {
    path: '/payPage',
    name: 'payPage',
    component: () => import('../views/playPage/index.vue'),
    meta: {
      islogin: true,
      title: '订单支付'
    }
  },
  {
    path: '/donation',
    name: 'donation',
    component: () => import('../views/donation/index.vue'),
    meta: {
      title: '捐赠列表'
    }
  },
  {
    path: '/MyInfo',
    name: 'MyInfo',
    component: () => import('../views/MyInfo/index.vue'),
    meta: {
      islogin: true
    },
    children: [
      {
        path: '/order',
        name: 'order',
        component: () => import('../views/order/index.vue'),
        meta: {
          title: '我的订单'
        }
      },
      {
        path: '/address',
        name: 'address',
        component: () => import('../views/address/index.vue'),
        meta: {
          title: '收货地址'
        }
      },
      {
        path: '/Browsing_history',
        name: 'Browsing_history',
        component: () => import('../views/Browsing_history/index.vue'),
        meta: {
          title: '浏览历史'
        }
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('../views/user_info/index.vue'),
        meta: {
          title: '我的信息'
        }
      },
      {
        path: '/coupon',
        name: 'coupon',
        component: () => import('../views/coupon/index.vue'),
        meta: {
          title: '优惠券'
        }
      },
      {
        path: '/customer',
        name: 'customer',
        component: () => import('../views/customer/index.vue'),
        meta: {
          title: '客服'
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
