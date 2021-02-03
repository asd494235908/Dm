<template>
  <div class="nav">
    <div class="limit">
      <div class="logo">
        <router-link to="/"
          ><img src="../../../public/static/img/logo.png" alt="logo" class="img"
        /></router-link>
      </div>
      <div class="nav_content">
        <div class="search">
          <a-input-search
            v-model:value="value"
            placeholder="请输入你想收缩的内容"
            enter-button="Search"
            size="large"
            suffix="搜索"
            enterButton
            :loading="searchLodin"
            :allowClear="true"
            @change="onSearchChange"
            @search="onSearch"
            @blur="isSearchBlur"
            @focus="searchFocus"
          />
          <div class="search_content" :style="{ height: searchHight }">
            <ul class="search_warp">
              <li
                class="search_item item_hover"
                v-for="(item, index) in search"
                :key="'search' + index"
                @click="handelSearchItem(item)"
              >
                {{ item.spu_title }}
              </li>
              <li class="search_no search_item" v-if="searchDesc">没有搜索到任何内容</li>
            </ul>
          </div>
          <div
            class="search_hot"
            v-if="HotData.length !== 0"
            :class="{ hot_active: isHot }"
          >
            <p class="hot_top">热门搜索</p>
            <ul class="search_hot_warp">
              <li
                class="search_Item"
                v-for="(item, index) in HotData"
                :key="index + 'search_Item'"
              >
                <router-link :to="'/commodity?link=' + item.search_name"
                  >{{ item.search_name }}
                  <i class="iconfont" v-if="index < 3">&#xe60e;</i></router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="text_nav">
          <div class="download_app">
            <p class="download_app_text">下载app</p>
            <div class="download_box">
              <p>扫码下载</p>
              <img
                src="../../../public/static/img/downloadApp.png"
                class="download_img"
                alt=""
              />
            </div>
          </div>
          <div class="download_app">
            <p class="download_app_text">使用小程序</p>
            <div class="download_box">
              <p>下载APP</p>
              <img
                src="../../../public/static/img/logo.png"
                class="download_img"
                alt=""
              />
            </div>
          </div>
          <div class="download_app">
            <p class="download_app_text">
              <router-link to="/donation">捐赠名单</router-link>
            </p>
          </div>
        </div>
        <div class="desc">|</div>
        <div class="nav_cart" :class="{ active: nav_Show }">
          <user
            difal_userX="88"
            difal_goodX="88"
            change_userX="-2"
            change_goodX="-2"
            difal_top="80"
          ></user>
        </div>
      </div>
    </div>
    <my-class></my-class>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
  onMounted,
  provide,
  onUnmounted,
} from "vue";
import user from "@/components/my_herder/user/index.vue";
import MyClass from "@/components/my_herder/classification/index.vue";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
export default {
  props: {
    nav_data: {
      type: Array,
      default: [],
    },
  },
  components: {
    user,
    MyClass,
  },

  setup(props) {
    const store = useStore();
    //初始化一下本���购物车 /购物车组件被引用了两次
    store.commit("defaultUserCart");
    const { proxy } = getCurrentInstance();
    const state = reactive({
      count: 0,
      value: "",
      search: [],
      timer: null,
      searchLodin: false,
      SearcTimer: null,
      isHot: false,
      HotData: [],
    });
    onMounted(() => {
      initHot();
      window.addEventListener("scroll", IndexScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", IndexScroll);
    });
    const initHot = async () => {
      const res = await proxy.$http.get("/api/getSerchHot");
      if (res.data.success === true) {
        state.HotData = res.data.data;
      } else {
        message.error("请求热门数据失败");
      }
    };
    const IndexScroll = () => {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 99) {
        store.commit("changeNav_Data", true);
      } else {
        store.commit("changeNav_Data", false);
      }
    };
    const nav_Show = computed(() => {
      return store.state.nav_Show ? true : false;
    });
    const isSearchBlur = () => {
      state.isHot = false;
      setTimeout(() => {
        state.value = "";
        state.search = [];
      }, 500);
    };
    //
    const searchDesc = computed(() => {
      if (state.value !== "" && state.search.length === 0) {
        return true;
      } else {
        return false;
      }
    });
    //搜索框内容的高度
    const searchHight = computed(() => {
      if (searchDesc.value) {
        return 42 + "px";
      } else {
        return state.search.length * 42 + "px";
      }
    });
    //搜索框内容发生变化时触发
    const onSearchChange = () => {
      clearTimeout(state.SearcTimer);
      state.SearcTimer = setTimeout(() => {
        if (state.value === "" || state.value === null) {
          state.search = [];
          state.isHot = true;
          return;
        }
        onSearch();
      }, 500);
    };
    const onSearch = () => {
      if (state.value === "" || state.value === null) {
        message.error("请输入搜索内容");
        return;
      }
      state.isHot = false;
      clearTimeout(state.timer);
      state.timer = setTimeout(async () => {
        state.searchLodin = true;
        const res = await proxy.$http.get(`/api/search?val=${state.value}`);
        if (res.data.success === true) {
          state.search = res.data.data;
          state.searchLodin = false;
        }
      }, 300);
    };
    //点击搜索内容
    const handelSearchItem = (item) => {
      console.log(item);
    };
    const searchFocus = () => {
      state.isHot = true;
    };
    return {
      ...toRefs(state),
      searchHight,
      onSearch,
      onSearchChange,
      searchDesc,
      isSearchBlur,
      handelSearchItem,
      nav_Show,
      searchFocus,
      ...toRefs(props),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.iconfont {
  margin: 0 10px;
}
.search_hot {
  width: 100%;
  height: 0;
  position: absolute;
  background-color: $cf;
  top: 61px;
  left: 0;
  z-index: 99;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.5s ease-in-out;
  .hot_top {
    width: 100%;
    padding: 0 10px;
    font-size: 20px;
    font-weight: bold;
  }

  .search_hot_warp {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 !important;
    padding: 10px 0;
  }
  .search_Item:hover {
    width: 100%;
    background: rgba($color: #ff9344, $alpha: 0.1);
  }
  .search_Item {
    width: 100%;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    font-size: 15px;

    cursor: pointer;
    a {
      display: inline-block;
      width: 100%;
      color: $c6;
    }
  }
}
.hot_active {
  height: 320px;
}
.nav_cart {
  height: 100%;
  z-index: 999;
  transition: all 0.5s ease-in-out;
}
.active {
  transform: scale(0);
  opacity: 0;
}
.nav {
  width: 100%;
  background-color: $head-bgc;
  .limit {
    width: 1200px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-content: center;
    justify-content: space-between;
    // background-color: red;
  }
  .logo {
    width: 100px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      display: inline-block;
      width: 40px;
      height: 40px;
      object-fit: cover;
    }
  }
  .nav_content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .search {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 60px;
      margin-right: 30px;
      position: relative;
      .search_content {
        position: absolute;
        width: 100%;
        top: 60px;
        left: 0px;
        border-radius: 0px 0px 4px 4px;
        background-color: $cf;
        box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        transition: all 0.3s ease-in-out;
        overflow: hidden;
        z-index: 99;
        .search_warp {
          padding: 10px;
          width: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          .item_hover:hover {
            background-color: rgba($color: #ff9344, $alpha: 0.1);
          }
          li:nth-child(1) {
            margin-top: 5px;
          }
          .search_item {
            display: flex;
            align-items: center;
            font-size: 14px;
            height: 40px;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
    }
    .user_info_warp {
      height: 100%;
      display: flex;
      align-items: center;
      color: $cf;
      letter-spacing: 1px;
      .num {
        width: 20px;
        height: 20px;
        background-color: red;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .good:hover .good_Info {
        display: block;
      }
      .good:hover {
        background-position-x: -2px;
        background-position-y: -19px;
      }
      .good {
        width: 25px;
        height: 25px;
        background-image: url("../../../public/static/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png");
        background-position-x: 88px;
        background-position-y: -19px;
        margin: 0 10px;
        position: relative;
        cursor: pointer;
      }
      .good_img {
      }
      .good_Info {
        display: none;
        position: absolute;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        width: 160px;
        height: 160px;
        background-color: $bgfff;
        box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
        padding: 20px;
      }
      .good_Info::after {
        content: "";
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent $bgfff;
      }
      .user:hover .user_info {
        display: block;
      }
      .user:hover {
        background-position-x: -2px;
        background-position-y: 2px;
      }
      .user {
        width: 25px;
        height: 25px;
        background-image: url("../../../public/static/img/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png");
        background-position-x: 88px;
        background-position-y: 2px;
        margin: 0 10px;
        position: relative;
        cursor: pointer;
        .user_img:hover {
          background-position-x: -2px;
          background-position-y: 2px;
        }
        .user_info {
          display: none;
          position: absolute;
          top: 35px;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 160px;
          background-color: $bgfff;
          box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        .user_info::after {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-width: 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent $bgfff;
        }
      }
    }
    .text_nav {
      height: 100%;
      display: flex;
      align-items: center;
      color: $cf;
      letter-spacing: 1px;
      .download_app:hover .download_box {
        display: block;
      }
      .download_app {
        margin: 0 10px;
        position: relative;
        cursor: pointer;
        a {
          color: $cf;
        }
        .download_box {
          display: none;
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 230px;
          background-color: $bgfff;
          box-shadow: 0 0px 4px rgba(0, 0, 0, 0.4);
          padding: 10px;
          z-index: 99;
          border-radius: 4px;
          p {
            height: 30px;
            line-height: 30px;
            color: $c6;
            border-bottom: 1px solid $xt;
            text-align: center;
            font-weight: bold;
          }
          .download_img {
            width: 180px;
            height: 180px;
          }
        }
        .download_box::after {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-width: 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent $bgfff;
        }
      }
    }
  }
}
</style>
