<template>
  <div class="content-warp">
    <div class="content-titel">
      <h2>{{ titel }}</h2>
      <slot name="laer"></slot>
    </div>
    <div class="content-box">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from "vue";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const state = reactive({
      count: 0,
    });
    const titel = computed(() => {
      return props.title;
    });
    return {
      ...toRefs(state),
      titel
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/theme.scss';
.content-warp{
    width: 100%;
    .content-titel{
      width: 100%;
      height: 60px;
      cursor: pointer;
      // background: linear-gradient(#fbfbfb,#ececec);
      // border-radius: 8px 8px 0 0;
      // box-shadow: 0 1px 7px rgba(0,0,0,.1);
      padding:0 20px;
      color: $c6;
      border-bottom: 1px solid rgba(0,0,0,.05);
      line-height: 60px;
      position: relative;
      z-index: 30;
      display: flex;
      justify-content: space-between;
    }
    .content-titel h2{
        font-size: 18px;
        font-weight: bold;
        color: $main-col;
    }
    .content-box{
      width: 100%;
    //   border-radius: 0 0 4px 4px;
      z-index: 999;
      display: flex;
      flex-wrap: wrap;
      // position: relative;
    }
}</style>
