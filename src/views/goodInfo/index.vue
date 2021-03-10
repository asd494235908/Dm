<template>
  <div>
    <my-herder />
    <div class="good_warp">
      <div class="limit">
        <div class="good_top">
          <div class="good_top_left">
            <ul class="imgs_warp">
              <li
                class="img_warp"
                v-for="(item, index) in imgs"
                :key="'img' + index"
                @click="handel_index_Img(index)"
                v-show="item !== '' && item !== 'null' && item !== 'NULL'"
              >
                <img
                  v-lazy="{ src: item }"
                  alt=""
                  class="img"
                  :key="item"
                />
              </li>
              <li class="img_warp_active" :style="{ top: active_top + 'px' }"></li>
            </ul>
          </div>
          <div class="good_top_midil">
            <div class="good_top_midil_img">
              <img
                :ref="desc_img"
                v-lazy="{ src: img_More }"
                :key="img_More + 'desc_img'"
                alt=""
                class="midil_img one"
                @click="img_Aarr"
              />
              <img v-lazy="{ src: img_More }" :key="img_More" alt="" class="midil_img" />
            </div>
          </div>
          <div class="good_top_right">
            <div class="titel">
              <span class="ellipsis">{{ index_good.spu_title }}</span>
            </div>

            <div class="titel_desc">
              <span class="ellipsis"> {{ goodData.spu_sub_title }}</span>
            </div>
            <!-- 商品款式开始 -->
            <div class="desc">
              <span>商品款式：</span>
            </div>
            <div class="god_dstyle">
              <div
                class="good_style_item"
                v-for="(item, index) in goodData.list"
                :key="'god_dstyle' + index"
                :class="{ good_style_item_active: index === idx }"
                @click="chanheStyle(index)"
              >
                {{ item.show_name }}
              </div>
            </div>
            <!-- 商品款式结束 -->
            <div
              class="fixt"
              v-if="
                goodData.spu_sub_title_hover !== 'null' &&
                goodData.spu_sub_title_hover !== null
              "
            >
              <span>{{ goodData.spu_sub_title_hover }}</span>
            </div>
            <!-- 商品尺寸开始 -->
            <div class="desc" v-if="index_good.size">
              <span>商品尺寸：</span>
            </div>
            <div class="size">
              <div
                class="size_item"
                v-for="(item, index) in index_good.size"
                :key="'info_size_item' + index"
                :class="{ size_item_active: index === size_index }"
                @click="changeSize(index)"
              >
                {{ item.size }}
              </div>
            </div>
            <!-- 商品尺寸结束 -->
            <!-- 商品数量开始 -->
            <div class="desc">
              <span>商品数量：</span>
            </div>
            <div class="mun">
              <a-input-number
                id="inputNumber"
                v-model:value="good_num"
                :min="1"
                :max="99"
                @change="onChange"
              />
            </div>
            <!-- 商品数量结束 -->
            <div class="price">
              <p class="new_price" v-if="isprice">
                ￥{{ Number(index_good.price).toFixed(2) }}
              </p>
              <p
                class="old_price"
                :class="{ price_active: isprice, noPrice: !isprice }"
                :ref="oldprice"
              >
                ￥{{ Number(index_good.oldprice).toFixed(2) }}
              </p>
            </div>
            <div class="addcart">
              <a-button type="primary" shape="round" size="large" @click="AddGood">
                <template #icon>加入购物车</template>
              </a-button>
            </div>
          </div>
        </div>
        <div class="good_bouttom">
          <my-titel title="商品详情">
            <template v-slot:content v-if="goodData.listImg !== undefined">
              <img
                class="good_bouttom_img"
                v-lazy="{ src: goodData.listImg.list_url }"
                alt=""
              />
            </template>
          </my-titel>
        </div>
      </div>
    </div>
    <img-mask
      :visible="img_mask"
      :Img_Arr="imgs"
      :Img_Index="img_Index"
      @img_close="isHide_Mask"
      @img_first="img_first"
      @img_end="img_end"
    ></img-mask>
    <Top></Top>
    <PageBottom></PageBottom>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
  nextTick,
  ref,
} from "vue";
import MyHerder from "@/components/my_herder/herder.vue";
import { useRoute, useRouter } from "vue-router";
import { notification, message } from "ant-design-vue";
import { useStore } from "vuex";
import { setStore, getStore } from "../../utils/storage.js";
import MyTitel from "@/components/my_titel/index.vue";
import ImgMask from "@/components/img_mask/index.vue";
import Top from "@/components/go_top/index.vue";
import PageBottom from "@/components/page_bottom/index.vue";
export default {
  components: {
    MyHerder,
    MyTitel,
    ImgMask,
    Top,
    PageBottom,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      active_top: 6,
      spec_id: 0,
      idx: 0,
      good_num: 0,
      img_Index: 0,
      size_index: 0,
      goodData: {},
      suplist_num: 1,
      timer: null,
      img_mask: false,
    });
    onMounted(() => {
      init_Data();
      get_data();
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      init_size();
    });
    //获取路由参数，获取失败返回上一页
    const init_Data = () => {
      if (
        route.query.spec_id !== undefined &&
        route.query.idx !== undefined &&
        route.query.spec_id !== "" &&
        route.query.idx !== ""
      ) {
        state.spec_id = Number(route.query.spec_id);
        state.idx = Number(route.query.idx);

        seve_history();
      } else {
        _back();
      }
    };
    //存入浏览历史
    const seve_history = () => {
      const history = {
        spec_id: state.spec_id,
        idx: state.idx,
      };
      const old_history = getStore("history");
      let new_history = JSON.parse(old_history);
      if (old_history === null || old_history === "") {
        setStore("history", [history]);
      } else {
        new_history = new_history.filter((item, index) => {
          if (item.spec_id == history.spec_id && item.idx == history.idx) {
            return;
          } else {
            return item;
          }
        });
        new_history.unshift(history);
        setStore("history", new_history);
      }
    };
    const get_data = async () => {
      const res = await proxy.$http.post("/api/getItem", {
        id: state.spec_id,
      });
      if (res.data.success === true) {
        state.goodData = res.data.data[0];
        if (route.query.difall !== undefined && route.query.difall !== "") {
          const num = Number(route.query.difall);
          state.goodData.list.forEach((element, index) => {
            if (element.id == num) {
              state.idx = index;
            }
          });
        }
      } else {
        _back();
      }
    };
    //返回上一页
    const _back = () => {
      setTimeout(() => {
        router.go(-1);
      }, 2000);
      message.error("参数错误，即将返回上一页");
    };

    //当前选中的商品
    const index_good = computed(() => {
      // const b = Object.getOwnPropertyNames(state.goodData) === 0; //判断是否为空对象
      const arr = Object.keys(state.goodData); //判断是否为空对象
      if (arr.length === 0) {
        return {};
      } else {
        let a = state.idx;
        let data = state.goodData.list;
        return data[a];
      }
    });
    const imgs = computed(() => {
      let x = state.idx;
      let img = [];
      for (let i in index_good.value) {
        if (i.indexOf("img") !== -1) {
          if (i.indexOf("show_img") !== -1) continue;
          if (index_good.value[i] !== null && index_good.value[i] !== "") {
            img.push(index_good.value[i]);
          }
        }
      }
      return img;
    });
    //当前点击图片的index
    const handel_index_Img = (index) => {
      state.img_Index = index;
      state.active_top = state.img_Index * 75 + (12 * state.img_Index + 6);
      // state.active_top = state.active_top -(state.img_Index*6)
    };
    //获取当前的大图
    const img_More = computed(() => {
      //并设置avtive的top值
      return imgs.value[state.img_Index];
    });
    //选择当前款式
    const chanheStyle = (index) => {
      state.idx = index;
      seve_history();
    };
    //是否有原价
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
    //计数器变化
    const onChange = (val) => {
      state.suplist_num = val;
    };
    //改变商品尺寸
    const changeSize = (index) => {
      state.size_index = index;
      init_size();
    };
    let oldprice_refs = "";
    const oldprice = (el) => {
      oldprice_refs = el;
    };
    const init_size = () => {
      if (index_good.value.size) {
        if (
          index_good.value.size[state.size_index].price !== 0 &&
          index_good.value.size[state.size_index].price !== null
        ) {
          nextTick(() => {
            oldprice_refs.innerText =
              "￥" + Number(index_good.value.size[state.size_index].price).toFixed(2);
          });
        }
      }
    };
    //返回添加购物车数据
    const AddGood_Data = () => {
      let good_info = {
        suplist_id: 0,
        style: "",
        name: "",
        suplist_num: state.suplist_num,
        price: 0,
        size: "",
        sup_id: 0,
        data: [index_good.value],
      };
      good_info.name = state.goodData.spu_title; //商品名称
      good_info.style = index_good.value.show_name; //商品简介
      good_info.suplist_id = index_good.value.id; //商品在数据库的id
      good_info.sup_id = state.goodData.spec_id; //商品上级id
      const isSize = index_good.value.size ? true : false; //是否有尺寸
      if (isSize) {
        //有size就取size
        good_info.size = index_good.value.size[state.size_index].size;
        //判断size的价格
        if (
          index_good.value.size[state.size_index].price === 0 ||
          index_good.value.size[state.size_index].price === null
        ) {
          //没有就获取上级的price价格
          good_info.price = index_good.value.price;
        } else {
          //有就获取price价格
          good_info.price = index_good.value.size[state.size_index].price;
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
    let refs = "";
    const desc_img = (el) => {
      refs = el;
      return el;
    };
    //返回哪个购物车显示了
    const nav_Show = computed(() => {
      return store.state.nav_Show ? true : false;
    });
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
    //图片位置
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
            refs.style.top = top - 180 + "px";
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
    const img_Aarr = () => {
      state.img_mask = true;
    };
    //关闭img组件
    const isHide_Mask = () => {
      state.img_mask = false;
    };
    //显示第一张图片时候
    const img_first = () => {
      notification["info"]({
        message: "提示",
        description: "这是第一张",
      });
    };
    const img_end = () => {
      notification["info"]({
        message: "提示",
        description: "这是最后一张",
      });
    };
    return {
      ...toRefs(state),
      index_good,
      imgs,
      img_More,
      handel_index_Img,
      onChange,
      isprice,
      chanheStyle,
      changeSize,
      oldprice,
      desc_img,
      AddGood,
      img_Aarr,
      isHide_Mask,
      img_first,
      img_end,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";

.boder_limit {
  width: 100%;
  height: 1px;
  background-color: $xt;
}
ul {
  margin: 0 !important;
}
.good_warp {
  width: 100%;
  .limit {
    width: 1200px;
    margin: 0 auto;
    .good_bouttom {
      overflow: hidden;
      border-radius: 4px;
      margin-top: 60px;
      box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
      background-color: $cf;
      .good_bouttom_img {
        width: 100%;
        height: 100%;
      }
    }
    .good_top {
      margin-top: 40px;
      padding: 0 40px;
      width: 100%;
      height: 500px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
      // border: solid $xt 1px;
      .good_top_left {
        width: 160px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .imgs_warp {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: relative;
          .img_warp {
            width: 75px;
            height: 75px;
            margin: 6px 0;
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
            .img {
              width: 100%;
              height: 100%;
            }
          }
          .img_warp_active {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            border: 2px solid $main-col;
            width: 75px;
            height: 75px;
            border-radius: 6px;
            transition: all 0.3s ease-in-out;
          }
        }
      }
      .good_top_midil {
        width: 400px;
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 40px;

        .good_top_midil_img {
          width: 400px;
          height: 400px;
          box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
          // overflow: hidden;
          border-radius: 6px;

          position: relative;
          .midil_img {
            display: inline-block !important;
            width: 100%;
            height: 100%;
            border-radius: 6px;
            cursor: pointer;
          }
          .one {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
      .good_top_right {
        // width: 400px;
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        padding-left: 30px;
        position: relative;
        // margin-left: 30px;
        .addcart {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .titel {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
          cursor: pointer;
          span {
            display: inline-block;
            width: 480px;
          }
        }
        .mun {
          width: 100%;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .fixt {
          position: absolute;
          top: 12px;
          right: 0px;
          padding: 2px 12px;
          border: 1px solid $xt;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          color: #a06e37;
          background: #fffbdf;
          border-color: #d5b480;
        }
        .titel_desc {
          font-size: 16px;
          margin-bottom: 10px;
          cursor: pointer;
          font-weight: bold;
          span {
            display: inline-block;
            width: 480px;
          }
        }
        .desc {
          font-size: 16px;
          // font-weight: bold;
          margin-bottom: 10px;
          cursor: pointer;
          span {
            display: inline-block;
            width: 480px;
          }
        }
        .price {
          width: 100%;
          padding-left: 10px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .new_price {
            font-size: 22px;
            font-weight: bold;
            color: $jcg;
            padding-right: 30px;
            cursor: pointer;
          }
          .old_price {
            font-size: 22px;
            font-weight: bold;
            cursor: pointer;
            // text-decoration: line-through;
          }
          .noPrice {
            color: $jcg;
          }
          .price_active {
            text-decoration: line-through;
          }
        }

        .size {
          display: flex;
          width: 100%;
          align-items: center;
          margin-bottom: 10px;
          .size_item {
            padding: 2px 6px;
            border: 1px solid $xt;
            margin: 0 10px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 15px;
          }
          .size_item_active {
            border-color: $main-col;
            color: $main-col;
          }
        }
        .god_dstyle {
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .good_style_item {
            padding: 2px 6px;
            border: 1px solid $xt;
            margin: 0 10px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 15px;
          }
          .good_style_item_active {
            border-color: $main-col;
            color: $main-col;
          }
        }

        // background-color: purple;
      }
    }
  }
}
</style>
