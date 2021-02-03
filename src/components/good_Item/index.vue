<template>
  <div class="good_item" v-if="index_good !== undefined">
    <!-- <router-link :to="'/GoodInfo?spec_id=' + index_good.spec_id + '&idx=' + index"> -->
    <div class="good_top" @click.stop="LinkItem">
      <img
        class="titel"
        v-lazy="index_good.img_url1"
        alt=""
        :key="index_good.img_url1 + generateUUID"
      />
      <img
        :ref="desc_img"
        class="desc"
        v-lazy="index_good.img_url1"
        alt=""
        :key="index_good.img_url1 + generateUUID"
      />
    </div>
    <div class="good_contnet">
      <h3 class="ellipsis">{{ good_data.spu_title }}</h3>
      <p class="ellipsis">{{ good_data.spu_sub_title }}</p>
    </div>
    <div class="handel_good">
      <div
        class="handel_good_item"
        v-for="(item, index) in good_data.list"
        :key="'handel_good' + index"
        v-show="good_data.list.length !== 1"
        @mouseover="handelmousemove(item, index)"
      >
        <img :src="item.show_img" alt="" :key="generateUUID" />
      </div>
    </div>
    <div class="price">
      <p class="newPrice">
        <span v-if="isprice">￥{{ Number(index_good.price).toFixed(2) }}</span>
      </p>
      <p class="oldPrice" :class="{ price_active: isprice, noPrice: !isprice }">
        <span :ref="oldprice">￥{{ Number(index_good.oldprice).toFixed(2) }}</span>
      </p>
    </div>
    <!-- </router-link> -->
    <div class="info">
      <div class="info_good" @click="AddGood">
        <svg
          t="1609759399306"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1266"
          width="200"
          height="200"
        >
          <path
            d="M347.136 783.36q19.456 0 36.864 7.168t30.72 19.968 20.48 30.208 7.168 36.864-7.168 36.864-20.48 30.208-30.72 20.48-36.864 7.68q-20.48 0-37.376-7.68t-30.208-20.48-20.48-30.208-7.168-36.864 7.168-36.864 20.48-30.208 30.208-19.968 37.376-7.168zM773.12 785.408q19.456 0 37.376 7.168t30.72 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.72 20.48-37.376 7.68-36.864-7.68-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 36.864-7.168zM945.152 203.776q28.672 0 44.544 7.68t22.528 18.944 6.144 24.064-3.584 22.016-12.8 37.888-22.016 62.976-24.064 68.096-17.92 53.248q-13.312 40.96-33.792 56.832t-50.176 15.872l-34.816 0-66.56 0-87.04 0-95.232 0-253.952 0 15.36 92.16 516.096 0q49.152 0 49.152 41.984 0 20.48-9.728 35.328t-38.4 14.848l-49.152 0-95.232 0-117.76 0-119.808 0-98.304 0-56.32 0q-20.48 0-34.304-9.216t-23.04-24.064-14.848-32.256-8.704-32.768q-1.024-6.144-5.632-29.696t-11.264-58.88-14.848-78.848-16.384-87.552q-19.456-103.424-44.032-230.4l-76.8 0q-15.36 0-25.6-7.68t-16.896-18.432-9.216-23.04-2.56-22.528q0-20.48 13.824-33.792t37.376-13.312l22.528 0 20.48 0 25.6 0 34.816 0q20.48 0 32.768 6.144t19.456 15.36 10.24 19.456 5.12 17.408q2.048 8.192 4.096 23.04t4.096 30.208q3.072 18.432 6.144 38.912l700.416 0z"
            fill="#ffac71"
            p-id="1267"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  reactive,
  toRefs,
  ref,
  nextTick,
  getCurrentInstance,
  onMounted,
  watch,
} from "vue";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default {
  props: {
    good_data: {
      type: Object,
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      index: 0,
      timer: null,
      btn: null,
    });
    onMounted(() => {
      initData();
    });
    const initData = () => {
      if (
        props.good_data.spu_defall_show !== null &&
        props.good_data.spu_defall_show !== ""
      ) {
        state.index = props.good_data.spu_defall_show;
      }
      if (index_good.value.size) {
        if (index_good.value.size[0].price !== 0) {
          nextTick(() => {
            oldprice_refs.innerText =
              "￥" + Number(index_good.value.size[0].price).toFixed(2);
          });
        }
      }
    };
    const index_good = computed(() => {
      return props.good_data.list[state.index];
    });

    const nav_Show = computed(() => {
      return store.state.nav_Show ? true : false;
    });
    //获取ref  desc_img 元素
    let refs = "";
    const desc_img = (el) => {
      refs = el;
    };
    //获取nav 元素位于屏幕的位置
    const nav_Good = () => {
      const good = document.querySelectorAll("#good");
      //判断哪个购物车显示了
      const goodIndex = nav_Show ? 1 : 0;
      const goodNode = good[goodIndex];
      //获取 top 与left
      const top = goodNode.getBoundingClientRect().top;
      const left = goodNode.getBoundingClientRect().left;
      const data = {
        top,
        left,
      };
      return data;
    };
    //获取 ref desc_img 位于屏幕的距离
    const imgNode = (dom) => {
      const top = dom.getBoundingClientRect().top;
      const left = dom.getBoundingClientRect().left;
      const data = {
        top,
        left,
      };
      return data;
    };
    //添加购物车的操作以及动画
    const AddGood = () => {
      //点解节流，等动画完成执行下一次操作
      clearTimeout(state.timer);
      state.timer = setTimeout(() => {
        //Dom的ref必须在nextTice下操作
        nextTick(() => {
          //添加动画效果
          refs.style.transition = "all .3s ease-in-out";
          let adminTion = new Promise((ru, rj) => {
            //判断动画效果是否添加
            if (refs.style.transition !== "") {
              //添加上了执行成功操作
              ru();
            } else {
              //未添加执行失败操作
              rj();
            }
          });

          //获取nav 元素位于屏幕的位置
          const nav_data = nav_Good();
          //获取 ref  位于屏幕的距离
          const img_Data = imgNode(refs);
          //移动的距离
          const top = nav_data.top - img_Data.top;
          const left = nav_data.left - img_Data.left;

          adminTion.then(() => {
            refs.style.top = top + -90 + "px";
            refs.style.left = left + "px";
            refs.style.transform = "scale(.1)";
            store.commit("changenav_Good", true);

            const data_desc = AddGood_Data(); //返回选择购物车数据
            //判断是否登录
            if (store.state.login) {
              const uid = store.state.userInfo.uid;
              UpData_Good(data_desc, uid);
            } else {
              //存入vuex
              store.commit("changeuser_cart", data_desc);
            }

            setTimeout(() => {
              refs.style.transition = "";
              refs.style.top = "";
              refs.style.left = "";
              refs.style.transform = "";
              store.commit("changenav_Good", false);
            }, 600);
          });
        });
      }, 600);
    };
    const UpData_Good = async (data, uid) => {
      const res = await proxy.$http.post("/api/GoodItem", {
        isWeb: true,
        isAdd: true,
        uid,
        data,
      });
      if (res.data.success === true) {
        update_userInfo();
      } else {
        message.error("加入失败");
      }
    };
    const update_userInfo = async () => {
      const res = await proxy.$http.post("/api/validate", {});
      const data = res.data;
      if (data.success === true) {
        store.commit("seveLogin", data.data);
      } else {
        message.error("跟新数据失败");
      }
    };
    const AddGood_Data = () => {
      let good_info = {
        suplist_id: 0,
        style: "",
        name: "",
        suplist_num: 1,
        price: 0,
        size: "",
        sup_id: 0,
        data: [index_good.value],
      };
      good_info.name = props.good_data.spu_title; //商品名称
      good_info.style = index_good.value.show_name; //商品简介
      good_info.suplist_id = index_good.value.id; //商品在数据库的id
      good_info.sup_id = props.good_data.spec_id; //商品上级id
      const isSize = index_good.value.size ? true : false; //是否有尺寸
      if (isSize) {
        //有size就取size
        good_info.size = index_good.value.size[0].size;
        //判断size的价格
        if (
          index_good.value.size[0].price === 0 ||
          index_good.value.size[0].price === null
        ) {
          //没有就获取上级的price价格
          good_info.price = index_good.value.price;
        } else {
          //有就获取price价格
          good_info.price = index_good.value.size[0].price;
        }
      } else {
        //没有size
        //判断价格现价是否有没有
        if (index_good.value.price === null || index_good.value.price === "null") {
          //没有就获取旧价格
          good_info.price = index_good.value.oldprice;
        } else {
          //没有就获取现价
          good_info.price = index_good.value.price;
        }
      }

      return good_info;
    };
    const isprice = computed(() => {
      if (
        index_good.value.price === null ||
        index_good.value.price === "" ||
        index_good.value.price === "null"
      ) {
        return false;
      } else {
        return true;
      }
    });
    let oldprice_refs = "";
    const oldprice = (el) => {
      oldprice_refs = el;
    };
    const handelmousemove = (item, index) => {
      initData();
      state.index = index;
    };
    const LinkItem = () => {
      router.push({
        path: "/GoodInfo",
        query: {
          spec_id: index_good.value.spec_id,
          idx: state.index,
        },
      });
    };
    // 生成全局唯一ID
    const generateUUID = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };
    return {
      ...toRefs(state),
      index_good,
      isprice,
      handelmousemove,
      desc_img,
      AddGood,
      oldprice,
      LinkItem,
      generateUUID,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.good_top {
  width: 100%;
  height: 144.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .desc {
    width: 50%;
    height: 100%;
    top: 0;
    left: 25%;
    display: block;
    position: absolute;
    z-index: 97;
    object-fit: cover;
  }
  .titel {
    z-index: 80;
    object-fit: cover;
  }
  img {
    width: 50%;
  }
}
.good_item:hover .info_good {
  transform: scale(1);
  opacity: 1;
}
.home_list_item:hover .info_good {
  transform: scale(1);
  opacity: 1;
}
.info {
  position: absolute;
  bottom: 10px;
  right: 20px;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .info_good {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid $xt;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0);
    opacity: 0;
    font-size: 12px;
    color: $cf;
    user-select: none;
    box-shadow: 0 0px 4px rgba(6, 11, 31, 0.2);
    transition: all 0.3s ease-in-out;
    svg {
      width: 25px;
      height: 25px;
      position: relative;
      left: -1px;
      // color: #ffac71;
    }
  }
}
.handel_good {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  .handel_good_item {
    // margin: 0 5px;
    // border: 1px solid $xt;
    // padding: 2px 5px;
    img {
      border: 2px solid $cc;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      margin: 0 10px;
    }
  }
}
.price {
  width: 100%;
  margin: 10px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
  .newPrice {
    color: $jcg;
    height: 30px;
  }
  .oldPrice {
    height: 30px;
    color: $c6;
  }
  .noPrice {
    color: $jcg;
  }
  .price_active {
    text-decoration: line-through;
  }
}

.good_contnet {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px 5px;
  color: $c9;
  h3 {
    font-size: 16px;
    font-weight: bold;
    width: 280px;
    text-align: center;
  }
  p {
    width: 280px;
    text-align: center;
  }
}
</style>
