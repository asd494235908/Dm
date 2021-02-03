<template>
  <div class="order_item_xxx">
    <div class="order_item_titel">
      <div class="order_id">订单编号：{{ order_item.oder_id }}</div>
      <div class="order_time">提交时间：{{ order_item.time }}</div>
      <div class="order_time_desc">
        <span v-if="order_item.type === 0">订单将于</span>
        <div v-if="order_item.type === 0">
          <a-statistic-countdown
            :value="timeNum(order_item.time)"
            format="H 时 m 分 s 秒"
            class="timer"
            valueStyle="color:#f05247;font-size:14px"
            @finish="handelchange"
          />
        </div>
        <span v-if="order_item.type === 0">后失效</span>
      </div>
      <div class="order_dom">操作</div>
    </div>
    <div class="order_item_laer">
      <div class="order_item_left">
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
      <div class="order_item_right">
        <!-- 现在付款开始 -->
        <a-tooltip v-if="order_item.type === 0">
          <template #title> 现在付款 </template>
          <a-button
            type="primary"
            shape="circle"
            :ghost="true"
            style="margin: 0 10px"
            @click="goUpDataOrder"
          >
            <template v-slot:icon><BookOutlined class="item_desc_icon" /></template
          ></a-button>
        </a-tooltip>

        <!-- 现在付款结束 -->
        <!-- 查看订单开始 -->
        <a-tooltip>
          <template #title> 查看订单 </template>
          <a-button
            type="primary"
            shape="circle"
            @click="goOrder_list"
            :ghost="true"
            style="margin: 0 10px"
          >
            <template v-slot:icon><ZoomInOutlined class="item_desc_icon" /></template
          ></a-button>
        </a-tooltip>

        <!-- 查看订单结束 -->
        <!-- 确认收货开始-->
        <a-tooltip v-if="order_item.type === 1">
          <template #title> 确定收货 </template>
          <a-button type="primary" shape="circle" :ghost="true" style="margin: 0 10px">
            <template v-slot:icon><i class="iconfont">&#xe61b;</i></template></a-button
          >
        </a-tooltip>

        <!-- 确认收货结束-->
        <!-- 删除订单开始-->
        <a-popconfirm
          v-if="order_item.type !== 1"
          title="确认要删除此订单吗，确认后不可恢复?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="confirm_order"
        >
          <a-tooltip>
            <template #title> 删除订单 </template>
            <a-button type="primary" shape="circle" :ghost="true" style="margin: 0 10px">
              <template v-slot:icon><CloseOutlined class="item_desc_icon" /></template
            ></a-button>
          </a-tooltip>
        </a-popconfirm>

        <!-- 删除订单结束-->
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from "vue";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { BookOutlined, ZoomInOutlined, CloseOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    BookOutlined,
    ZoomInOutlined,
    CloseOutlined,
  },
  props: {
    order_item: {
      type: Object,
    },
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      count: 0,
      deadline: 81481000,
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
    const goOrder_list = () => {
      router.push({
        path: "/orderList",
        query: {
          order_id: props.order_item.oder_id,
        },
      });
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
    //去付款页面
    const goUpDataOrder = () => {
      router.push({
        path: "/UpDataOrder",
        query: {
          order_id: props.order_item.oder_id,
        },
      });
    };
    return {
      ...toRefs(state),
      timeNum,
      handelchange,
      confirm_order,
      goOrder_list,
      goGoodInfo,
      goUpDataOrder,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.order_item_xxx {
  width: 100%;
  border-bottom: 1px solid $xt;
  .order_item_laer {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .order_item_left {
      flex: 3;
      border-right: 1px solid $xt;
      .order_item {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // border-bottom: 1px solid $xt;
        margin-top: 30px;
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
          margin-left: 10px;
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
            width: 250px;
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
    .order_item_right {
      flex: 1;
      height: 150px;
      border-bottom: 1px solid $xt;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .order_item_titel {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $ee;
    padding: 0 10px;
    height: 40px;
    .order_id {
    }
    .order_time {
    }
    .order_dom,
    .order_id,
    .order_time,
    .order_time_desc {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .order_dom {
    }
  }
}
</style>
