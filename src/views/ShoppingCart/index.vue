<template>
  <div>
    <my-herder />
    <div class="cart_warp">
      <div class="limit">
        <div class="address_warp">
          <MyTitel title="已选择地址">
            <template v-slot:content>
              <div class="address_content" v-if="userAddress.length !== 0">
                <template v-for="(item, index) in userAddress">
                  <div
                    class="address__item"
                    v-if="item.difall === 0"
                    :key="index + 'address__item'"
                  >
                    <div class="address_icon">
                      <img src="../../../public/static/img/address.png" alt="" />
                    </div>
                    <div class="address_midel">
                      <div class="address_midel_top">
                        <div class="address_name">
                          姓名:<span>{{ item.name }}</span>
                        </div>
                        <div class="address_phone">
                          联系方式:<span>{{ item.phone }}</span>
                        </div>
                      </div>
                      <div class="address_midel_bouttom">
                        <div class="address_address">
                          地址:<span>{{ item.address }}</span>
                        </div>
                        <div class="address_info">
                          详细地址:<span>{{ item.address_info }}</span>
                        </div>
                      </div>
                    </div>
                    <a-popconfirm
                      placement="rightTop"
                      ok-text="确认"
                      cancel-text="取消"
                      @confirm="onconfirm"
                    >
                      <template #title>
                        <p>确定要去选择地址吗？</p>
                      </template>
                      <div class="address_icon_go"></div>
                    </a-popconfirm>
                  </div>
                </template>
              </div>
              <div
                class="address_no"
                v-if="userAddress.length === 0 && userAddress !== undefined"
              >
                <div class="svg_icon">
                  <svg
                    t="1610190278039"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2836"
                    width="100%"
                    height="100%"
                  >
                    <path
                      d="M512.18963 896c-10.05037 0-20.195556-3.413333-28.34963-10.24-19.342222-16.023704-87.324444-74.808889-149.902222-159.478519-34.038519-46.174815-61.060741-92.634074-80.213334-138.24-23.514074-55.940741-35.365926-111.028148-35.365925-163.84 0-79.075556 30.53037-153.505185 85.997037-209.445925 55.561481-56.035556 129.327407-86.85037 207.928888-86.850371 78.506667 0 152.367407 30.814815 207.834075 86.850371 55.466667 55.940741 85.997037 130.275556 86.091851 209.445925-0.094815 224.711111-203.377778 410.168889-265.576296 461.653334-8.248889 6.731852-18.394074 10.145185-28.444444 10.145185z m0-725.333333c-138.524444 0-251.259259 113.777778-251.25926 253.629629 0 215.703704 224.426667 407.419259 250.026667 428.657778 0.758519 0.568889 1.706667 0.568889 2.37037 0 58.69037-48.45037 250.026667-222.72 250.026667-428.657778C763.448889 284.444444 650.714074 170.666667 512.18963 170.666667z"
                      p-id="2837"
                      fill="#dbdbdb"
                    ></path>
                    <path
                      d="M514.465185 343.04c47.028148 0 85.333333 38.305185 85.333334 85.333333s-38.305185 85.333333-85.333334 85.333334-85.333333-38.305185-85.333333-85.333334 38.305185-85.333333 85.333333-85.333333m0-42.666667c-70.731852 0-128 57.268148-128 128s57.268148 128 128 128 128-57.268148 128-128-57.268148-128-128-128z"
                      p-id="2838"
                      fill="#dbdbdb"
                    ></path>
                  </svg>
                </div>
                <div class="text">当前未选择地址</div>
                <div class="goAddress">
                  <router-link to="/address" style="color: #fff">去选择地址</router-link>
                </div>
              </div>
            </template>
          </MyTitel>
        </div>
        <div class="cart_content">
          <MyTitel title="购物车">
            <template v-slot:content>
              <div class="cart_item_warp">
                <div
                  class="cart_titel"
                  v-if="userGood.length !== 0 && userGood !== undefined"
                >
                  <div class="check">选择</div>
                  <div class="info">名称</div>
                  <div class="style">款式</div>
                  <div class="size">大小</div>
                  <div class="price">单价</div>
                  <div class="num">数量</div>
                  <div class="minprice">小计算</div>
                  <div class="desc">操作</div>
                </div>
                <a-checkbox-group v-model:value="checkItems" @change="handelCchangeGroup">
                  <div
                    class="cart_item"
                    v-for="(item, index) in userGood"
                    :key="index + 'cart_item'"
                  >
                    <div class="item_left">
                      <a-checkbox :value="item.id"></a-checkbox>
                    </div>

                    <div class="item_right">
                      <div class="item_img">
                        <img
                          v-lazy="{ src: item.data[0].img_url1 }"
                          alt=""
                          :key="item.data[0].img_url1"
                          @click="handelItem(item)"
                        />
                      </div>
                      <div class="item_info">
                        <span class="ellipsis">{{ item.data[0].spu_title }}</span>
                      </div>
                      <div class="item_style">{{ item.style }}</div>
                      <div class="item_size">{{ item.size }}</div>
                      <div class="item_price">{{ Number(item.price).toFixed(2) }}</div>
                      <div class="item_num">
                        <a-input-number
                          v-model:value="item.suplist_num"
                          :min="1"
                          :max="99"
                          @change="NumberonChange"
                        />
                      </div>
                      <div class="item_minprice">
                        {{ Number(item.suplist_num * item.price).toFixed(2) }}
                      </div>
                      <div class="item_desc">
                        <a-popconfirm
                          placement="rightTop"
                          ok-text="确认"
                          cancel-text="取消"
                          @confirm="isDellGood_Item"
                        >
                          <template #title>
                            <p>确定要删除吗？</p>
                          </template>
                          <a-button
                            type="primary"
                            size="small"
                            shape="circle"
                            :ghost="true"
                            @click="dellGood_Item(item)"
                            @cancel="cancel_Good_Item"
                          >
                            <template v-slot:icon
                              ><CloseOutlined class="item_desc_icon" /></template
                          ></a-button>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </a-checkbox-group>
                <div class="cart_content_all" v-if="userGood.length !== 0">
                  <div class="cart_content_all_left">
                    <a-checkbox v-model:checked="allCart"></a-checkbox>
                    <span class="all_check">全选</span>
                  </div>
                  <div class="cart_content_all_right">
                    <div class="cart_content_all_righ_titel">
                      <p>
                        已选择<span style="color: red">{{ checkItems.length }}</span
                        >件商品
                      </p>
                      <p>
                        共计<span>{{ userGood.length }}</span
                        >件商品
                      </p>
                    </div>
                    <div class="cart_content_all_righ_allprice">
                      <p>
                        应付金额<span class="price">￥{{ AllPrice }}</span>
                      </p>
                      <p>支付总额只包含商品费用</p>
                    </div>
                    <div class="cart_content_all_righ_submit">
                      <a-button
                        type="primary"
                        size="large"
                        class="submit_btn"
                        @click="subOreder"
                      >
                        结算
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="cart_item_no" v-if="userGood.length === 0">
                <img src="https://s1.ax1x.com/2020/10/17/0L3dZF.png" alt="" />
                <p>购物车里面什么都没有空空如也</p>
                <p class="goHome"><router-link to="/">快去选购吧</router-link></p>
              </div>
            </template>
          </MyTitel>
        </div>
      </div>
    </div>
    <Top></Top>
    <page-bottom></page-bottom>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import MyHerder from "@/components/my_herder/herder.vue";
