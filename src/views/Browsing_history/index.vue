<template>
  <div class="warp" :ref="top">
    <div v-if="!handelload && data.length !== 0" class="warp_items">
      <a-checkbox-group
        v-model:value="checkItems"
        @change="handelCchangeGroup"
        style="width: 100%"
      >
        <div
          v-for="(item, index) in data"
          :key="index + item.id"
          class="history_item_warp"
        >
          <div class="history_item" :class="{ showchekbox: isShowChekbox }">
            <a-checkbox :value="item.list[0].id"></a-checkbox>
          </div>
          <div class="history_info">
            <div class="history_info_img">
              <img v-lazy="{ src: item.list[0].img_url1 }" alt="" />
            </div>
          </div>
          <div class="name">
            <span class="ellipsis">商品名称：{{ item.spu_title }}</span>
          </div>
          <div class="price">
            <span
              :class="{ oldprice: !item.list[0].price, old_price: item.list[0].price }"
              >价格：￥{{ Number(item.list[0].oldprice).toFixed(2) }}</span
            ><span :class="{ now_price: item.list[0].price }" v-if="item.list[0].price"
              >现价：￥{{ Number(item.list[0].price).toFixed(2) }}</span
            >
          </div>
          <div class="goodstyle">
            <span>款式：{{ item.list[0].show_name }}</span>
          </div>
        </div>
      </a-checkbox-group>
    </div>
    <div class="no_data" v-if="!handelload && data.length === 0">
      <img src="https://www.dcmaomi.com:3000/serverImage/dsr1546asd.png" alt="" />
      <p class="desc">当前没有浏览记录哦</p>
      <p class="to_home"><router-link to="/">去看看商品把</router-link></p>
    </div>
    <div class="loading" v-if="handelload">
      <a-spin :spinning="handelload" size="large" tip="加载中..."></a-spin>
    </div>
  </div>
  <div class="dell" :class="{ showdell: isShowChekbox }" v-if="!handelload && data.length !== 0">
    <DeleteOutlined class="icon" @click="dellitem" />
    <div class="setup" @click="handelChekBoxShow">操作</div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
  ref,
  nextTick,
  onUpdated,
} from "vue";
import { setStore, getStore } from "../../utils/storage.js";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
export default {
  components: { DeleteOutlined },
  setup() {
    const state = reactive({
      history: [],
      old_history: [],
      data: [],
      checkItems: [],
      handelload: false,
      isShowChekbox: false,
      scrollTop: 0,
      isScrolltop: false,
    });
    const { proxy } = getCurrentInstance();
    onMounted(() => {
      init();
    });
    //初始化数据
    const init = () => {
      state.handelload = true;
      let history_data = [];
      //获得本地浏览历史
      const old_history = getStore("history");
      if (old_history === null || old_history === "") {
        history_data = [];
        state.handelload = false;
        return;
      } else {
        history_data = JSON.parse(old_history);
        state.old_history = history_data;
      }
      let spec_id_arr = [];
      history_data.forEach((element, index) => {
        if (spec_id_arr.indexOf(element.spec_id) === -1) {
          spec_id_arr.push(element.spec_id);
        }
      });
      getData(spec_id_arr);
    };
    //根据spec_id获得商品数据
    const getData = (arr) => {
      const new_arr = arr.map((item, index) => {
        return new Promise(async (resolve, reject) => {
          const res = await proxy.$http.post("/api/getItem", {
            id: item, //spec_id
          });
          if (res.data.success === true) {
            resolve(res.data.data[0]);
          } else {
            reject(new Error("请求商品失败" + index));
          }
        });
      });
      Promise.all(new_arr)
        .then((data) => {
          state.history = data;
          //根据本机历史，处理要所渲染的数据
          now_data();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const now_data = () => {
      const arr = [];
      state.old_history.forEach((item) => {
        state.history.forEach((element) => {
          if (item.spec_id === element.spec_id) {
            arr.push(back_Data(item, element));
          }
        });
      });
      state.data = arr;
      state.handelload = false;
    };
    const back_Data = (item, element) => {
      const data = JSON.parse(JSON.stringify(element));
      if (item.idx === 0 && data.list.length == 1) {
        data;
        return data;
      }
      const idx = item.idx;
      data.list = data.list.splice(idx, 1);
      return data;
    };
    const handelCchangeGroup = () => {};
    const handelChekBoxShow = () => {
      state.isShowChekbox = !state.isShowChekbox;
    };
    let scrolltop = "";
    const top = (el) => {
      scrolltop = el;
    };
    const dellitem = () => {
      if (state.checkItems.length === 0) {
        message.error("请选择要删除的商品");
        return;
      }
      nextTick(() => {
        // console.dir(scrolltop.scrollTop)
        state.scrollTop = scrolltop.scrollTop;
      });
      const checkItemsall = state.checkItems.map((item) => {
        return new Promise((resolve, reject) => {
          state.history.forEach((x, y) => {
            x.list.forEach((o, j) => {
              if (o.id === item) {
                try {
                  let old_history = JSON.parse(getStore("history"));
                  let idx = 0;
                  old_history.forEach((p, m) => {
                    if (p.spec_id === x.spec_id && p.idx === j) {
                      idx = m;
                    }
                  });
                  old_history.splice(idx, 1);
                  setStore("history", old_history);
                  resolve();
                } catch (error) {
                  reject(error);
                }
              }
            });
          });
        });
      });

      Promise.all(checkItemsall)
        .then(() => {
          init();
          // state.isScrolltop = true;
        })
        .catch((err) => {
          message.error("删除失败");
        });
    };
    onUpdated(() => {
      nextTick(() => {
        if (state.scrollTop === 0) return;
        scrolltop.scrollTop = state.scrollTop;
        state.scrollTop = 0;
      });
    });
    return {
      ...toRefs(state),
      handelCchangeGroup,
      handelChekBoxShow,
      dellitem,
      top,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.no_data {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .desc {
    margin: 10px !important;
    font-size: 22px;
    font-weight: bold;
    color: $cc;
  }
  .to_home {
    margin: 10px !important;
    font-size: 18px;
    // font-weight: bold;
    color: $cc;
  }
}
.warp {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: auto;
  position: relative;
}
.warp::-webkit-scrollbar-thumb:horizontal {
  /*水平滚动条的样式*/
  width: 4px;
  background-color: #cccccc;
  -webkit-border-radius: 6px;
}
.warp::-webkit-scrollbar-track-piece {
  background-color: #fff; /*滚动条的背景颜色*/
  -webkit-border-radius: 0; /*滚动条的圆角宽度*/
}
.warp::-webkit-scrollbar {
  width: 10px; /*滚动条的宽度*/
  height: 8px; /*滚动条的高度*/
}
.warp::-webkit-scrollbar-thumb:vertical {
  /*垂直滚动条的样式*/
  height: 50px;
  background-color: #999;
  -webkit-border-radius: 4px;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 2px solid #fff;
}
.warp::-webkit-scrollbar-thumb:hover {
  /*滚动条的hover样式*/
  height: 50px;
  -webkit-border-radius: 4px;
}
.warp_items {
  position: relative;
}
.history_item_warp {
  height: 120px;
  width: 100%;
  display: flex;
  align-items: center;
  // justify-content: center;
  border-bottom: 1px solid $xt;
}
.history_item {
  margin: 10px;
  transform: scale(0);
  transition: all 0.3s ease-in-out;
}
.showchekbox {
  transform: scale(1);
}
.history_info {
}
.name,
.price,
.goodstyle {
  flex: 1;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.name {
  span {
    display: inline-block;
    width: 200px;
  }
}
.price {
  span {
    margin: 5px;
  }
}
.oldprice {
  color: $jcg;
}
.old_price {
  text-decoration: line-through;
}
.now_price {
  color: $jcg;
}
.goodstyle {
}
.history_info_img {
  margin: 10px;
  img {
    width: 80px;
    height: 80px;
  }
  cursor: pointer;
}
.setup:hover {
  box-shadow: 0 0px 8px rgba($color: #ff9344, $alpha: 0.6);
}
.dell {
  display: block;
  // align-items: flex-end;
  // justify-content: flex-end;

  user-select: none;
  position: sticky;
  bottom: 20px;
  left: 85%;
  width: 50px;
  height: 50px;
  color: $cf;
  background-color: rgba($color: #ff9344, $alpha: 0.8);
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  backface-visibility: hidden;
  .icon {
    // margin-top: 10px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
    cursor: pointer;
    font-size: 22px;
  }
}
.showdell {
  display: block;
  width: 100px;
  border-radius: 50% 4px 4px 50%;
}
.setup {
  position: absolute;
  display: block;
  cursor: pointer;
  top: 0px;
  width: 50px;
  height: 50px;
  border: 1px solid $main-col;
  border-radius: 50%;
  background-color: $cf;
  color: $main-col;
  text-align: center;
  line-height: 50px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0px 8px rgba($color: #ff9344, $alpha: 0.1);
  z-index: 99;
}

.loading {
  width: 100%;
  height: 100%;
  background-color: $cf;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
