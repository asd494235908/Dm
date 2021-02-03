<template>
  <div v-if="isShow">
    <my-titel :title="'订单号：' + order_item.oder_id">
      <template v-slot:content>
        <div class="top">
          <a-steps :current="order_item.type">
            <a-step title="待付款" />
            <a-step title="待确认收货" />
            <a-step title="已收货" />
            <a-step title="已失效" />
          </a-steps>
          <div class="desc">
            <div class="desc_left" v-if="order_item.type === 0">
              <span>订单将于</span>
              <a-statistic-countdown
                :value="timeNum(order_item.time)"
                format="H 时 m 分 s 秒"
                class="timer"
                valueStyle="color:#f05247;font-size:18px"
                @finish="handelchange"
              /><span>后失效</span>
            </div>
            <div class="desc_right">
              <!-- 现在付款开始 -->
              <a-tooltip v-if="order_item.type === 0 && !isShow">
                <template #title> 现在付款 </template>
                <a-button
                  type="primary"
                  shape="circle"
                  :ghost="true"
                  style="margin: 0 10px"
                >
                  <template v-slot:icon><BookOutlined class="item_desc_icon" /></template
                ></a-button>
              </a-tooltip>

              <!-- 现在付款���束 -->
              <!-- 确认收货开始-->
              <a-tooltip v-if="order_item.type === 1">
                <template #title> 确定收货 </template>
                <a-button
                  type="primary"
                  shape="circle"
                  :ghost="true"
                  style="margin: 0 10px"
                >
                  <template v-slot:icon
                    ><i class="iconfont">&#xe61b;</i></template
                  ></a-button
                >
              </a-tooltip>

              <!-- 确认收货结束-->
              <!-- 删除订单开始-->
              <a-popconfirm
                v-if="!isShow"
                title="确认要删除此订单吗，确认后不可恢复?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="confirm_order"
              >
                <a-tooltip>
                  <template #title> 删除订单 </template>
                  <a-button
                    type="primary"
                    shape="circle"
                    :ghost="true"
                    style="margin: 0 10px"
                  >
                    <template v-slot:icon
                      ><CloseOutlined class="item_desc_icon" /></template
                  ></a-button>
                </a-tooltip>
              </a-popconfirm>

              <!-- 删除订单结束-->
            </div>
          </div>
        </div>
        <div class="content">
          <div class="titel">商品详情</div>
          <div
            class="order_item"
            v-for="(item, index) in order_item.data_list"
            :key="index + 'order_item'"
          >
            <div class="item_img">
              <img @click="goGoodInfo(item)" v-lazy="{ src: item.img }" alt="" />
            </div>
            <div class="item_name">
              <span class="ellipsis">{{ item.name }}</span>
            </div>
            <div class="item_info">
              <div class="item_style">款式：{{ item.style }}</div>
              <div class="item_size" v-if="item.size">尺寸：{{ item.size }}</div>
            </div>
            <div class="item_laer">
              <div class="item_price">
                小计合价格：{{ Number(item.price * item.suplist_num).toFixed(2) }}
              </div>
              <div class="item_num">数量：{{ item.suplist_num }}</div>
            </div>
          </div>
        </div>
        <div class="address" v-if="!isShow">
          <div class="titel">收货地址</div>
          <div class="address_content">
            <div class="address_top">
              <p class="name">姓名：{{ order_item.name }}</p>
              <p class="phone">联系方式：{{ order_item.phone }}</p>
            </div>
            <div class="address_bot">
              <p class="address_asc">地址：{{ order_item.address }}</p>
              <p class="address_info">地址详情：{{ order_item.address_info }}</p>
            </div>
          </div>
        </div>
        <div class="order_more" v-if="order_item.type !== 0">
          <div class="titel">订单详情</div>
          <div class="order_more_warp">
            <div class="nickNmae">
              <p>用户昵称：</p>
              <p>{{ order_item.userNickName }}</p>
            </div>
            <div class="price">
              <p>金额：</p>
              <p>{{ order_item.pirce }}</p>
            </div>
            <div class="pirce_info">
              <p>选择的套餐：</p>
              <p>{{ order_item.price }}</p>
            </div>
            <div class="payType">
              <p>支付方式：</p>
              <p>{{ order_item.payType }}</p>
            </div>
            <div class="mobile">
              <p>是否为移动端：</p>
              <p>{{ order_item.mobile }}</p>
            </div>
            <div class="mesg">
              <p>留言：</p>
              <p>{{ order_item.mesg }}</p>
            </div>
            <div class="play_time">
              <p>创建订单时间：</p>
              <p>{{ order_item.play_time }}</p>
            </div>
          </div>
        </div>
      </template>
    </my-titel>
  </div>
</template>

