<template>
  <div class="home_warp">
    <div class="limit">
      <div class="home_itme" v-for="(item, index) in limiData" :key="'limiData' + index">
        <div v-if="item.sort === 1">
          <div class="home_list">
            <div class="img_warp" v-for="(o, j) in item.list" :key="'home_list' + j">
              <router-link :to="'/commodity?link=' + o.hot_link">
                <img v-lazy="{ src: o.img }" alt="" />
                <div class="img_warp_link"></div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="item.sort !== 1 && item.sort !== 4">
          <div class="home_list">
            <my-titel :title="item.activity">
              <template v-slot:content>
                <div class="home_list_img" v-if="item.hot_img">
                  <img
                    v-lazy="{ src: item.hot_img }"
                    :key="'home_list_img' + item.id"
                    alt=""
                  />
                </div>
                <good-item
                  v-for="(o, j) in item.list"
                  :key="'home_list' + j"
                  :good_data="o"
                  class="home_list_item"
                ></good-item> </template
            ></my-titel>
          </div>
        </div>
        <div v-if="item.sort === 4">
          <div class="home_list">
            <div class="img_warp" v-for="(o, j) in item.list" :key="'home_list' + j">
              <img v-lazy="{ src: o.img }" alt="" />
              <div class="img_warp_link"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import MyTitel from "@/components/my_titel/index.vue";
import GoodItem from "@/components/good_Item/index.vue";
export default {
  props: {
    home_data: {
      type: Array,
      default: [],
    },
  },
  components: {
    MyTitel,
    GoodItem,
  },
  setup(props) {
    const state = reactive({});
    const limiData = computed(() => {
      return props.home_data;
    });
    return {
      ...toRefs(state),
      limiData,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.home_warp {
  width: 100%;
  margin-top: 60px;

  .limit {
    width: 1200px;
    margin: 0 auto;

    .home_list {
      display: flex;
      overflow: hidden;
      border-radius: 4px;
      margin-top: 60px;
      box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
      background-color: $cf;
      .home_list_item:hover {
        box-shadow: 0 0px 21px rgba(6, 11, 31, 0.2) inset;
      }
      .home_list_item {
        width: 25%;
        height: 422px;
        padding: 10px 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        // border-left: 1px solid $xt;
        border-right: 1px solid $xt;
        border-bottom: 1px solid $xt;
        transition: all 0.3s ease-in-out;
        position: relative;
        // overflow: hidden;
      }
      .home_list_img {
        width: 50%;
        height: 422px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .img_warp {
        width: 25%;
        height: 197px;
        position: relative;
        .img_warp_link:hover {
          box-shadow: 0 0px 20px rgba(0, 0, 0, 0.2) inset;
        }
        .img_warp_link {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transition: all 0.3s ease-in-out;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    // background-color: red;
  }
}
</style>
