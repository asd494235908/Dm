<template>
  <div>
    <MyHerder></MyHerder>
    <div class="my_info_warp">
      <div class="limit">
        <div class="my_info_left">
          <div class="user_info">
            <img class="user_info_img" :src="LogIn_User_Info.img" alt="" />
            <h2 class="user_info_nickName">
              <span class="ellipsis">{{ LogIn_User_Info.nick_name }}</span>
            </h2>
            <p class="user_info_autograph">
              <span class="ellipsis">{{ LogIn_User_Info.desc }}</span>
            </p>
          </div>
          <ul class="user_link">
            <li
              class="link_item"
              :class="{ acitve: item.bg }"
              v-for="(item, index) in data"
              :key="index + 'link_item'"
              @click="handel_link(item, index)"
            >
              {{ item.name }}
            </li>
            <li class="link_item" @click="logout">退出登录</li>
          </ul>
        </div>
        <div class="my_info_right"><router-view></router-view></div>
      </div>
    </div>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import MyHerder from "@/components/my_herder/herder.vue";

import PageBottom from "@/components/page_bottom/index.vue";
import { useRoute, useRouter } from "vue-router";
import { Item } from "ant-design-vue/lib/vc-menu";
import { useStore } from "vuex";
import { removeStore } from "@/utils/storage.js";

export default {
  components: {
    MyHerder,
    PageBottom
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      count: 0,
    });
    const link = reactive({
      data: [
        {
          name: "我的订单",
          link: "/order",
          bg: false,
        },
        {
          name: "收获地址",
          link: "/address",
          bg: false,
        },
        {
          name: "我的信息",
          link: "/userInfo",
          bg: false,
        },
        {
          name: "浏览历史",
          link: "/Browsing_history",
          bg: false,
        },
        {
          name: "优惠券",
          link: "/coupon",
          bg: false,
        },
        {
          name: "客服",
          link: "/customer",
          bg: false,
        },
      ],
    });
    onMounted(() => {
      init();
    });
    const init = () => {
      link.data.forEach((item) => {
        if (item.link === route.path) {
          item.bg = true;
        } else {
          item.bg = false;
        }
      });
    };
    //当前用户的头像，昵称，签名
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
    const handel_link = (item, index) => {
      router.push({
        path: item.link,
      });
      link.data.forEach((el, idx) => {
        if (index === idx) {
          el.bg = true;
        } else {
          el.bg = false;
        }
      });
    };
    const logout = () => {
      if (store.state.login) {
        removeStore("my_token");
        store.commit("logout");
        router.push({
          path: "/",
        });
      }
    };
    return {
      ...toRefs(state),
      ...toRefs(link),
      handel_link,
      LogIn_User_Info,
      logout,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.my_info_warp {
  width: 100%;
  margin-top: 60px;
  .limit {
    width: 1200px;
    height: 700px;
    margin: 0 auto;
    display: flex;
    // align-items: center;
    justify-content: space-between;
    .my_info_left {
      width: 200px;
      height: 560px;
      background-color: $cf;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      .user_link {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 16px;
        a {
          width: 100%;
        }
        .link_item:hover {
          background-color: $main-col;
          color: $cf;
        }

        .link_item {
          width: 100%;
          padding: 10px;
          color: $main-col;
          font-size: 15px;
          font-weight: bold;
          text-align: center;
          cursor: pointer;
        }
        .acitve {
          background-color: $main-col;
          color: $cf;
        }
      }

      .user_info {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 30px;
        user-select: none;
        .user_info_img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid $main-col;
          box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3);
        }
        .user_info_nickName {
          margin-top: 10px;
          font-size: 20px;
          font-weight: bold;
          span {
            display: inline-block;
            width: 180px;
            text-align: center;
          }
        }
        .user_info_autograph {
          margin-top: 10px;
          font-size: 14px;
          font-weight: bold;
          span {
            display: inline-block;
            width: 180px;
            text-align: center;
          }
        }
      }
    }
    .my_info_right {
      width: 970px;
      height: 100%;
      margin-left: 30px;
      border-radius: 4px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
  }
}
</style>
