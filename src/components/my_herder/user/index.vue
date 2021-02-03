<template>
  <div class="template_warp">
    <div class="user_info_warp">
      <div class="user" @mouseout="userMouseout" @mouseover="userMouseover">
        <router-link to="/order"><div class="user_img" :style="{ backgroundPositionX: userX + 'px' }"></div></router-link>
        <div class="user_info" :style="{ top: difal_top + 'px' }" :ref="user_warp">
          <div class="user_info_warp">
            <img
              class="user_info_img"
              :class="{ user_info_img_active: user }"
              :src="LogIn_User_Info.img"
              alt=""
            />
            <h2 class="user_nickNmae">
              <span class="ellipsis">{{ LogIn_User_Info.nick_name }}</span>
            </h2>
            <h2 class="user_nickStyle">
              <span class="ellipsis">{{ LogIn_User_Info.desc }}</span>
            </h2>
            <ul class="info_item_warp">
              <li class="info_item">
                <router-link to="/order">我的订单</router-link>
              </li>
              <li class="info_item">
                <router-link to="/address">收获地址</router-link>
              </li>
              <li class="info_item">
                <router-link to="/Browsing_history">浏览历史</router-link>
              </li>
              <li class="info_item">
                <router-link to="/coupon">优惠券</router-link>
              </li>
              <li class="info_item">
                <router-link to="/customer">客服</router-link>
              </li>
              <li class="info_item" v-if="login" @click="logout">退出登录</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="good" class="good" @mouseout="goodMouseout" @mouseover="goodMouseover">
        <router-link to="/ShoppingCart"><div class="good_img" :style="{ backgroundPositionX: goodX + 'px' }"></div></router-link>
        <div
          class="good_Info"
          :style="{ height: Good_Height + 'px', top: difal_top + 'px' }"
        >
          <div class="good_Info_warp">
            <div
              class="good_Info_item"
              v-for="(item, index) in userGood"
              :key="'good_Info_item' + index"
            >
              <div class="item_left">
                <img v-lazy="{ src: item.data[0].img_url1 }" :key="item.data[0].img_url1+'item_left'" alt="" />
              </div>
              <div class="item_right">
                <p class="item_name">
                  <span class="ellipsis">{{ item.data[0].spu_title }}</span>
                </p>
                <p class="item_desc">
                  <span
                    ><i class="price">{{ Number(item.price).toFixed(2) }}</i
                    >X{{ item.suplist_num }}</span
                  >
                  <span>款式：{{ item.style }}</span>
                </p>
              </div>
              <div class="item_clos">
                <div class="icon" @click="dellItem(item, index)"></div>
              </div>
            </div>
            <div class="good_info_no" v-if="userGood.length === 0">
              <img src="https://s1.ax1x.com/2020/10/17/0L3dZF.png" alt="" />
              <p>购物车里面什么都没有空空如也</p>
            </div>
          </div>
          <div class="bouttom" v-if="userGood.length !== 0">
            <div class="bouttom_left">
              <p class="desc">
                共计<span class="red">{{ userGood.length }}</span
                >件商品
              </p>
              <p class="desc">
                合计:￥<span class="red">{{ All_Price }}</span>
              </p>
            </div>
            <div class="bouttom_right">
              <div>
                <a-button type="primary" shape="round" size="large" @click="goCart">
                  <template #icon>去购物车 </template>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="num" :class="{ num_active: nav_Good_admintion }">
        {{ userGood.length }}
      </div>
    </div>
    <a-modal
      title="提示"
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      keyboard
      destroyOnClose
      cancelText="取消"
      okText="确定"
    >
      <p>{{ ModalText }}</p>
    </a-modal>
  </div>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance, watch, nextTick } from "vue";
import { useStore } from "vuex";
import { setStore, getStore, removeStore } from "@/utils/storage.js";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";

