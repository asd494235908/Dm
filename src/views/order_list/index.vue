<template>
  <div class="orderList_warp">
    <my-herder></my-herder>
    <div class="limit">
      <div class="orderList_content">
        <my-order-list :order_item="roder_data"></my-order-list>
      </div>
    </div>
    <Top></Top>
    <PageBottom></PageBottom>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import MyHerder from "@/components/my_herder/herder.vue";
import MyOrderList from "@/components/my_order_list/index.vue";
import Top from "@/components/go_top/index.vue";
import PageBottom from "@/components/page_bottom/index.vue";
export default {
  components: {
    MyHerder,
    MyOrderList,
    Top,
    PageBottom
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      order_id: 0,
      roder_data: {},
    });
    onMounted(() => {
      if (route.query.order_id !== undefined && route.query.order_id !== "") {
        state.order_id = Number(route.query.order_id);
      } else {
        _back();
      }
      initData();
    });
    //返回上一页
    const _back = () => {
      setTimeout(() => {
        router.go(-1);
      }, 2000);
      message.error("参数错误，即将返���上一页");
    };
    const initData = async () => {
      let uid = store.state.userInfo.uid;
      const res = await proxy.$http.post("/api/getOrder", {
        uid,
        order_id: state.order_id,
      });
      if (res.data.success === true) {
        res.data.data.forEach((item) => {
          item.time = proxy.$dayjs(item.time).format("YYYY-MM-DD HH:mm:ss");
          if (item.type !== 0) {
            item.play_time = proxy.$dayjs(item.play_time).format("YYYY-MM-DD HH:mm:ss");
            item.play_callback_time = proxy
              .$dayjs(item.play_callback_time)
              .format("YYYY-MM-DD HH:mm:ss");
          }
        });
        state.roder_data = res.data.data[0];
      } else {
        message.error("获取订单失败");
      }
    };
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.orderList_warp {
  width: 100%;
}
.limit {
  width: 1200px;
  margin: 0 auto;
  .orderList_content {
    margin-top: 60px;
    border-radius: 4px;
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>
