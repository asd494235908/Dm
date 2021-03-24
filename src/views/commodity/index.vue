<template>
  <div>
    <my-herder />
    <div class="commodity_warp">
      <div class="limit">
        <div class="commodity_top">
          <div class="commodity_top_left">
            <div
              class="sort_item"
              :class="{ active: index === sort_index }"
              v-for="(item, index) in options1"
              :key="index + 'sort_item'"
              @click="handesort_item(item, index)"
            >
              {{ item.label }}
            </div>
          </div>
          <div class="commodity_top_right">
            <a-input
              prefix="￥"
              type="number"
              suffix="RMB"
              v-model:value="input1"
              style="margin: 0 10px"
              allowClear
            />~
            <a-input
              prefix="￥"
              type="number"
              style="margin: 0 10px"
              v-model:value="input2"
              suffix="RMB"
              allowClear
            />
            <a-button type="primary" style="margin: 0 10px" @click="Price_Range">
              确定
            </a-button>
          </div>
        </div>
        <div class="commodity_contnet" :class="{ commodity_contnet_limit: limit }">
          <good-item
            v-for="(o, j) in data"
            :key="'home_list' + j"
            :good_data="o"
            class="commodity_item"
          ></good-item>
          <div class="commodity_item_no" v-if="data.length === 0">
            <img src="https://www.dcmaomi.com:3000/serverImage/dsr1546asd.png" alt="" />
            <div class="commodity_item_no_desc">当前没有内容哦</div>
          </div>
          <div v-if="isGetData" class="desc">已经加载完毕了</div>
        </div>
        <div class="commodity_desc">
          <a-spin :delay="10" :spinning="isLodin" />
          <a-back-top class="icon"><VerticalAlignTopOutlined class="icons" /></a-back-top>
        </div>
      </div>
    </div>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, getCurrentInstance, onUnmounted, watch } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";
import { message } from "ant-design-vue";
import MyHerder from "@/components/my_herder/herder.vue";
import GoodItem from "@/components/good_Item/index.vue";
import { VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import PageBottom from "@/components/page_bottom/index.vue";
export default {
  components: {
    MyHerder,
    GoodItem,
    VerticalAlignTopOutlined,
    PageBottom,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      link: "",
      sort: 0,
      page: 1,
      sort_index: 0,
      input1: "",
      input2: "",
      isLodin: false,
      data: [],
      isGetData: false,
      timer: null,
      info: false,
      limit: false,
      options1: [
        {
          label: "默认排序",
          value: 0,
        },
        {
          label: "价格从高到低",
          value: 1,
        },
        {
          label: "价格从低到高",
          value: -1,
        },
      ],
    });
    onMounted(() => {
      init_Data();
      _get_data();
      window.addEventListener("scroll", commodityScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", commodityScroll);
    });
    onBeforeRouteUpdate((to, from, next) => {
      // console.log()
      // init_Data();
      // // _get_data()
      // next()
      state.link = to.query.link;
      _get_data();
      next();
    });
    watch(
      () => state.data,
      (x, y) => {
        if (x.length > 4) {
          state.limit = true;
        } else {
        }
      }
    );
    const init_Data = () => {
      if (route.query.link !== undefined && route.query.link !== "") {
        state.link = route.query.link;
        // console.log(state.link);
      } else {
        _back();
      }
    };
    const _back = () => {
      setTimeout(() => {
        router.go(-1);
      }, 2000);
      message.error("参数错误，即将返回上一页");
    };
    const handesort_item = (item, index) => {
      state.sort = item.value;
      state.sort_index = index;
      state.info = false;
      state.data = [];
      _get_data();
    };
    const _get_data = async () => {
      state.isLodin = true;
      const res = await proxy.$http.get(
        `/api/listgood?val=${state.link}&srot=${state.sort}&page=${state.page}&gt=${state.input1}&lte=${state.input2}`
      );
      if (res.data.success === true) {
        state.data = [];
        state.data = res.data.data;
        state.isLodin = false;
      } else {
        _back();
      }
    };
    const _Scroll_get_data = async () => {
      if (state.isGetData) {
        state.isLodin = false;
        return;
      }
      state.isLodin = true;
      const res = await proxy.$http.get(
        `/api/listgood?val=${state.link}&srot=${state.sort}&page=${state.page}&gt=${state.input1}&lte=${state.input2}`
      );
      if (res.data.success === true) {
        if (res.data.allData === state.data.length) {
          if (state.info) {
            message.info("已经加载完毕了");
            state.isGetData = true;
            state.isLodin = false;
          }
          state.data = res.data.data;
          return;
        }
        state.data = res.data.data;
      } else {
        _back();
      }
    };
    const commodityScroll = (event) => {
      clearTimeout(state.timer);

      state.timer = setTimeout(() => {
        //整个滚动条的高度
        const scrollHeight =
          document.documentElement.scrollHeight ||
          window.scrollHeight ||
          document.body.scrollHeight;
        //滑块到上方的高度
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        //滑块的高度
        const clientHeight =
          document.documentElement.clientHeight ||
          window.clientHeight ||
          document.body.clientHeight;
        //距离底部的距离
        const bouttom = scrollHeight - scrollTop - clientHeight;
        if (bouttom < 100) {
          state.page += 1;
          state.info = true;
          _Scroll_get_data();
        }
      }, 1000);
    };
    const Price_Range = () => {
      if (state.input1 === "" && state.input2 === "") {
        message.error("请输入正确的价格");
        return;
      }
      _get_data();
    };
    return {
      ...toRefs(state),
      handesort_item,
      Price_Range,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.commodity_warp {
  width: 100%;
  margin-top: 60px;
  .limit {
    width: 1200px;
    margin: 0 auto;
    .commodity_desc {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      cursor: pointer;
      .icon {
        background-color: $cf;
        box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99;
        .icons {
          font-size: 20px;
        }
      }
    }
    .commodity_contnet_limit {
      min-height: 885px;
    }
    .commodity_contnet {
      // min-height: 885px;
      display: flex;
      // align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      border-left: 1px solid $xt;
      border-top: 1px solid $xt;
      margin-top: 30px;
      background-color: $cf;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      position: relative;
      padding-bottom: 40px;
      .commodity_item_no {
        width: 100%;
        height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .commodity_item_no_desc {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
          color: $cc;
        }
        // background: url('https://www.dcmaomi.com:3000/serverImage/dsr1546asd.png') no-repeat  center;
      }
      .desc {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: $main-col;
        user-select: none;
        border: 1px solid $xt;
        border-top: none;
      }
      .commodity_item:hover {
        box-shadow: 0 0px 4px rgba(6, 11, 31, 0.3) inset;
      }
      .commodity_item {
        width: 25%;
        height: 422px;
        padding: 10px 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        // border-left: 1px solid $xt;
        border-right: 1px solid $xt;
        border-bottom: 1px solid $xt;
        transition: all 0.3s ease-in-out;
        position: relative;
        .home_list_img {
          width: 50%;
          height: 422px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .commodity_top {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      .commodity_top_left,
      .commodity_top_right {
        display: flex;
        align-items: center;
      }
      .commodity_top_right {
        width: 400px;
        margin: 0 10px;
      }
      .commodity_top_left {
        .sort_item {
          margin: 0 6px;
          user-select: none;
          cursor: pointer;
        }
        .active {
          color: #ff9344;
        }
      }
    }
  }
}
</style>
