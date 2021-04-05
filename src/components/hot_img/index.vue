<template>
  <div>
    <img v-lazy="{ src: img }" :class="{ imgsucc: isimg, loding: !isimg }" alt="" />
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
    // const lazyOptions = reactive({
    //   src: props.img,
    //   lifecycle: {
    //     loading: () => {
    //       nextTick(() => {
    //         state.isimg = true;
    //       });
    //     },
    //     error: () => {
    //       state.isimg = false;
    //     },
    //     loaded: () => {},
    //   },
    // });

    const Img = new Promise((resolve, reject) => {
      const lodingimg = new Image();
      lodingimg.src = props.img;
      lodingimg.onload = () => {
        resolve(props.img);
      };
      lodingimg.onerror = () => {
        reject(new Error(props.img + "失败"));
      };
    });
    Img.then(() => {
      state.isimg = true;
    //   console.log("加载成功");
    }).catch(() => {
      state.isimg = false;
    //   console.log("加载失败");
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.loding {
  width: 160px;
  height: 160px;
  object-fit: cover;
  transition: all .3 ease-in-out;
}
.imgsucc {
  width: 300px;
  height: 197px;
}
</style>
