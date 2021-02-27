<template>
  <div class="donation_msg_warp">
    <div class="limit">
      <div class="donation_msg_content">
        <MyTitel title="我要留言">
          <template v-slot:laer>
            <div class="loding_warp">
              <a-spin class="loding" :indicator="indicator" :spinning="loding" />
              <div class="qq_nologin" v-if="nickename === ''">
                <p class="">
                  <span class="qq_login_link" @click="shubLogIn">Login</span> With QQ
                </p>
                <QqOutlined class="icon" />
              </div>
              <div class="qq_login" v-if="nickename !== ''">
                <p class="nickname">{{ nickename }}</p>
                <div class="pic">
                  <a-avatar :src="pic" />
                </div>
                <p class="logout" @click="logout_qq">LogOut</p>
              </div>
            </div>
          </template>
          <template v-slot:content>
            <div class="info_conttnet">
              <a-textarea
                class="info_conttnet_input"
                v-model:value="value2"
                placeholder="留点建议吧~~~"
                :auto-size="{ minRows: 6, maxRows: 9 }"
                :allowClear="true"
                :maxlength="255"
              />
            </div> </template
        ></MyTitel>
      </div>
      <div class="info_btn_warp">
        <a-button
          class="info_btn"
          type="primary"
          @click="submit_mest"
          :loading="btn_loading"
          >提交</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, getCurrentInstance, h, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setStore, getStore, removeStore } from "../../utils/storage.js";
import MyTitel from "@/components/my_titel/index.vue";
import { LoadingOutlined, QqOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
export default {
  components: { MyTitel, QqOutlined },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      nickename: "",
      pic: "",
      loding: false,
      value2: "",
      btn_loading: false,
    });
    onMounted(() => {
      getinof();
    });
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "24px",
      },
      spin: true,
    });
    const initQQLogin = async () => {
      if (route.query.code !== undefined && route.query.code !== "") {
        nextTick(() => {
          //平滑设置滚动条
          const top = document.querySelector(".donation_msg_warp");
          let i = document.documentElement.scrollTop;
          let timer = null;
          timer = setInterval(() => {
            i += 10;
            if (i > top.offsetTop) {
              clearInterval(timer);
              return;
            } else {
              document.documentElement.scrollTop = i;
            }
          }, 0);
        });
        state.loding = true;
        const authCode = route.query.code;
        const res = await proxy.$http.post("/api/webqq", {
          authCode,
          backurl: "https://www.dcmaomi.com/donation",
        });
        if (res.data.success === true) {
          state.nickename = res.data.nickName;
          state.pic = res.data.pic;
          state.loding = false;
          const info_Data = {
            nickename: res.data.nickName,
            pic: res.data.pic,
          };
          setStore("qqInfo", info_Data);
        } else {
          state.loding = false;
          state.nickename = "";
          state.nickename = "";
          message.error("登录已失效");
        }
      } else {
        console.log("未qq登录");
        return;
      }
    };
    const getinof = () => {
      let info = getStore("qqInfo");
      if (info == null || info == "") {
        // console.log("未qq登录");
        initQQLogin();
        return;
      } else {
        info = JSON.parse(info);
        state.nickename = info.nickename;
        state.pic = info.pic;
      }
    };
    const shubLogIn = () => {
      const url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${101937754}&redirect_uri=${encodeURIComponent(
        "https://www.dcmaomi.com/donation"
      )}&state=aaa&scope=scope=get_user_info`;
      window.location.href = url;
    };
    const logout_qq = () => {
      removeStore("qqInfo");
      state.nickename = "";
      state.pic = "";
    };
    const submit_mest = async () => {
      if (state.nickename === "" && state.pic == "") {
        message.error("请使用qq登录");
      } else {
        state.btn_loading = true;
        const res = await proxy.$http.post("/api/submit_mesg", {
          nickename: state.nickename,
          pic: state.pic,
          mesg: state.value2,
        });
        if (res.data.success === true) {
          state.value2 = ""
          message.success("提交成功，感谢您的建议");
          state.btn_loading = false;
        } else {
          message.error("提交失败");
          state.btn_loading = false;
        }
      }
    };
    return {
      ...toRefs(state),
      shubLogIn,
      logout_qq,
      indicator,
      submit_mest,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.donation_msg_warp {
  width: 100%;
  margin-top: 60px;
  .limit {
    width: 1200px;
    margin: 0 auto;
    .info_conttnet {
      width: 100%;
      .info_conttnet_input {
        width: 100%;
      }
    }
    .info_btn_warp {
      position: relative;
      width: 100%;
      height: 90px;
    }
    .info_btn {
      margin: 20px 0;
      position: absolute;
      top: 0;
      right: 0;
    }
    .qq_nologin {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        font-size: 22px;
        margin: 0 10px;
      }
    }
    .qq_nologin,
    .qq_login {
      user-select: none;
      .qq_login_link:hover {
        color: rgba($color: $main-col, $alpha: 0.5);
      }
      .qq_login_link {
        color: $main-col;
      }
      .logout:hover {
        color: rgba($color: $main-col, $alpha: 0.5);
      }
      .logout {
        color: $main-col;
        margin: 0 10px !important;
      }
      .nickname {
        margin: 0 10px !important;
        font-weight: bold;
      }
      .pic {
        margin: 0 10px !important;
      }
    }
    .qq_login {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .donation_msg_content {
      width: 100%;
      margin-top: 60px;
      border-radius: 2px;
      background-color: $cf;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      .loding_warp {
        display: flex;
        align-items: center;
        justify-content: center;
        .loding {
          margin: 20px;
        }
      }
    }
  }
}
</style>
