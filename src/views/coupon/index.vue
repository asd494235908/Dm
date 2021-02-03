<template>
  <div class="warp">
    <img src="https://s1.ax1x.com/2020/11/08/BIcwLT.png" alt="" />
    <div class="text">暂无优惠券哦</div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  setup() {
    const state = reactive({
      count: 0,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.warp {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .img {
    width: 25%;
    height: 820px;
    background-size: cover;
  }
  .text {
    margin-top: 60px;
    font-size: 20px;
    font-weight: bold;
    color: rgb(196, 196, 196);
  }
}
</style>