import MyTitel from "@/components/my_titel/index.vue";
import Top from "@/components/go_top/index.vue";
import PageBottom from "@/components/page_bottom/index.vue";
import { CloseOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    MyHerder,
    MyTitel,
    Top,
    CloseOutlined,
    PageBottom,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const state = reactive({
      userGood: [],
      checkItems: [],
      allCart: false,
      dellItemInfo: {},
    });
    onMounted(() => {
      //初始化数据
      initData();
    });
    //检测是否全选
    watch(
      () => state.allCart,
      (x, y) => {
        if (x) {
          state.checkItems = [];
          state.userGood.forEach((item) => {
            state.checkItems.push(item.id);
          });
        } else {
          state.checkItems = [];
        }
      }
    );
    //监测购物车变化
    watch(
      () => store.state.userInfo,
      (x) => {
        initData();
      }
    );
    const initData = () => {
      state.userGood = store.state.userInfo.user_cart;
    };
    const userAddress = computed(() => {
      //判断是否登录返回**默认**地址/感觉是多余的，退登录会有BUG 等于 undefined
      if (store.state.login) {
        const difalAddress = store.state.userInfo.address.filter(
          (item) => item.difall === 0
        );
        return difalAddress;
      } else {
        return [];
      }
    });
    //计算当前选择的总价
    const AllPrice = computed(() => {
      let price = 0;
      //判断是否选择了商品
      if (state.checkItems.length !== 0) {
        state.checkItems.forEach((item) => {
          let b = state.userGood.filter((a) => a.id === item);
          price += b[0].price * b[0].suplist_num;
        });

        return Number(price).toFixed(2);
      } else {
        return Number(0).toFixed(2);
      }
    });
    const onconfirm = () => {
      router.push({
        path: "/address",
      });
    };
    const handelCchangeGroup = () => {};
    const NumberonChange = () => {};
    //记录要被删除购物车的某一项
    const dellGood_Item = (item) => {
      state.dellItemInfo = item;
    };
    //点击取消清空被删除的某一项
    const cancel_Good_Item = () => {
      state.dellItemInfo = {};
    };
    //发送请求删除
    const isDellGood_Item = async () => {
      let uid = store.state.userInfo.uid;
      console.log(state.dellItemInfo);
      const res = await proxy.$http.post("/api/dellGoodItem", {
        isWeb: true,
        isAdd: false,
        uid,
        data: state.dellItemInfo,
      });
      if (res.data.success === true) {
        //删除成功调整user信息
        update_userInfo();
        state.allCart = false;
        message.success("删除成功");
      } else {
        message.error("删除失败");
      }
    };
    const update_userInfo = async () => {
      const res = await proxy.$http.post("/api/validate", {});
      const data = res.data;
      if (data.success === true) {
        store.commit("seveLogin", data.data);
        initData();
      } else {
        message.error("跟新数据失败");
      }
    };

    //提交订单
    const subOreder = async () => {
      if (userAddress.value.length === 0) {
        message.error("请选择默认地址");
        return;
      }
      if (state.checkItems.length === 0) {
        message.error("请添加商品");
        return;
      }
      const time = _getTime();
      const orid = _getOriderId();
      const type = 0;
      const uid = store.state.userInfo.uid;
      const userNickName = store.state.userInfo.user_name;
      const Address = userAddress.value[0];
      const data = _getListData(orid);
      const res = await proxy.$http.post("/api/submitOrder", {
        type,
        time,
        orid,
        uid,
        data,
        Address,
        userNickName,
      });
      if (res.data.success === true) {
        // UpDataOrder?order_id=20210114115453
        router.push({
          path: "/UpDataOrder",
          query: {
            order_id: orid,
          },
        });
      } else {
        message.error("提交失败，即将返回上一页");
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
    //获取时间
    const _getTime = () => {
      let time = new Date();
      const year = time.getFullYear();
      const Month = time.getMonth() + 1;
      const date = time.getDate();
      const Hours = time.getHours();
      const Minutes = time.getMinutes();
      const Seconds = time.getSeconds();
      return `${year}-${_towNum(Month)}-${_towNum(date)} ${_towNum(Hours)}:${_towNum(
        Minutes
      )}:${_towNum(Seconds)}`;
    };
    //订单编号
    const _getOriderId = () => {
      let time = new Date();
      const year = time.getFullYear();
      const Month = time.getMonth() + 1;
      const date = time.getDate();
      const Hours = time.getHours();
      const Minutes = time.getMinutes();
      const Seconds = time.getSeconds();
      const id = `${year}${_towNum(Month)}${_towNum(date)}${_towNum(Hours)}${_towNum(
        Minutes
      )}${_towNum(Seconds)}`;
      return id;
    };
    const _towNum = (num) => {
      return num < 10 ? "0" + num : num;
    };
    //返回选中商品的数据
    const _getListData = (orid) => {
      let arr = [];
      let uGood = JSON.parse(JSON.stringify(state.userGood));
      state.checkItems.forEach((item) => {
        uGood.filter((el) => {
          if (el.id === item) {
            el.order_id = orid;
            arr.push(el);
          }
        });
      });
      return arr;
    };
    //点击去商品详情界面
    const handelItem = (item) => {
      router.push({
        path: "/GoodInfo",
        query: {
          spec_id: item.sup_id,
          idx: 0,
          difall: item.suplist_id,
        },
      });
    };

    return {
      ...toRefs(state),
      userAddress,
      onconfirm,
      handelCchangeGroup,
      NumberonChange,
      AllPrice,
      isDellGood_Item,
      dellGood_Item,
      cancel_Good_Item,
      subOreder,
      handelItem,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.cart_warp {
  width: 100%;

  .limit {
    width: 1200px;
    margin: 0 auto;
    .cart_content {
      width: 100%;
      margin-top: 60px;
      border-radius: 4px;
      background-color: $cf;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
      .cart_item_warp {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .cart_titel {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          height: 40px;
          border-bottom: 1px $xt solid;
          .info {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .size,
          .desc {
            width: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .num {
            width: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .check,
          .style,
          .price,
          .minprice {
            width: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .ant-checkbox-group {
          width: 100%;
        }
        .cart_content_all {
          width: 100%;
          height: 90px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .cart_content_all_left {
            margin-left: 17px;
            span {
              margin-left: 10px;
            }
          }
          .cart_content_all_right {
            height: 80%;
            display: flex;
            align-items: center;
            .cart_content_all_righ_allprice,
            .cart_content_all_righ_titel {
              font-size: 15px;
              margin: 0 10px;
              display: flex;
              align-items: center;
              flex-direction: column;
              letter-spacing: 1px;
              span {
                margin: 0 5px;
              }
            }
            .cart_content_all_righ_allprice {
              justify-content: flex-start;
              .price {
                font-size: 20px;
                color: $jcg;
                font-weight: bold;
              }
              p {
                width: 100%;
              }
            }
            .submit_btn {
              width: 130px;
              height: 45px;
              margin: 0 20px;
            }
            .cart_content_all_righ_titel {
              justify-content: flex-end;
              p {
                width: 100%;
                text-align: end;
              }
            }
          }
        }

        .cart_item {
          width: 100%;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid $xt;
          padding: 0 10px;
          .item_left {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .item_right {
            flex: 1;
            display: flex;
            align-content: center;
            justify-content: space-between;
            .item_info {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              margin-left: 20px;
              span {
                display: inline-block;
                width: 360px;
              }
            }
            .item_num {
              width: 200px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .item_size,
            .item_desc {
              width: 120px;
              display: flex;
              align-items: center;
              justify-content: center;
              .item_desc_icon {
                position: relative;
                top: 1px;
              }
            }
            .item_style,
            .item_price,
            .item_minprice {
              width: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .item_img {
              width: 80px;
              height: 80px;
              border: 1px solid $xt;
              margin-left: 30px;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }

      .cart_item_no {
        width: 100%;
        height: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          width: 200px;
          height: 200px;
          position: relative;
          left: -20px;
          margin-bottom: 10px;
        }
        p {
          font-size: 16px;
          font-weight: bold;
          margin: 10px 0 !important;
          color: $c9;
        }
        .goHome {
          //   border: 1px solid $main-col;
          padding: 5px 20px;
          background-color: $main-col;
          color: $cf;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          a {
            color: $cf;
          }
        }
      }
    }
    .address_warp {
      width: 100%;
      margin-top: 60px;
      border-radius: 4px;
      background-color: $cf;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
      .address_content {
        width: 100%;
        .address__item {
          // padding: 0 20px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .address_icon {
            margin: 0 30px;
            img {
              width: 25px;
              height: 25px;
            }
          }
          .address_icon_go:hover {
            background-image: url("../../../public/static/img/go_active.png");
          }
          .address_icon_go {
            margin: 0 30px;
            width: 25px;
            height: 25px;
            background-image: url("../../../public/static/img/go.png");
            background-size: cover;
            cursor: pointer;
          }
          .address_midel {
            height: 80%;
            padding: 0 30px;
            flex: 1;
            // border-left: 1px solid $xt;
            // border-right: 1px solid $xt;
            display: flex;
            align-content: center;
            justify-content: center;
            flex-direction: column;
            font-size: 15px;
            font-weight: bold;
            .address_midel_top,
            .address_midel_bouttom {
              height: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              div {
                flex: 1;
                color: $c9;
              }
              span {
                margin-left: 15px;
                color: $c3;
              }
            }
          }
        }
      }

      .address_no {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 150px;
        .svg_icon {
          width: 50px;
          height: 50px;
        }
        .text {
          font-size: 16px;
          color: $cc;
          font-weight: bold;
        }
        .goAddress {
          font-weight: bold;
          margin-top: 10px;
          font-size: 16px;
          padding: 5px 20px;
          background-color: #ff9344;
          color: #fff;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
