<template>
  <div
    class="mask_warp"
    :class="{ isMsk_active: visible }"
    @touchmove.stop.prevent="() => {}"
    @mousewheel.prevent="navTopSwitch"
    @mousemove="handelmousemove"
    @mouseup="handelmouseup"
  >
    <div class="mask_content">
      <div class="mask_Img">
        <img
          @mousedown.self="handelmousedown"
          @mouseup="handelmouseup"
          ondragstart="return false"
          :src="Mask_Index_Img"
          :class="{ active: styleproportion }"
          alt=""
          :style="{
            marginLeft: x + 'px',
            marginTop: y + 'px',
            transform: `scale(${sole}) rotate(${deg}deg)`,
            transition: `${isMove ? '' : 'nome'}`,
          }"
        />
      </div>
      <div class="mask_left" @click="upImg">
        <svg
          class="svg_icon"
          data-icon="left"
          width="100%"
          height="100%"
          fill="currentColor"
          aria-hidden="true"
          viewBox="64 64 896 896"
          focusable="false"
        >
          <path
            d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
          ></path>
        </svg>
      </div>
      <div class="mask_right" @click="nextImg">
        <svg
          class="svg_icon"
          data-icon="right"
          width="100%"
          height="100%"
          fill="currentColor"
          aria-hidden="true"
          viewBox="64 64 896 896"
          focusable="false"
        >
          <path
            d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
          ></path>
        </svg>
      </div>
      <div class="mask_close" @click="close">
        <svg
          class="svg_icon"
          data-icon="close"
          width="100%"
          height="100%"
          fill="currentColor"
          aria-hidden="true"
          viewBox="64 64 896 896"
          focusable="false"
        >
          <path
            d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
          ></path>
        </svg>
      </div>
      <div class="mask_icons">
        <div class="xuanzhuan_right" @click="initStyle">
          <svg
            class="svg_icon"
            data-icon="sync"
            width="100%"
            height="100"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            focusable="false"
          >
            <path
              d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z"
            ></path>
          </svg>
        </div>
        <div class="fangda" @click="zoomin">
          <svg
            class="svg_icon"
            data-icon="zoom-in"
            width="100%"
            height="100%"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            focusable="false"
          >
            <path
              d="M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"
            ></path>
          </svg>
        </div>
        <div class="suoxiao" @click="zoomout">
          <svg
            class="svg_icon"
            data-icon="zoom-out"
            width="100%"
            height="100%"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            focusable="false"
          >
            <path
              d="M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"
            ></path>
          </svg>
        </div>
        <div class="dengjianju" @click="proportion">
          <svg
            v-if="styleproportion"
            class="svg_icon"
            data-icon="fullscreen"
            width="100%"
            height="100%"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            focusable="false"
          >
            <path
              d="M290 236.4l43.9-43.9a8.01 8.01 0 00-4.7-13.6L169 160c-5.1-.6-9.5 3.7-8.9 8.9L179 329.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L370 423.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L290 236.4zm352.7 187.3c3.1 3.1 8.2 3.1 11.3 0l133.7-133.6 43.7 43.7a8.01 8.01 0 0013.6-4.7L863.9 169c.6-5.1-3.7-9.5-8.9-8.9L694.8 179c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L600.3 370a8.03 8.03 0 000 11.3l42.4 42.4zM845 694.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L654 600.3a8.03 8.03 0 00-11.3 0l-42.4 42.3a8.03 8.03 0 000 11.3L734 787.6l-43.9 43.9a8.01 8.01 0 004.7 13.6L855 864c5.1.6 9.5-3.7 8.9-8.9L845 694.9zm-463.7-94.6a8.03 8.03 0 00-11.3 0L236.3 733.9l-43.7-43.7a8.01 8.01 0 00-13.6 4.7L160.1 855c-.6 5.1 3.7 9.5 8.9 8.9L329.2 845c6.6-.8 9.4-8.9 4.7-13.6L290 787.6 423.7 654c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.4z"
            ></path>
          </svg>
          <svg
            v-if="!styleproportion"
            class="svg_icon"
            data-icon="fullscreen-exit"
            width="100%"
            height="100%"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            focusable="false"
          >
            <path
              d="M391 240.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3a8.03 8.03 0 00-11.3 0l-42.4 42.3a8.03 8.03 0 000 11.3L280 333.6l-43.9 43.9a8.01 8.01 0 004.7 13.6L401 410c5.1.6 9.5-3.7 8.9-8.9L391 240.9zm10.1 373.2L240.8 633c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824a8.03 8.03 0 000 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7A8.01 8.01 0 00391 783l18.9-160.1c.6-5.1-3.7-9.4-8.8-8.8zm221.8-204.2L783.2 391c6.6-.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3a8.03 8.03 0 00-11.3 0L690.3 279.9l-43.7-43.7a8.01 8.01 0 00-13.6 4.7L614.1 401c-.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9a8.01 8.01 0 00-4.7-13.6L623 614c-5.1-.6-9.5 3.7-8.9 8.9L633 783.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z"
            ></path>
          </svg>
        </div>
        <div class="xuanzhuan_left" @click="refresh_left">
          <svg
            class="svg_icon"
            data-icon="undo"
            width="100%"
            height="100%"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            focusable="false"
          >
            <path
              d="M511.4 124C290.5 124.3 112 303 112 523.9c0 128 60.2 242 153.8 315.2l-37.5 48c-4.1 5.3-.3 13 6.3 12.9l167-.8c5.2 0 9-4.9 7.7-9.9L369.8 727a8 8 0 00-14.1-3L315 776.1c-10.2-8-20-16.7-29.3-26a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-7.5 7.5-15.3 14.5-23.4 21.2a7.93 7.93 0 00-1.2 11.1l39.4 50.5c2.8 3.5 7.9 4.1 11.4 1.3C854.5 760.8 912 649.1 912 523.9c0-221.1-179.4-400.2-400.6-399.9z"
            ></path>
          </svg>
        </div>
        <div class="xuanzhuan_right" @click="refresh_right">
          <svg
            class="svg_icon"
            data-icon="redo"
            width="100%"
            height="100%"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            focusable="false"
          >
            <path
              d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"
            ></path>
          </svg>
        </div>
      </div>
      <div class="num">{{ index + 1 }}/{{ Img_Arr.length }}</div>
    </div>
  </div>
