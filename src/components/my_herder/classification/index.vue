<template>
  <div>
    <div class="class_warp" :class="{ class_warp_active: nav_Show }">
      <div class="limit">
        <div>
          <ul class="class_box" @mouseout="outStyle">
            <li
              class="class_item"
              v-for="(item, index) in class_arr"
              :key="'link' + index"
              @mouseover="selectStyle(index)"
            >
              <span
                ><router-link :to="'/commodity?link='+item.name" > {{ item.name }}</router-link></span
              ><span class="letter" v-if="index !== class_arr.length - 1">·</span>
            </li>
          </ul>
        </div>
        <div class="user" :class="{ user_active: nav_Show }">
          <user
            difal_userX="88"
            difal_goodX="88"
            change_userX="118"
            change_goodX="118"
            difal_top="61"
          ></user>
        </div>
      </div>

      <div
        class="class_mask"
        :style="{ height: hight + 'px' }"
        @mouseover="selectStyle"
        @mouseout="outStyle"
      >
        <div class="mask_limit">
          <ul class="class_item" v-for="(item, index) in ul_Arr" :key="'class' + index">
            <li class="titel">{{ item.list_name }}</li>
            <li class="class_list" v-for="(o, j) in item.dtail_list" :key="o.name + j">
              <img v-lazy="{ src: o.img }" alt="" />

              <router-link :to="'/commodity?link='+o.search"><p>{{ o.name }}</p></router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div style="height: 60px; width: 100%; background-color: #fff" v-if="nav_Show"></div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import user from "@/components/my_herder/user/index.vue";
import { useStore } from "vuex";
export default {
  components: {
    user,
  },
  setup(props) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      isMask: false,
      nav_index: 0,
      ul_Arr: [],
    });
    const nav_Data = reactive({
      data: [],
    });
    onMounted(() => {
      get_Nav_Data();
    });
    const get_Nav_Data = async () => {
      const res = await proxy.$http.get("/api/navData");
      if (res.data.success === true) {
        nav_Data.data = res.data.data;
      }
    };
    const nav_Show = computed(() => {
      return store.state.nav_Show ? true : false;
    });
    const class_arr = computed(() => {
      return nav_Data.data;
    });
    const index_Arr = computed(() => {
      return class_arr.value[state.nav_index];
    });
    const ul_Arr = computed(() => {
      if (index_Arr.value === undefined) {
        return [];
      } else {
        return index_Arr.value.list;
      }
    });
    const hight = computed(() => {
      if (state.isMask === false) {
        return 0;
      }
      let a = [];
      ul_Arr.value.forEach((x, j) => {
        a.push(x.dtail_list.length);
      });
      return Math.max(...a) * 62 + 40;
    });
    const selectStyle = (i) => {
      if (typeof i === "number") {
        state.nav_index = i;
      } else {
        state.nav_index = state.nav_index;
      }
      state.isMask = true;
    };
    const outStyle = (i) => {
      state.isMask = false;
    };

    return {
      ...toRefs(state),
      selectStyle,
      outStyle,
      class_arr,
      ul_Arr,
      hight,
      nav_Show,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.class_mask {
  position: absolute;
  width: 100%;
  background-color: $cf;
  transition: all 0.6s ease-in-out;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  .mask_limit {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-content: center;
    justify-content: space-between;

    .class_item {
      width: 200px;
      margin-top: 10px;
      .titel {
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
      .class_list:hover img {
        box-shadow: 0 1px 4px rgba($color: #ff9344, $alpha: 0.4);
      }
      .class_list {
        display: flex;
        align-items: center;
        margin: 20px;
        cursor: pointer;
        a{
          color: $c6;
        }
        img {
          width: 40px;
          height: 40px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }
        // img:hover {
        //   box-shadow: 0 1px 4px rgba($color: #ff9344, $alpha: 0.4);
        // }
        p {
          font-size: 15px;
          margin-left: 12px !important;
        }
        p:hover {
          color: #ff9344;
        }
      }
    }
  }
}
.class_mask_active {
  height: 420px;
}

.class_warp {
  width: 100%;
  height: 60px;
  background-color: $cf;
  // border-bottom: 1px solid $xt;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 98;
  position: relative;
  .limit {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-content: center;
    justify-content: space-between;
    .user {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 98;
      transform: scale(0);
      opacity: 0;
      transition: all 0.3s ease-in-out;
    }
    .user_active {
      transform: scale(1);
      opacity: 1;
    }
    .class_box {
      width: 100%;
      height: 100%;
      display: flex;
      padding: 0 10px;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      .class_item {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        a {
          color: $c9;
        }
        a:hover {
          color: $main-col;
        }
        .letter {
          margin: 0 8px;
        }
      }
    }
  }
}
.class_warp_active {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
