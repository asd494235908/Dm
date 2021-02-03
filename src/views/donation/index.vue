<template>
  <div>
    <MyHerder></MyHerder>
    <div class="donation_warp">
      <div class="limit">
        <div class="desc">
          祝捐赠者：一帆风顺，两全其美，三山五岳，四平八稳，五谷丰登，六六大顺，七窍玲珑，八面驶风，九九归原，十全十美。<br />天天做新郎，天天换新娘，夜夜入���房。走遍天下都有丈母娘
        </div>
        <div class="donation">
          <MyTitel title="捐赠名单">
            <template v-slot:content>
              <div class="donation_top">
                <div class="nickeName">
                  <p class="text">昵称</p>
                  <div class="icons">
                    <UpOutlined @click="chanheIndex(1)" class="icon" /><DownOutlined
                      @click="chanheIndex(2)"
                      class="icon"
                    />
                  </div>
                </div>
                <div class="payType">
                  <p class="text">捐赠方式</p>
                  <div class="icons">
                    <UpOutlined @click="chanheIndex(3)" class="icon" /><DownOutlined
                      @click="chanheIndex(4)"
                      class="icon"
                    />
                  </div>
                </div>
                <div class="price">
                  <p class="text">捐赠金额</p>
                  <div class="icons">
                    <UpOutlined @click="chanheIndex(5)" class="icon" /><DownOutlined
                      @click="chanheIndex(6)"
                      class="icon"
                    />
                  </div>
                </div>
                <div class="price_text">
                  <p class="text">捐赠者留言</p>
                </div>
                <div class="time">
                  <p class="text">捐赠时间</p>
                  <div class="icons">
                    <UpOutlined class="icon" @click="chanheIndex(7)" /><DownOutlined
                      @click="chanheIndex(8)"
                      class="icon"
                    />
                  </div>
                </div>
              </div>
              <div class="order_data">
                <div
                  class="rder_item"
                  v-for="(item, index) in order_Data"
                  :key="index + 'reder_item'"
                >
                  <div class="nickeName">{{ item.name }}</div>
                  <div class="payType">{{ item.payType }}</div>
                  <div class="price">{{ Number(item.pirce).toFixed(2) }}</div>
                  <div class="price_text">
                    <span class="ellipsis">{{ item.mesg }}</span>
                  </div>
                  <div class="time">{{ item.time }}</div>
                </div>
                <div class="logding" v-if="donationload">
                  <a-spin :spinning="donationload" size="large" tip="加载中..."></a-spin>
                </div>
              </div>
              <div class="bottom">
                <span class="text"> 共{{ total }}条捐赠数据</span>
                <a-config-provider :locale="locale">
                  <a-pagination
                    size="small"
                    :total="total"
                    v-model:current="page"
                    v-model:pageSize="size"
                    :defaultPageSize="10"
                    :pageSizeOptions="['10', '30', '60']"
                    show-size-changer
                    show-quick-jumper
                    @change="pageChane"
                    @showSizeChange="sizeChange"
                  />
                </a-config-provider>
              </div>
            </template>
          </MyTitel>
        </div>
        <div class="info_warp">
          <MyTitel title="赞助DcMm">
            <template v-slot:content>
              <div class="info_conttnet">
                DcMm是采用 vue3.0 前后端分离项目，免费开源。<br />
                为了项目能够健康持续的发展下去，我们期望获得相应的资金支���。<br />
                你可以通过订单支付页面通过捐赠的方式来赞助我们进行开发
              </div></template
            ></MyTitel
          >
        </div>
      </div>
    </div>
    <!-- <a-button type="primary">  -->
    <!-- <a target="_blank" :href="isQQlogin">Primary</a> -->
    <!-- </a-button> -->
    <page-bottom></page-bottom>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, getCurrentInstance, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UpOutlined, DownOutlined } from "@ant-design/icons-vue";
import PageBottom from "@/components/page_bottom/index.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import MyHerder from "@/components/my_herder/herder.vue";
import MyTitel from "@/components/my_titel/index.vue";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      locale: zhCN,
    };
  },
  components: {
    MyHerder,
    MyTitel,
    UpOutlined,
    DownOutlined,
    PageBottom,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      order_Data: [],
      page: 1,
      size: 10,
      index: 7,
      total: 0,
      donationload: true,
    });
    onMounted(() => {
      initData();
    });
    const isQQlogin = computed(() => {
      const id = getRandomString(16);
      return `https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101929517&redirect_uri=https://www.dcmaomi.com:3000/api/webqq&state=${id}&scope=get_user_info,list_album,upload_pic`;
    });
    const initData = async () => {
      state.donationload = true;
      const res = await proxy.$http.post("/api/Donation", {
        page: state.page,
        size: state.size,
        index: state.index,
      });
      if (res.data.success === true) {
        state.order_Data = res.data.data;
        state.total = res.data.total;
        nextTick(() => {
          state.donationload = false;
        });
        // console.log(state.total);
      } else {
        message.error("获取数据失败即将返回上一页");
      }
    };
    const getRandomString = (n) => {
      var str = "";
      while (str.length < n) {
        str += Math.random().toString(36).substr(2);
      }
      return str.substr(str.length - n);
    };
    const _back = () => {
      setTimeout(() => {
        router.go(-1);
      }, 2000);
      message.error("参数错误，即将返回上一页");
    };
    const chanheIndex = (index) => {
      if (state.index === index) return;
      state.index = index;
      initData();
    };
    const pageChane = () => {
      initData();
    };
    const sizeChange = () => {
      initData();
    };
    return {
      ...toRefs(state),
      chanheIndex,
      pageChane,
      sizeChange,
      isQQlogin,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.logding {
  height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.donation_warp {
  width: 100%;
  margin-top: 60px;
  .limit {
    width: 1200px;
    margin: 0 auto;
    .info_warp {
      width: 100%;
      margin-top: 60px;
      border-radius: 4px;
      background-color: $cf;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);
      .info_conttnet {
        width: 100%;
        padding: 10px;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 36px;
      }
    }
    .order_data {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .rder_item {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid $xt;
        div + div {
          border-left: 1px solid $xt;
        }
        .nickeName,
        .payType,
        .price,
        .price_text,
        .time {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          span {
            display: inline-block;
            width: 220px;
            text-align: center;
          }
        }
      }
    }

    .desc {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    .bottom {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      .text {
        font-size: 16px;
      }
    }
    .donation {
      width: 100%;
      margin-top: 60px;
      border-radius: 4px;
      background-color: $cf;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);

      .donation_top {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid $xt;
        .payType,
        .price,
        .price_text,
        .time,
        .nickeName {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .text {
            font-size: 15px;
            font-weight: bold;
          }
        }

        .icons {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin: 0 10px;
          .icon:hover {
            color: $c9;
          }
          .icon {
            font-size: 12px;
          }
        }
      }

      .payType {
      }
      .price {
      }
      .price_text {
      }
      .time {
      }
    }
  }
}
</style>
