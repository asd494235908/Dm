<template>
  <div>
    <my-herder></my-herder>
    <div class="up_order_warp">
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
              <div class="up_innfo_warp">
                <div class="up_innfo">
                  <div class="top_text">请填写订单写信息</div>
                  <div class="email">
                    <p class="text">邮箱:</p>
                    <a-input
                      :class="{ email_err: isEmail }"
                      v-model:value="email"
                      placeholder="情输入您的邮箱(推荐qq邮箱)"
                      allowClear
                    />
                  </div>
                  <div class="mesg">
                    <p class="text">留言:</p>
                    <a-textarea
                      v-model:value="mesg"
                      placeholder="说点什么吧"
                      auto-size
                      :maxlength="300"
                    />
                  </div>
                  <div class="Set_meal">
                    <p class="text">选择套餐:</p>
                    <a-select
                      label-in-value
                      style="width: 100%"
                      @change="ChangeSet_meal"
                      placeholder="请选择"
                    >
                      <a-select-option
                        v-for="item in play_type"
                        :key="item.id + 'select-option'"
                        :value="item.id"
                      >
                        {{ item.titel }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div class="mesg">
                    <p class="text">说明:</p>
                    <p class="text_info">{{ info }}</p>
                  </div>
                  <div class="email" v-if="pirce_info === 100">
                    <p class="text">输入金额:</p>
                    <a-input
                      v-model:value="play_num"
                      placeholder="情输入您金额"
                      type="Number"
                      :allowClear="true"
                      prefix="￥"
                      suffix="RMB"
                      @blur="priceBlur"
                    />
                  </div>
                  <div class="play">
                    <p class="text">支付方式:</p>
                    <div class="play_items">
                      <div
                        class="in_alipay"
                        @click="handelPlay(0)"
                        :class="{ play_active: play_id === 0 }"
                      >
                        <img src="../../../public/static/img/alipay@2x.png" alt="" />
                        <p class="desc">官方</p>
                      </div>
                      <div
                        class="out_alipay"
                        @click="handelPlay(1)"
                        :class="{ play_active: play_id === 1 }"
                      >
                        <img src="../../../public/static/img/alipay@2x.png" alt="" />
                        <p class="desc">免签</p>
                      </div>

                      <div
                        class="out_weixin"
                        @click="handelPlay(2)"
                        :class="{ play_active: play_id === 2 }"
                      >
                        <img src="../../../public/static/img/weixinpay@2x.png" alt="" />
                        <p class="desc">免签</p>
                      </div>
                    </div>
                  </div>
                  <div class="buttom">
                    <div class="price_info">
                      <p>
                        总金额：<span>￥{{ Number(AllPrice).toFixed(2) }}</span>
                      </p>
                      <p>
                        实际付款：<span>￥{{ Number(price).toFixed(2) }}</span>
                      </p>
                    </div>
                    <a-button
                      @click="handeSubmint"
                      size="large"
                      shape="round"
                      type="primary"
                      class="sub_btn"
                      :loading="btnLoading"
                    >
                      付款<RightOutlined />
                    </a-button>
                  </div>
                </div>
              </div>
            </template>
          </MyTitel>
        </div>
        <div class="order_list">
          <my-order-list :order_item="order" :isShow="false"></my-order-list>
        </div>
      </div>
    </div>
    <Top></Top>
    <PageBottom></PageBottom>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, onMounted, computed, h,createVNode } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { message, Modal } from "ant-design-vue";
