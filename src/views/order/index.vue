<template>
  <div class="order_warp">
    <div class="limit">
      <a-tabs v-model:activeKey="idx" @change="handeltabschange">
        <a-tab-pane key="0">
          <template #tab>
            <span>
              <i class="iconfont">&#xe7a2;</i>
              待付款
            </span>
          </template>
          <my-order-info
            :order="order"
            :idx="idx"
            :AllDataNum="allData"
            @UpDAata="initOrder"
            @PageChange="PageChange"
            @SizeChange="SizeChange"
          ></my-order-info>
        </a-tab-pane>
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <i class="iconfont">&#xe68e;</i>
              待收货
            </span>
          </template>
          <my-order-info
            :order="order"
            :idx="idx"
            :AllDataNum="allData"
            @UpDAata="initOrder"
            @PageChange="PageChange"
            @SizeChange="SizeChange"
          ></my-order-info>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <i class="iconfont">&#xe61b;</i>
              已收货
            </span>
          </template>
          <my-order-info
            :order="order"
            :idx="idx"
            :AllDataNum="allData"
            @UpDAata="initOrder"
            @PageChange="PageChange"
            @SizeChange="SizeChange"
          ></my-order-info>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>
            <span>
              <i class="iconfont"> &#xe61a;</i>
              已失效
            </span>
          </template>
          <my-order-info
            :order="order"
            :idx="idx"
            :AllDataNum="allData"
            @UpDAata="initOrder"
            @PageChange="PageChange"
            @SizeChange="SizeChange"
          ></my-order-info>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import MyOrderInfo from "@/components/my_order_Info/index.vue";
export default {
  components: { MyOrderInfo },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      order: [],
      idx: "0",
      page: 1,
      size: 10,
      allData: 0,
    });
    onMounted(() => {
      initOrder();
      if (route.query.active !== undefined) {
        if (Number(route.query.active) >= 4) {
          state.idx = "3";
        } else if (Number(route.query.active) <= 0) {
          state.idx = "0";
        } else {
          state.idx = route.query.active;
        }
      }
    });

    const initOrder = async () => {
      let uid = store.state.userInfo.uid;
      const res = await proxy.$http.post("/api/getScrollOrder", {
        uid,
        page: state.page,
        size: state.size,
        idx: state.idx,
      });
      if (res.data.success === true) {
        res.data.data.forEach((item) => {
          item.time = proxy.$dayjs(item.time).format("YYYY-MM-DD HH:mm:ss");
        });
        state.order = res.data.data;
        state.allData = res.data.allData;
      } else {
        message.error("获取订单失败");
      }
    };
    const handeltabschange = (e) => {
      state.page = 1;
      initOrder();
    };
    const PageChange = (x) => {
      state.page = x;
      initOrder();
    };
    const SizeChange = (x) => {
      state.size = x;
      initOrder();
    };
    return {
      ...toRefs(state),
      initOrder,
      handeltabschange,
      PageChange,
      SizeChange,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.order_warp {
  width: 100%;
  height: 700px;

  .limit {
    width: 100%;
    height: 100%;
    .iconfont {
      font-size: 22px;
      margin: 0 5px;
      position: relative;
      top: 2px;
    }
  }
}
</style>
