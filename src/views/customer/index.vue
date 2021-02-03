<template>
  <div class="warp">
    <img src="https://s1.ax1x.com/2020/11/08/BI2Zvt.png" class="img" />
    <div class="text-warp">
      <div class="text">
        <text>邮箱：</text>
        <text :selectable="true">asd494235908@qq.com</text>
      </div>
      <div class="text">
        <text>企鹅：</text>
        <text :selectable="true">494235908</text>
      </div>
      <div class="text">
        <text>微信：</text>
        <text :selectable="true">dc494235908</text>
      </div>
    </div>
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
    width: 380px;
    height: 451px;
    background-size: cover;
    object-fit: cover;
    margin-bottom: 10px;
  }
  .text {
    margin-top: 60rpx;
    font-size: 22px;
    color: #999;
  }
}
</style>
