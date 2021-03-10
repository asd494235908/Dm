<template>
  <div class="swiper_warp">
    <div class="limit">
      <a-carousel
        arrows
        easing="ease-in-out"
        autoplay
        pauseOnHover
        :autoplaySpeed="4000"
        draggable
        infinite
        useCSS
        style="
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        "
      >
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; zindex: 1">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px">
            <right-circle-outlined />
          </div>
        </template>
        <div
          class="swiper"
          v-for="(item, index) in swiper_data"
          :key="'swiper' + index"
          @click="handelSwiper(item)"
        >
          <img class="swiper_img" :src="item.img_url" alt="" />
        </div>
      </a-carousel>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
export default {
  props: {
    swiper_data: {
      type: Array,
    },
  },
  components: {
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  setup(props) {
    const router = useRouter();
    const state = reactive({
      cunter: 0,
    });
    const handelSwiper = (item) => {
      if (item.link &&item.link!=='null') {
        router.push({
          path: "/GoodInfo",
          query: {
            spec_id: item.link,
            idx: 0,
          },
        });
      } else {
        router.push({
        path: "/commodity",
        query: {
          link: item.alt,
        },
      });
      }
    };
    return {
      ...toRefs(state),
      handelSwiper,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.swiper {
  .swiper_img {
    width: 100%;
    height: 100%;
  }
}

.swiper_warp {
  width: 100%;
  z-index: 98;
  .limit {
    width: 1200px;
    height: 100%;
    margin: 40px auto 0;
  }
}
/* For demo */
.ant-carousel ::v-deep(.slick-slide) {
  text-align: center;
  height: 545px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel ::v-deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  opacity: 0.3;
  z-index: 99;
}
.ant-carousel ::v-deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel ::v-deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel ::v-deep(.slick-slide h3) {
  color: #fff;
}
</style>
