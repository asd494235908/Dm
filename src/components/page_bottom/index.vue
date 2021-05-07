<template>
  <div class="bottom_warp">
    <div class="limit">
      <div class="bottom_warp_items">
        <ul class="bottom_warp_item">
          <h3 class="items_titel">更多项目</h3>
          <li class="item_link">
            <a href="https://dcpay.dcmaomi.com" target="_blank">DcPay支付</a>
          </li>
          <li class="item_link">
            <a href="https://dmh5.dcmaomi.com/" target="_blank">移动DM商城</a>
          </li>

          <li class="item_link">
            <a href="https://tm.dcmaomi.com/" target="_blank">DM后台管理</a>
          </li>
          <li class="item_link">
            <a href="https://dcpay.dcmaomi.com/Mobile" target="_blank">移动APP</a>
          </li>
        </ul>
        <ul class="bottom_warp_item">
          <h3 class="items_titel">上线项目</h3>
          <li class="item_link">
            <a href="https://yh.dcmaomi.com/index.html#/" target="_blank">喜物圈商城</a>
          </li>
          <li class="item_link">
            <a href="https://yh.dcmaomi.com/store/#/index" target="_blank"
              >喜物圈商城后台管理</a
            >
          </li>
        </ul>
        <ul class="bottom_warp_item">
          <h3 class="items_titel">友情链接</h3>
          <li class="item_link">
            <a href="https://www.vue3js.cn/docs/zh/" target="_blank">Vue.js</a>
          </li>
          <li class="item_link">
            <a href="https://2x.antdv.com/docs/vue/introduce-cn/" target="_blank"
              >Ant Design Vue</a
            >
          </li>

          <li class="item_link">
            <a href="https://element.eleme.cn/#/zh-CN" target="_blank">Element Ui</a>
          </li>
          <li class="item_link">
            <a href="https://uniapp.dcloud.io/README" target="_blank">Uni-App</a>
          </li>
          <li class="item_link">
            <a href="https://uviewui.com/" target="_blank">uView</a>
          </li>
        </ul>
        <div class="bottom_warp_icons">
          <a href=" https://github.com/asd494235908/Dm" target="_blank" class="icon_warp"
            ><GithubOutlined class="icon"
          /></a>
          <div class="icon_warp" @mouseout="iconOut" @mouseover="iconIn">
            <QqOutlined class="icon qqicon" />

            <div class="img" v-show="isImg">
              <img src="../../../public/static/img/qqimg.png" alt="" />
            </div>
          </div>
        </div>
        <div class="bottom_letme">
          <h3 class="bottom_letme_titel">QQ：494235908</h3>
          <p class="bottom_letme_time">周一至周日 10:00-22:00</p>
          <p class="bottom_letme_help" @click="handelImgs">寻求帮助</p>
          <p class="bottom_letme_time">
            ps:本站大部分商品图片来源自<a
              href="https://www.smartisan.com/"
              target="_blank"
              >锤子商城</a
            >
          </p>
        </div>
      </div>
      <div class="bottom_laer">
        <p class="copy">
          <a href="https://www.dcmaomi.com" target="_blank">www.dcmaomi.com</a
          ><span>©2020--Present. All Rights Reserved</span>
        </p>
        <p class="beian">
          <a href="http://beian.miit.gov.cn" target="_blank">蜀ICP备2020033541号</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { GithubOutlined, QqOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    GithubOutlined,
    QqOutlined,
  },
  setup() {
    const state = reactive({
      count: 0,
      isImg: false,
    });
    const iconIn = () => {
      state.isImg = true;
    };
    const iconOut = () => {
      state.isImg = false;
    };
    const handelImgs = () => {
      state.isImg = true;
      setTimeout(() => {
        state.isImg = false;
      }, 5000);
    };
    return {
      ...toRefs(state),
      iconIn,
      iconOut,
      handelImgs,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.bottom_warp {
  width: 100%;
  margin-top: 60px;
  background-color: $head-bgc;
  .limit {
    width: 1200px;
    margin: 0 auto;
    .bottom_warp_icons {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      .icon_warp {
        position: relative;

        .img {
          position: absolute;
          display: block;
          top: -280px;
          left: 50%;
          background: $cf;
          padding: 10px;
          box-shadow: 0 0px 4px rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          transform: translateX(-50%);
        }
        .img::after {
          content: "";
          position: absolute;
          top: 270px;
          left: 50%;
          transform: translateX(-50%) rotate(180deg);
          width: 0;
          height: 0;
          border-width: 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent $cf;
        }
      }
      .icon {
        margin: 0 20px;
        font-size: 30px;
        color: $cf;
        cursor: pointer;
      }
    }

    .bottom_warp_items {
      padding: 20px 0;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .bottom_warp_item {
        margin: 0 40px;
        .item_link {
          margin: 10px 0;
          a {
            color: $ee;
          }
        }
        .items_titel {
          font-size: 16px;
          color: $cf;
        }
      }
      .bottom_letme {
        color: $cf;
        .bottom_letme_titel {
          font-size: 22px;
          font-weight: bold;
          color: $cf;
          letter-spacing: 2px;
          text-align: end;
        }
        .bottom_letme_time {
          text-align: end;
          a {
            color: $cf;
          }
        }
        .bottom_letme_help {
          border: solid 1px $cf;
          text-align: center;
          border-radius: 4px;
          height: 40px;
          font-size: 16px;
          font-weight: bold;
          line-height: 40px;
          margin: 15px 0 !important;
          cursor: pointer;
          user-select: none;
        }
      }
    }
  }
}
.bottom_laer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: $ee;
  a {
    color: $ee;
  }
  .copy {
    margin: 10px !important;
    span {
      margin: 0 20px;
    }
  }
  .beian {
    margin: 10px !important;
  }
}
</style>