</template>

<script>
import { computed, nextTick, reactive, toRefs, onMounted, onUnmounted, watch } from "vue";
import { ColSize } from "ant-design-vue/lib/grid/Col";

export default {
  /**
   * @img_first第一张的回调
   *@img_end最后一张的回调
   *@img_close点击关闭的回调
   * **/
  props: {
    //是否显示
    visible: {
      type: Boolean,
      default: false,
    },
    //图片的数组
    Img_Arr: {
      type: Array,
      default: [],
    },
    //当前显示的图片
    Img_Index: {
      type: Number,
      default: 0,
    },
    //限制缩放最小
    letter_Scale: {
      type: Number,
      default: 0.1,
    },
    //限制缩放最大
    max_Scale: {
      type: Number,
      default: 6,
    },
  },
  setup(props, context) {
    const state = reactive({
      deg: 0,
      isMove: true,
      sole: 1,
      isclick: false,
      window_width: 0,
      window_height: 0,
      styleproportion: true,
      handel: {
        x: 0,
        y: 0,
      },
      move: {
        x: 0,
        y: 0,
      },
      julu: {
        x: 0,
        y: 0,
      },
      x: 0,
      y: 0,
      timer: null,
      index: 0,
      SwitchTimer: null,
    });
    watch(
      () => {
        return props.Img_Index;
      },
      (value, oldValue) => {
        state.index = value;
      }
    );
    onMounted(() => {
      Indexsize();
      state.index = props.Img_Index;
      window.addEventListener("resize", Indexsize);
    });
    onUnmounted(() => {
      document.removeEventListener("resize", Indexsize);
    });
    const Arr = computed(() => {
      return props.Img_Arr;
    });
    const Mask_Index_Img = computed(() => {
      if (Arr.value !== 0) {
        return Arr.value[state.index];
        // return 'https://resource.smartisan.com/resource/4bd77ab92a480926b5567df61529b9f3.png'
      } else {
        return "";
      }
    });
    //监听窗口变化
    const Indexsize = () => {
      state.isMove = false;
      state.window_width =
        document.documentElement.clientWidth || document.body.clientWidth;
      state.window_height =
        document.documentElement.clientHeight || document.body.clientHeight;
    };
    //滚轮事件
    const navTopSwitch = (e) => {
      clearTimeout(state.SwitchTimer);
      state.SwitchTimer = setTimeout(() => {
        if (e.wheelDelta > -120) {
          zoomin();
        } else {
          zoomout();
        }
      }, 50);
    };

    //上一张
    const upImg = () => {
      state.isMove = false;
      state.index -= 1;
      state.index = state.index == -1 ? props.Img_Arr.length - 1 : state.index;
      initStyle();
      if (props.Img_Arr.length === 1) return;
      if (state.index === 0) {
        context.emit("img_first");
      }
      if (state.index === props.Img_Arr.length - 1) {
        context.emit("img_end");
      }
    };
    //下一张
    const nextImg = () => {
      state.isMove = false;
      state.index += 1;
      state.index = state.index > props.Img_Arr.length - 1 ? 0 : state.index;
      initStyle();
      if (props.Img_Arr.length === 1) return;
      if (state.index === 0) {
        context.emit("img_first");
      }
      if (state.index === props.Img_Arr.length - 1) {
        context.emit("img_end");
      }
    };
    //点击关闭按钮
    const close = () => {
      initStyle();
      context.emit("img_close");
    };
    //初始化图片样式
    const initStyle = () => {
      state.x = 0;
      state.y = 0;
      state.sole = 1;
      state.deg = 0;
    };
    //鼠标按下
    const handelmousedown = (e) => {
      state.isclick = true;
      state.handel.x = e.clientX;
      state.handel.y = e.clientY;
    };
    //鼠标移动
    const handelmousemove = (e) => {
      if (!state.isclick) return;

      if (
        e.pageX < state.window_width - 10 &&
        e.pageX > 10 &&
        e.pageY < state.window_height - 10 &&
        e.pageY > 10
      ) {
        state.isMove = false;
        state.move.x = e.pageX;
        state.move.y = e.pageY;
        state.x = state.move.x - state.handel.x + state.julu.x;
        state.y = state.move.y - state.handel.y + state.julu.y;
      } else {
        handelmouseup();
        return;
      }
    };
    //鼠标抬起
    const handelmouseup = () => {
      state.julu.x = state.x;
      state.julu.y = state.y;
      state.isclick = false;
      state.isMove = true;
    };
    //限制图片在屏幕之内
    const proportion = () => {
      state.styleproportion = !state.styleproportion;
    };
    //向左转动
    const refresh_left = () => {
      state.deg -= 90;
    };
    //向右转动
    const refresh_right = () => {
      state.deg += 90;
    };
    //缩小
    const zoomout = () => {
      state.sole -= 0.2;
      state.sole = state.sole < props.letter_Scale ? 1 : state.sole;
    };
    //f放大
    const zoomin = () => {
      state.sole += 0.2;
      state.sole = state.sole > props.max_Scale ? 1 : state.sole;
    };
    return {
      ...toRefs(state),
      Mask_Index_Img,
      navTopSwitch,
      handelmousedown,
      handelmousemove,
      handelmouseup,
      proportion,
      refresh_left,
      refresh_right,
      zoomout,
      zoomin,
      upImg,
      nextImg,
      close,
      initStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.svg_icon {
  color: #fff;
}
.active {
  max-height: 100vh;
}
.mask_warp {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 0px;
  height: 0px;
  background-color: rgba($color: #000000, $alpha: 0.5);
  z-index: 999;
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  .mask_content {
    width: 100%;
    height: 100%;
    min-height: 400px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .num {
    position: absolute;
    top: 20px;
    width: 100px;
    background-color: rgba($color: #000000, $alpha: 0.5);
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fff;
    user-select: none;
  }
  .mask_left,
  .mask_right,
  .mask_close {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: rgba($color: #000000, $alpha: 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 30px;
      cursor: pointer;
    }
  }
  .mask_left {
    right: 0;
    transform: translate(-100%, -100%);
    svg {
      position: relative;
      left: -2px;
    }
  }
  .mask_right {
    right: 0;
    transform: translate(-100%, 100%);
    svg {
      position: relative;
      left: 1px;
    }
  }
  .mask_close {
    right: 0;
    top: 20px;
    transform: translate(-100%, 0);
  }
}
.mask_icons {
  position: absolute;
  width: 350px;
  height: 50px;
  bottom: 20px;
  background-color: rgba($color: #000000, $alpha: 0.5);
  border-radius: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  div {
    display: flex;
    align-items: center;
    svg {
      width: 30px;
      cursor: pointer;
    }
  }
}
.mask_Img {
  user-select: none;
  img {
    display: inline-block;
    transition: all 0.3s ease-in-out;
    cursor: grab;
  }
}
.isMsk_active {
  width: 100%;
  height: 100%;
}
</style>
