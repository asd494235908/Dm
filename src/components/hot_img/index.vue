<template>
  <div>
    <img
      v-lazy="{ src: img, lifecycle: lazyOptions.lifecycle }"
      :class="{ imgsucc: isimg, loding: !isimg }"
      alt=""
    />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  props: {
    img: {
      type: String,
    },
  },
  setup(props) {
    const state = reactive({
      isimg: false,
    });
    // console.log(props.img);
    const lazyOptions = reactive({
      src: '',
      lifecycle: {
        loading: () => {
          state.isimg = true;
        },
        error: () => {
          state.isimg = false;
        },
        loaded: () => {
        },
      },
    });
    return {
      ...toRefs(state),
      lazyOptions,
    };
  },
};
</script>

<style lang="scss" scoped>
.loding {
  width: 160px;
  height: 160px;
  object-fit: cover;
}
.imgsucc {
    width: 300px;
    height: 197px;
}
</style>
