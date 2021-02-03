<template>
  <div class="order_conttnet">
    <div class="order_item_warp">
      <div class="order_item" v-for="(item, index) in order" :key="index + 'order_item'">
        <my-order
          @updata="initOrder"
          :order_item="item"
          v-if="item.type === Number(idx)"
        ></my-order>
      </div>
      <a-config-provider :locale="locale">
        <div class="page_warp">
          <a-pagination
            size="small"
            :total="total"
            v-model:current="page"
            v-model:pageSize="size"
            :defaultPageSize="10"
            :pageSizeOptions="['10', '30', '60']"
            show-size-changer
            show-quick-jumper
            @change="pageChane"
            @showSizeChange="sizeChange"
            v-if="order.length !== 0"
          />
        </div>
      </a-config-provider>
    </div>
    <div class="no_order" v-if="order.length === 0">
      <img src="https://s1.ax1x.com/2020/11/01/Bw1LDg.png" alt="" />
      <span>当前没有订单哦</span>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from "vue";
import MyOrder from "@/components/my_order/index.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

export default {
  components: { MyOrder },
  data() {
    return {
      locale: zhCN,
    };
  },
  props: {
    order: {
      type: Array,
      default: [],
    },
    idx: {
      default: 0,
    },
    AllDataNum: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const state = reactive({
      count: 0,
      page: 1,
      size: 10,
    });
    const total = computed(() => {
      return props.AllDataNum;
    });
    const initOrder = () => {
      context.emit("UpDAata");
    };
    //页数发生变化
    const pageChane = () => {
      context.emit("PageChange", state.page);
    };
    //每页个数发生变化
    const sizeChange = () => {
      context.emit("SizeChange", state.size);
    };
    return {
      ...toRefs(state),
      initOrder,
      pageChane,
      sizeChange,
      total
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.page_warp {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px;
}
.iconfont {
  font-size: 22px;
  margin: 0 5px;
  position: relative;
  top: 2px;
}
.order_conttnet {
  width: 100%;
  height: 640px;
  overflow: auto;
}
.order_conttnet::-webkit-scrollbar-thumb:horizontal {
  /*水平滚动条的样式*/
  width: 4px;
  background-color: #cccccc;
  -webkit-border-radius: 6px;
}
.order_conttnet::-webkit-scrollbar-track-piece {
  background-color: #fff; /*滚动条的背景颜色*/
  -webkit-border-radius: 0; /*滚动条的圆角宽度*/
}
.order_conttnet::-webkit-scrollbar {
  width: 10px; /*滚动条的宽度*/
  height: 8px; /*滚动条的高度*/
}
.order_conttnet::-webkit-scrollbar-thumb:vertical {
  /*垂直滚动条的样式*/
  height: 50px;
  background-color: #999;
  -webkit-border-radius: 4px;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 2px solid #fff;
}
.order_conttnet::-webkit-scrollbar-thumb:hover {
  /*滚动条的hover样式*/
  height: 50px;
  -webkit-border-radius: 4px;
}
.no_order {
  width: 100%;
  height: 540px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    width: 300px;
    height: 300px;
  }

  span {
    font-size: 20px;
    font-weight: bold;
    color: $c9;
  }
}
</style>