import MyOrderList from "@/components/my_order_list/index.vue";
import MyHerder from "@/components/my_herder/herder.vue";
import MyTitel from "@/components/my_titel/index.vue";
import Top from "@/components/go_top/index.vue";
import PageBottom from "@/components/page_bottom/index.vue";
import { RightOutlined,ExclamationCircleOutlined } from "@ant-design/icons-vue";
createVNode
export default {
  components: { MyHerder, MyOrderList, MyTitel, Top, RightOutlined,ExclamationCircleOutlined,PageBottom },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      order: {},
      AllPrice: 0,
      idx: "0",
      isEmail: false,
      email: "554702612@qq.com",
      mesg: "", //用户留言
      infoValue: {},
      info: "未选择",
      pirce_info: 101, //选择的套餐
      play_id: 100, // 选择的支付方式 为0是支付宝官方支付 1是支付宝免签支付 2是微信免签支付
      payType: "", //支付方式 英文
      play_num: "",
      play_type: [],
      price: 0,
      btnLoading: false,
      isNum: 0,
    });
    onMounted(() => {
      if (route.query.order_id !== undefined || route.query.order_id !== "") {
        state.order_id = route.query.order_id;
      } else {
        _back();
      }
      initOrder();
      initPalyType();
      onShowText();
      // console.log();
    });
    //提醒输入地址
    const onShowText = () => {
      Modal.info({
        okText: "我知道了",
        title: "重要(必填)",
        content: h("div", "请在地址栏确认您的收货人姓名，捐赠成功后将展示在捐赠名单内"),
        onOk() {},
      });
    };
    const userAddress = computed(() => {
      //判断是否登录返回**默认**地址/感觉是多余的，退登录会有BUG 等于 undefined
      if (store.state.login) {
        let arr = [
          {
            address: state.order.address,
            address_info: state.order.address_info,
            difall: 0,
            name: state.order.name,
            phone: state.order.phone,
            uid: state.order.uid,
          },
        ];
        return arr;
      } else {
        return [];
      }
    });
    //返回上一页
    const _back = () => {
      setTimeout(() => {
        router.go(-1);
      }, 2000);
      message.error("参数错误，即将返回上一页");
    };
    const initPalyType = async () => {
      const res = await proxy.$http.post("/api/payType");
      if (res.data.success === true) {
        state.play_type = res.data.data;
      } else {
        message.error("获取支付状态失败，即将返回上一页");
        _back();
      }
    };
    const initOrder = async () => {
      let uid = store.state.userInfo.uid;
      if (state.order_id === undefined) {
        _back();
      }
      const res = await proxy.$http.post("/api/getOrder", {
        uid,
        order_id: state.order_id,
      });
      if (res.data.success === true) {
        message.info("获取订单成功");
        res.data.data.forEach((item) => {
          item.time = proxy.$dayjs(item.time).format("YYYY-MM-DD HH:mm:ss");
          item.play_time = proxy.$dayjs(item.time).format("YYYY-MM-DD HH:mm:ss");
        });
        state.order = res.data.data[0];
        state.order.data_list.forEach((item) => {
          state.AllPrice += item.price * item.suplist_num;
        });
      } else {
        message.error("获取订单失败");
        _back();
      }
    };
    const onconfirm = () => {
      router.push({
        path: "/address",
        query: {
          order_id: state.order_id,
        },
      });
    };
    const email_blur = () => {
      if (state.email === "") {
        state.isEmail = true;
        message.error("请输入邮箱");
        return false;
      }
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!reg.test(state.email)) {
        state.isEmail = true;
        message.error("邮箱格式输入错误请从新输入");
        return false;
      }

      state.isEmail = false;
      return true;
    };
    //每次选择套餐初始化选择的套餐
    const ChangeSet_meal = (value) => {
      state.play_type.forEach((item) => {
        if (item.id === value.value) {
          if (item.id === 100) {
            state.isNum = 1;
          } else {
            state.isNum = 0;
          }
          state.play_num = "";
          state.infoValue = item;
          state.pirce_info = item.id;
          state.price = item.price;
          state.info = item.info;
        }
      });
    };
    //选择支付方式
    const handelPlay = (idx) => {
      state.play_id = idx;
    };
    const priceBlur = () => {
      state.play_num = Number(state.play_num).toFixed(2);
      state.price = state.play_num;
    };
    //判断是否选择了套餐
    const isSet_meal = () => {
      if (state.pirce_info === 101) {
        message.warning("请选择套餐");
        return false;
      }
      if (state.price === 0 || state.price === null) {
        message.warning("请输入您的金额");
        return false;
      }
      return true;
    };
    //判断是否选择支付方式
    const isPlay = () => {
      if (state.play_id === 100) {
        message.warning("请选择付款方式");
        return false;
      }
      return true;
    };
    //提交付款
    /**
     * @play_id 为0是支付宝官方支付 1是支付宝免签支付 2是微信免签支付
     * @order_id 订单编号
     * @pirce 订单价格
     * @email 客户的邮箱
     * @info 套餐说明
     * @mesg 留言
     * @token 加密
     * @isNum 是否为自定义输入0为false，1是ture
     * **/
    const handeSubmint = () => {
      if (!email_blur()) return;
      if (!isSet_meal()) return;
      if (!isPlay()) return;
      //判断是否已支付
      if (state.order.type !== 0) {
        message.error("此订单订单已支付");
        return;
      }
      state.btnLoading = true;
      //判断是否为QQ邮箱
      const isqq = /^\d+@qq\.com$/;
      if (!isqq.test(state.email)) {
        Modal.confirm({
          title: "提示",
          content: h("div", {}, [
            h("p", `推荐使用QQ邮箱，其他邮箱可能被拦截或者放置在垃圾邮箱内`),
          ]),
          icon: createVNode(ExclamationCircleOutlined),
          okText: "确定",
          okType: "danger",
          cancelText: "我在改改",
          onOk() {
                goPay();
          },
          onCancel() {
             state.btnLoading = false;
          },
        });
      } else {
        goPay();
      }
    };
    const goPay = async () => {
      const res = await proxy.$http.post("/api/play", {
        play_id: state.play_id,
        order_id: state.order_id,
        pirce: state.price,
        email: state.email,
        info: state.infoValue,
        mesg: state.mesg,
        isNum: state.isNum,
      });
      if (res.data.success === true) {
        //获取到付款信息 跳转到支付页面
        const play_Data = {
          img_url: res.data.data,
          url: res.data.url,
          token: res.data.token,
          payNum: res.data.payNum,
          play_id: state.play_id,
          pirce: state.price,
        };

        store.commit("sevePlayData", play_Data);
        store.commit("seveOrderData", state.order);
        router.push({
          path: "/payPage",
        });
        state.btnLoading = false;
      } else {
        state.btnLoading = false;
        message.error("请求错误，请重试");
      }
    };
    return {
      ...toRefs(state),
      initOrder,
      onconfirm,
      userAddress,
      ChangeSet_meal,
      handelPlay,
      priceBlur,
      handeSubmint,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.up_order_warp {
  width: 100%;
  .limit {
    width: 1200px;
    margin: 0 auto;
    .up_innfo_warp {
      width: 100%;
      margin-top: 30px;
      border-radius: 4px;
      background-color: $cf;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid $xt;
    }
    .up_innfo {
      width: 100%;
      border-radius: 4px;
      background-color: $cf;
      padding: 20px 0;
      .top_text {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
      }
      .buttom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 10px 40px;
        .price_info {
          font-size: 18px;
          margin: 0 20px;
          span {
            color: $jcg;
            font-weight: bold;
          }
        }
        .sub_btn {
          width: 160px;
          height: 48px;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 4px;
        }
      }

      .play {
        width: 100%;
        padding: 10px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 30px;
        }
        .play_items {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          user-select: none;
          .out_weixin,
          .out_alipay,
          .in_alipay {
            width: 280px;
            height: 90px;
            border: 2px solid $xt;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            margin: 10px 0;
            padding: 10px;
            cursor: pointer;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .desc {
            position: absolute;
            right: 0;
            top: 0;
            width: 40px;
            height: 30px;
            background-color: $main-col;
            color: $cf;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            border-radius: 0 0 0 4px;
          }
          .play_active {
            border: 2px solid $main-col;
          }
          .out_alipay {
          }
          .out_weixin {
          }
        }
      }

      .mesg {
        width: 100%;
        padding: 10px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 30px;
        }
        .text_info {
          width: 100%;
          border: 1px solid #d9d9d9;
          padding: 5px;
          border-radius: 2px;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
      .Set_meal {
        width: 100%;
        padding: 10px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 30px;
        }
      }

      .email {
        width: 100%;
        padding: 10px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 30px;
        }
        .email_err {
          border-color: red;
        }
      }
    }
    .address_warp {
      width: 100%;
      margin-top: 60px;
      border-radius: 4px;
      background-color: $cf;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);

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
    .order_list {
      margin-top: 60px;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  }
}
</style>
