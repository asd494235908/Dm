import { createStore } from 'vuex'
import { setStore, getStore, removeStore } from "@/utils/storage.js";
export default createStore({
  state: {
    userInfo: {},
    login: false,
    nav_Show: false,
    //触发购物车数量动画
    nav_Good: false,
    user_cart: [],
    play_data: {
    },
    orderData: {},
    isload:true
  },
  mutations: {
    changeLoad(state, x) {
      state.isload = x
    },
    seveOrderData(state, data) {
      state.orderData = data
    },
    seveLogin(state, data) {
      state.user_cart = data.user_cart
      state.userInfo = data
    },
    modifyLogin(state, a) {
      state.login = a
    },
    changeNav_Data(state, a) {
      state.nav_Show = a
    },
    changenav_Good(state, a) {
      state.nav_Good = a
    },
    changeuser_cart(state, a) {

      const cart = getStore('good_cart')
      if (cart === null) {
        const arr = []
        arr.push(a)
        state.user_cart.push(a)
        setStore('good_cart', arr)
      } else {
        let data = JSON.parse(cart)
        data.push(a)
        state.user_cart.push(a)
        setStore('good_cart', data)
      }
    },
    defaultUserCart(state) {
      const cart = getStore('good_cart')
      if (cart !== null) {
        let data = JSON.parse(cart)
        state.user_cart = data
      }
    },
    addCart_Arr(state, arr) {
      state.user_cart = arr
    },
    Dlle_Cart(state, index) {
      state.user_cart.splice(index, 1)
    },
    logout(state) {
      state.login = false
      state.user_cart = []
      state.userInfo = {}
    },
    sevePlayData(state, data) {
      state.play_data = data
    },
  },
  actions: {
  },
  modules: {
  }
})
