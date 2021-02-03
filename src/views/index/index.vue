<template>
  <div>
    <div class="loading" v-if="handelload">
      <a-spin :spinning="handelload" size="large"  tip="加载中..."></a-spin
      >
    </div>
    <MyHerder></MyHerder>
    <swiper :swiper_data="swiper"></swiper>
    <home :home_data="homeData"></home>
    <Top></Top>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted, computed, nextTick } from "vue";
import { useStore } from "vuex";

import MyHerder from "@/components/my_herder/herder.vue";
import swiper from "@/components/swiper/index.vue";
import home from "@/views/home/home.vue";
import Top from "@/components/go_top/index.vue";
import PageBottom from "@/components/page_bottom/index.vue";
export default {
  components: {
    MyHerder,
    swiper,
    home,
    Top,
    PageBottom,
  },
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      count: 0,
      swiper: [],
      homeData: [],
    });
    onMounted(() => {
      initData();
    });
    const handelload = computed(() => {
      return store.state.isload;
    });
    const initData = async () => {
      store.commit("changeLoad", true);
      const res = await proxy.$http.get("/api/home");
      if (res.data.success === true) {
        state.swiper = res.data.data.swiper;
        state.homeData = res.data.data.hot;
        nextTick(()=>{
          store.commit("changeLoad", false);
        })
      }
    };
    return {
      ...toRefs(state),
      handelload,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.loading {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: $cf;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
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
</style>
