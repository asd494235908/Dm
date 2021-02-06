<template>
  <div>
    <MyHerder></MyHerder>
    <div class="play_warp">
      <div class="limit">
        <div class="content">
          <MyTitel title="DcPay支付,收款方Mike">
            <template v-slot:content>
              <div class="content_warp">
                <div class="pay_totel">订单提交成功，请继续支付</div>
                <div class="pay_top">
                  <span
                    >请使用<i style="color: red">{{ isPlay }}</i
                    >打开扫一扫支付</span
                  ><img src="../../../public/static/img/sao.png" alt="" />
                </div>
                <div class="play_num">
                  支付<span>￥{{ playData.pirce }}</span>
                </div>
                <div class="img_warp">
                  <img :src="playData.img_url" alt="" />
                  <div class="mask" v-if="isNoPlay">订单已失效请重新下单</div>
                </div>
                <div class="icons">
                  <AlipayOutlined v-if="playData.play_id !== 2" class="icon a" />
                  <WechatOutlined v-if="playData.play_id === 2" class="icon b" />
                </div>
                <div class="bouttom">
                  付款将于<a-statistic-countdown
                    :value="play_time"
                    format=" m 分 s 秒"
                    class="timer"
                    valueStyle="color:#f05247;font-size:16px"
                    @finish="handelchangeEnd"
                  />后结束，超时请重新发起支付
                </div>
              </div>
            </template>
          </MyTitel>
        </div>
        <div class="order_list">
          <my-order-list :order_item="orderData" :isShow="false"></my-order-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  computed,
  h,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { Modal } from "ant-design-vue";
import MyHerder from "@/components/my_herder/herder.vue";
import MyTitel from "@/components/my_titel/index.vue";
import MyOrderList from "@/components/my_order_list/index.vue";
import { AlipayOutlined, WechatOutlined } from "@ant-design/icons-vue";
export default {
  components: { MyHerder, MyTitel, MyOrderList, AlipayOutlined, WechatOutlined },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      count: 0,
      playData: {},
      isdescImg: "",
      visible: true,
      play_time: 0,
      isNoPlay: false,
      timer: null,
      orderData: {},
    });
    onMounted(() => {
      initPlayData();
      if (state.playData.payNum !== undefined) {
        nextTick(() => {
          Modal.info({
            okText: "我知道了",
            title: "重要(必填)",
            content: h("div", { class: "mask_Warp" }, [
              h("div", { class: "desc_img" }, [h("img", { src: state.isdescImg })]),
              h("p", { class: "paNum" }, `请在支付时候添加备注号`),
              h("p", { class: "paNum" }, `${state.playData.payNum}(重要)`),
            ]),
            onOk() {
              state.play_time = Date.now() + 300000;
              updata_pay();
            },
          });
        });
      } else {
        updata_pay();
        state.play_time = Date.now() + 300000;
      }
      initOrderData();
    });
    onUnmounted(() => {
      handelchangeEnd();
    });
    //初始化订单信息
    const initOrderData = () => {
      state.orderData = store.state.orderData;
    };

    //请求是否支付成功
    const updata_pay = () => {
      if (!state.isNoPlay) {
        state.timer = setInterval(async () => {
          const res = await proxy.$http.post("/api/orderType", {
            token: state.playData.token,
          });
          if (res.data.cood === 400) {
          } else if (res.data.cood === 402) {
            // "订单已被驳回请重新下单"
            pay_back();
          } else if (res.data.cood === 401) {
            //  "数据有误请重试"
            pay_warning();
          } else if (res.data.cood === 500) {
            // "请求被驳回"
            pay_back();
          } else if (res.data.cood === 200) {
            // "支付成功"
            pay_success();
          }
        }, 1000);
      } else {
        clearInterval(state.timer);
      }
    };
    //初始化支付数据
    const initPlayData = () => {
      if (Object.keys(store.state.play_data).length === 0) {
        _back();
      }
      state.playData = store.state.play_data;
    };
    //返回上一页
    const _back = () => {
      setTimeout(() => {
        router.push({
          path: "/order",
        });
      }, 2000);
      message.error("参数错误，即将返回上一页");
    };
    const isPlay = computed(() => {
      switch (state.playData.play_id) {
        case null:
          return "";
          break;
        case 0:
          state.isdescImg = "https://www.dcmaomi.com:3000/serverImage/bz.png"; //改成支付宝的
          return "支付宝";
          break;
        case 1:
          state.isdescImg = "https://www.dcmaomi.com:3000/serverImage/bz.png"; //改成支付宝的
          return "支付宝";
          break;
        case 2:
          state.isdescImg = "https://www.dcmaomi.com:3000/serverImage/bz.png"; //微信金额备注图
          return "微信";
          break;
      }
    });
    //倒计时结束时
    const handelchangeEnd = () => {
      state.isNoPlay = true;
      updata_pay();
      // console.log("倒计时结束");
    };
    //订单支付数据有误
    const pay_warning = () => {
      handelchangeEnd();
      Modal.warning({
        title: "支付数据",
        content: h("div", {}, [
          h("p", `支付数据有误，或许时服务器内部的原因`),
          h("p", `点击确定返回上一页`),
        ]),
        onOk() {
          _back();
        },
      });
    };
    //订单支付成功的操作
    const pay_success = () => {
      handelchangeEnd();
      Modal.success({
        title: "支付成功",
        content: h("div", {}, [
          h("p", `恭喜你支付成功，赠品将通过邮件发送至您的邮箱`),
          h("p", `点击确定返回上一页`),
        ]),
        onOk() {
          _back();
        },
      });
    };
    //订单被驳回的操作
    const pay_back = () => {
      handelchangeEnd();
      Modal.error({
        title: "请求被驳回",
        content: h("div", {}, [
          h("p", `请求支付被驳回，支付失败请联系管理员`),
          h("p", `点击确定返回上一页`),
        ]),
        onOk() {
          _back();
        },
      });
    };
    return {
      ...toRefs(state),
      isPlay,
      handelchangeEnd,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.order_list {
  margin-top: 60px;
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.play_warp {
  width: 100%;
  margin-top: 60px;
  .limit {
    width: 1200px;
    margin: 0 auto;
    .content {
      width: 100%;
      background-color: $cf;
      border-radius: 4px;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);

      .content_warp {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 20px 0;
      }
      .bouttom {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        font-size: 16px;
        .isplay_time {
          font-size: 16px;
        }
      }
      .img_warp {
        margin-top: 20px;
        position: relative;
        width: 200px;
        height: 200px;
        border: 1px solid $xt;
        img {
          width: 100%;
          height: 100%;
          border: 1px solid $xt;
        }
        .mask {
          position: absolute;
          width: 100%;
          height: 100%;
          color: $c3;
          background-color: rgba(255, 255, 255, 0.9);
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .play_num {
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        span {
          color: $jcg;
        }
      }
      .icons {
        font-size: 40px;
        .icon {
        }
        .a {
          color: rgb(20, 118, 254);
        }
        .b {
          color: rgb(123, 210, 54);
        }
      }
      .pay_totel {
        font-size: 20px;
        margin: 10px 0;
        font-weight: bold;
      }
      .pay_top {
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 22px;
          height: 22px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