<script>
import { watch, computed, onMounted, reactive, toRefs, getCurrentInstance } from "vue";
import MyTitel from "@/components/my_titel/index.vue";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { BookOutlined, CloseOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    MyTitel,
    BookOutlined,
    CloseOutlined,
  },
  props: {
    order_item: {
      type: Object,
    },
    isShow: {
      type: Boolean,
      difall: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      count: 0,
      stepStyle: {
        marginBottom: "60px",
        boxShadow: "0px -1px 0 0 #e8e8e8 inset",
      },
    });
    onMounted(() => {});
    const isShow = computed(() => {
      if (Object.keys(props.order_item).length === 0) {
        return false;
      } else {
        return true;
      }
    });
    const timeNum = (time) => {
      let times = time;
      const arr = arrnNuber(times.match(/\d+/g)); // 数组字符串返回数组 数字类型
      const nowTime = arrnNuber(getTime().match(/\d+/g)); // 数组字符串返回数组 数字类型
      const arrs = alls(arr);
      const nowTimes = alls(nowTime);
      const nowLaer = nowTimes - arrs;
      //判断订单是否大于1天
      if (nowLaer >= 86400000) {
        // console.log('订单大于1天')
      } else {
        const num = 86400000 - nowLaer;
        if (num === 0) {
          // console.log('订单大于1天')
          return 0;
        } else {
          // console.log('订单不大于1天')
          return Date.now() + num;
        }
      }
    };
    // 返回秒
    const alls = (arr) => {
      const oid = new Date();
      oid.setFullYear(arr[0], arr[1], arr[2]);
      oid.setHours(arr[3]);
      oid.setMinutes(arr[4]);
      oid.setSeconds(arr[5]);
      return oid.getTime();
    };
    // 数组字符串返回数组 数字类型
    const arrnNuber = (x) => {
      const arr = [];
      for (let i = 0; i < x.length; i++) {
        arr.push(letterNuber(x[i]));
      }
      return arr;
    };
    // 返回数字
    const letterNuber = (x) => {
      const num1 = Number(parseInt(x));
      return num1;
    };
    const getTime = () => {
      let time = new Date();
      const year = time.getFullYear();
      const Month = time.getMonth() + 1;
      const date = time.getDate();
      const Hours = time.getHours();
      const Minutes = time.getMinutes();
      const Seconds = time.getSeconds();
      return `${year}-${towNum(Month)}-${towNum(date)} ${towNum(Hours)}:${towNum(
        Minutes
      )}:${towNum(Seconds)}`;
    };

    const towNum = (num) => {
      return num < 10 ? "0" + num : num;
    };
    const handelchange = () => {
      context.emit("updata");
    };
    const confirm_order = async () => {
      const res = await proxy.$http.post("/api/dellOrder", {
        data: props.order_item,
      });
      if (res.data.success === true) {
        message.info("删除成功");
        context.emit("updata");
      } else {
        message.error("删除失败");
      }
    };
    const goGoodInfo = (item) => {
      // console.log(item)
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
      isShow,
      handelchange,
      timeNum,
      confirm_order,
      goGoodInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.order_more {
  width: 100%;
  padding: 0 100px 30px;
  .nickNmae,
  .price,
  .pirce_info,
  .payType,
  .mobile,
  .mesg,
  .play_time {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 10px 0;
    font-size: 16px;
  }
  .nickNmae {
  }
  .price {
  }
  .pirce_info {
  }
  .payType {
  }
  .mobile {
  }
  .mesg {
  }
  .play_time {
  }
}
.titel {
  font-size: 22px;
  margin-top: 30px;
  padding: 2px 10px;
  background-color: $ee;
  border-radius: 4px;
}
.address {
  width: 100%;
  padding: 0 100px 20px;
  .address_content {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    .address_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      .name {
        width: 100%;
        margin: 5px 0 !important;
      }
      .phone {
        width: 100%;
        margin: 5px 0 !important;
      }
    }

    .address_bot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      .address_asc {
        width: 100%;
        margin: 5px 0 !important;
      }
      .address_info {
        margin: 5px 0 !important;
        width: 100%;
      }
    }
  }
}
.content {
  width: 100%;
  padding: 0 100px;
  .order_item {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1px solid $xt;
    .item_img {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .item_name {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 20px;
      cursor: pointer;
      span {
        width: 500px;
        display: inline-block;
      }
    }
    .item_laer,
    .item_info {
      width: 180px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      .item_style {
      }
      .item_size {
      }
      .item_price {
      }
      .item_num {
      }
    }
  }
}

.top {
  width: 100%;
  margin-top: 40px;
  padding: 0 100px;
}
.desc {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 30px;
  .desc_left {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .desc_right {
  }
}
</style>