export default {
  props: {
    difal_userX: {
      type: String,
    },
    change_userX: {
      type: String,
    },
    difal_goodX: {
      type: String,
    },
    change_goodX: {
      type: String,
    },
    difal_top: {
      type: String,
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();

    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      user: false,
      good: false,
      All_Price: 0,
      visible: false,
      confirmLoading: false,
      dell_Item: null,
      dell_index: 0,
      Good_Height: 0,
    });
    const ModalText = computed(() => {
      if (state.dell_Item === null) {
        return "";
      } else {
        return "是否删除" + state.dell_Item.data[0].spu_title + "？";
      }
    });
    const nav_Good_admintion = computed(() => {
      if (store.state.nav_Good) {
        state.good = true;
        _changeGoodHeight();
      }
      return store.state.nav_Good;
    });
    const userX = computed(() => {
      if (state.user) {
        return props.change_userX;
      } else {
        return props.difal_userX;
      }
    });
    const goodX = computed(() => {
      if (state.good) {
        return props.change_goodX;
      } else {
        return props.difal_goodX;
      }
    });
    let user_refs = "";
    const user_warp = (el) => {
      user_refs = el;
    };
    const userMouseout = () => {
      state.user = false;
      nextTick(() => {
        user_refs.style.height = "";
      });
    };
    const userMouseover = (e) => {
      state.user = true;
      nextTick(() => {
        user_refs.style.height = 400 + "px";
      });
    };
    const goodMouseout = () => {
      state.good = false;
      state.Good_Height = 0;
    };
    const goodMouseover = () => {
      state.good = true;
      _changeGoodHeight();
    };
    const _changeGoodHeight = () => {
      if (store.state.user_cart.length === 0) {
        state.Good_Height = 250;
      } else {
        state.Good_Height = store.state.user_cart.length * 112 + 60;
        state.Good_Height = state.Good_Height > 600 ? 600 : state.Good_Height;
      }
    };
    const userGood = computed(() => {
      let a = 0;
      if (store.state.user_cart.length !== 0) {
        store.state.user_cart.forEach((element) => {
          a += element.price;
        });
        state.All_Price = Number(a).toFixed(2);
      }
      return store.state.user_cart;
    });
    const handleCancel = () => {
      state.good = true;
      _changeGoodHeight();
    };
    const handleOk = () => {
      state.confirmLoading = true;
      if (store.state.login) {
        const uid = store.state.userInfo.uid;
        UpData_Good(state.dell_Item, state.dell_index);
      } else {
        store.commit("Dlle_Cart", state.dell_index);
        const cart = getStore("good_cart");
        let data = JSON.parse(cart);
        data.splice(state.dell_index, 1);
        setStore("good_cart", data);
        state.confirmLoading = false;
        state.visible = false;
        state.good = true;
        _changeGoodHeight();
        message.success('删除成功')
      }
    };
    //删除购物车
    const dellItem = (item, index) => {
      state.dell_Item = item;
      state.dell_index = index;
      state.visible = true;
    };
    const UpData_Good = async (data, uid) => {
      const res = await proxy.$http.post("/api/dellGoodItem", {
        isWeb: true,
        isAdd: false,
        uid,
        data,
      });
      if (res.data.success === true) {
        update_userInfo();
        message.success('删除成功')
      } else {
        message.error("删除失败");
      }
    };
    const update_userInfo = async () => {
      const res = await proxy.$http.post("/api/validate", {});
      const data = res.data;
      if (data.success === true) {
        store.commit("seveLogin", data.data);
        state.confirmLoading = false;
        state.visible = false;
        state.good = true;
      } else {
        message.error("跟���数据失败");
      }
    };
    const login = computed(() => {
      return store.state.login;
    });
    const LogIn_User_Info = computed(() => {
      let data = {
        img: "",
        nick_name: "",
        desc: "",
      };
      if (store.state.login) {
        if (
          store.state.userInfo.user_img === "null" ||
          store.state.userInfo.user_img === null
        ) {
          data.img = "https://www.dcmaomi.com:3000/serverImage/weidnglu.png";
        } else {
          data.img = store.state.userInfo.user_img;
        }
        if (
          store.state.userInfo.user_name === "null" ||
          store.state.userInfo.user_name === null
        ) {
          data.nick_name = "未设置";
        } else {
          data.nick_name = store.state.userInfo.user_name;
        }
        if (
          store.state.userInfo.user_autograph === "null" ||
          store.state.userInfo.user_autograph === null
        ) {
          data.desc = "未设置";
        } else {
          data.desc = store.state.userInfo.user_autograph;
        }
      } else {
        data.img = "https://www.dcmaomi.com:3000/serverImage/weidnglu.png";
        data.nick_name = "未登录";
        data.desc = "";
      }
      return data;
    });
    const logout = () => {
      if (store.state.login) {
        removeStore("my_token");
        store.commit("logout");
        router.push({
          path: "/",
        });
      }
    };
    const goCart = ()=>{
      router.push({
          path: "/ShoppingCart",
        });
    }
    return {
      ...toRefs(state),
      userMouseout,
      userMouseover,
      goodMouseout,
      goodMouseover,
      userX,
      goodX,
      nav_Good_admintion,
      userGood,
      dellItem,
      handleOk,
      handleCancel,
      ModalText,
      login,
      user_warp,
      LogIn_User_Info,
      logout,
      goCart,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.template_warp {
  height: 100%;
}
.user_info_warp {
  height: 100%;
  display: flex;
  align-items: center;
  // color: $cf;
  letter-spacing: 1px;
  .num_active {
    animation: my_good_move ease-in-out 0.6s;
  }
  @keyframes my_good_move {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }
  .num {
    width: 25px;
    height: 25px;
    background-color: red;
    color: $cf;
    font-weight: bold;
    border-radius: 50%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .good:hover {
    background-position-y: -19px;
  }
  .good {
    width: 25px;
    height: 100%;
    margin: 0 10px;
    position: relative;
    cursor: pointer;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .good_img {
    width: 25px;
    height: 25px;
    background-image: url("../../../../public/static/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png");
    background-position-y: -19px;
  }

  .good_Info_warp::-webkit-scrollbar-thumb:horizontal {
    /*水平滚动条的样式*/
    width: 4px;
    background-color: #cccccc;
    -webkit-border-radius: 6px;
  }
  .good_Info_warp::-webkit-scrollbar-track-piece {
    background-color: #fff; /*滚动条的背景颜色*/
    -webkit-border-radius: 0; /*滚动条的圆角宽度*/
  }
  .good_Info_warp::-webkit-scrollbar {
    width: 10px; /*滚动条的宽度*/
    height: 8px; /*滚动条的高度*/
  }
  .good_Info_warp::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: #999;
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }
  .good_Info_warp::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    height: 50px;
    -webkit-border-radius: 4px;
  }
  .good_Info {
    display: block;
    position: absolute;
    // left: 50%;
    right: -35px;
    // transform: translateX(-50%);
    width: 400px;
    height: 0;
    background-color: $bgfff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    // padding: 5px;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    .bouttom {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      // opacity: .9;
      z-index: 9999;
      background-color: $cf;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      .bouttom_left {
        flex: 1;
        font-size: 15px;
        font-weight: bold;
        .desc {
          margin: 5px 0 !important;
          .red {
            color: $jcg;
          }
        }
      }

      .bouttom_right {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .good_Info_warp {
      width: 100%;
      position: relative;
      min-height: 160px;
      max-height: 600px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 60px;
      // position: relative;
      .good_Info_item {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        margin: 16px 0;
        .item_left {
          width: 75px;
          height: 75px;
          box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
          img {
            width: 100%;
            height: 100%;
          }
        }
        .item_right {
          flex: 1;
          margin-left: 16px;
          .item_name {
            span {
              display: inline-block;
              width: 240px;
              font-weight: bold;
              font-size: 15px;
            }
          }

          .item_desc {
            display: flex;
            padding-right: 20px;
            justify-content: space-between;
            .price {
              font-size: 15px;
              margin: 0 6px;
              color: $jcg;
              font-weight: bold;
            }
          }
        }
        .item_clos {
          width: 30px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon:hover {
            background-position-y: 0;
          }
          .icon {
            width: 25px;
            height: 25px;
            background-image: url("../../../../public/static/img/delete-btn-icon_a35bf2437e@2x.jpg");
            background-size: cover;
            background-position-y: 25px;
          }
        }
      }
    }

    .good_info_no {
      width: 100%;
      height: 160px;
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img {
        width: 100px;
        height: 100px;
        position: relative;
        left: -10px;
      }
      p {
        margin-top: 20px !important;
        color: $cc;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }

  .user:hover .user_info {
    display: block;
  }
  .user:hover {
    background-position-y: 2px;
  }
  .user {
    width: 25px;
    height: 100%;
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    z-index: 99;
    .user_img {
      width: 25px;
      height: 25px;
      background-image: url("../../../../public/static/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png");
      background-position-y: 2px;
    }
    .user_img:hover {
      // background-position-x: -2px;
      // background-position-y: 2px;
    }
    .user_info {
      display: block;
      position: absolute;
      height: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      background-color: $bgfff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      overflow: hidden;
      transition: all 0.5s ease-in-out;
      z-index: 999;
      .user_info_warp {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .user_info_img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          box-shadow: 0 0px 4px rgba(0, 0, 0, 0.3);
          border: 2px solid $main-col;
          margin-top: 20px;
          transform: scale(0);
          transition: all 0.3s ease-in-out;
        }
        .user_info_img_active {
          transform: scale(1);
        }
        .user_nickNmae {
          font-size: 18px;
          margin: 0 !important;
          span {
            display: inline-block;
            width: 120px;
            font-weight: bold;
            text-align: center;
          }
        }
        .user_nickStyle {
          font-size: 14px;
          margin: 0 !important;
          span {
            display: inline-block;
            width: 120px;
            text-align: center;
            color: $c9;
          }
        }
        .info_item_warp {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 !important;
          .info_item:hover {
            background-color: rgba($color: #ff9344, $alpha: 0.2);
            color: #ff9344;
            a {
              color: #ff9344;
            }
          }
          .info_item {
            width: 90%;
            height: 100%;
            font-size: 15px;
            margin: 6px 0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $c6;
            overflow: hidden;
            user-select: none;
            a {
              display: inline-block;
              width: 100%;
              height: 100%;
              display: flex;
              color: $c6;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
    // .user_info::after {
    //   content: "";
    //   position: absolute;
    //   top: -10px;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   width: 0;
    //   height: 0;
    //   border-width: 0 10px 10px;
    //   border-style: solid;
    //   border-color: transparent transparent $bgfff;
    // }
  }
}
</style>
