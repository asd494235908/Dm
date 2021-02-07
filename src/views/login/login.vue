<template>
  <div class="warp">
    <div class="warp_box">
      <div class="warp_box_left"></div>
      <div class="warp_box_right">
        <div class="login_warp">
          <div class="logo">
            <img src="../../../public/static/img/logo.png" alt="" />
          </div>
          <div class="decs"><span>DcMm</span> <span>欢迎登录</span></div>
          <div class="content">
            <form>
              <div class="user_Name">
                <UserOutlined class="icon" />
                <a-input
                  v-model:value="user_Name"
                  placeholder="请输入您的账号"
                  allow-clear
                  :style="{ borderColor: user_Name_Border }"
                  @change="onUserChange"
                  size="large"
                />
              </div>
              <div class="user_Password">
                <LockOutlined class="icon" />
                <a-input-password
                  v-model:value="user_Password"
                  allow-clear
                  :style="{ borderColor: user_Password_Border }"
                  placeholder="请输入您的密码"
                  size="large"
                />
              </div>
              <span class="user_Password_desc" v-if="pass_erorr">密码输入错误</span>
              <div class="desc">
                <div class="desc_left">
                  <a-checkbox
                    v-model:checked="checked_Value"
                    style="margin-left: 4px"
                    @change="onChangeChecked"
                  >
                  </a-checkbox>
                  <span style="margin-left: 6px">记住密码</span>
                </div>
                <div class="desc_right">
                  <span class="noPassWord" @click="openNotification('info')"
                    >忘记密码?</span
                  >
                  <i class="i">|</i>
                  <span class="registerUser" @click="inuser">注册账号</span>
                </div>
              </div>
              <div class="VerificationCode">
                <div class="img_svg" v-html="login_Svg" @click="vipiSVG"></div>
                <div class="img_pas">
                  <a-input
                    v-model:value="login_nopas"
                    size="large"
                    placeholder="请输入验证码"
                    :style="{ borderColor: login_nopas_border }"
                  />
                  <span v-if="svg_erorr" style="color: red">验证码输入错误</span>
                </div>
              </div>
              <a-button
                type="primary"
                size="large"
                block
                :loading="false"
                @click="shubLogIn"
                >登录</a-button
              >
              <a-divider>更多登陆方式</a-divider>
              <div class="more_login">
                <a :href="qqlogin" target="_blank" rel="noopener noreferrer"
                  ><img src="../../../public/static/img/Connect_logo_3.png" alt=""
                /></a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="loading" v-if="handelload">
    <a-spin :spinning="handelload" size="large" tip="加载中..."></a-spin>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, getCurrentInstance, nextTick, computed } from "vue";
import { notification, message } from "ant-design-vue";
import { getStore, setStore, removeStore } from "@/utils/storage.js";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { UserOutlined, LockOutlined, QqOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    UserOutlined,
    LockOutlined,
    QqOutlined,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      handelload: true,
      user_Name: "",
      user_Password: "",
      user_Name_Border: "",
      user_Password_Border: "",
      checked_Value: false,
      login_Svg: "",
      login_pas: "",
      login_nopas: "",
      login_nopas_border: "",
      pass_erorr: false,
      svg_erorr: false,
      localUser: {
        time: "",
        checked: false,
        name: "",
        pas: "",
      },
    });
    const imgArr = [
      require("../../../public/static/img/login_bg.png"),
      require("../../../public/static/img/login_bg_active.png"),
    ];
    onMounted(() => {
      vipiSVG();
      getUser();
      nextTick(() => {
        const imgesAll = imgArr.map((item) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = item;
            img.onload = () => {
              resolve(item);
            };
            img.onerror = () => {
              reject(new Error(item + "失败"));
            };
          });
        });
        Promise.all(imgesAll)
          .then(() => {
            state.handelload = false;
            openNotification("info");
          })
          .catch(() => {
            // store.commit("seveMask", false);
          });
      });
    });
    const onUserChange = () => {};
    const qqlogin = computed(() => {
      return `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${101935386}&redirect_uri=${encodeURIComponent(
        "https://www.dcmaomi.com:3000/api/webqq"
      )}&state=aaa&scope=scope=get_user_info`;
    });
    //获取用户本地密码
    const getUser = () => {
      let key = getStore("DcMmkey");
      key = JSON.parse(key);
      if (key !== null) {
        if (Number(timeNum()) - Number(key.time) > 432000000) {
          message.error("密码已失效");
          return;
        }
        state.checked_Value = key.checked;
        state.user_Name = key.name;
        state.user_Password = key.pas;
      }
    };
    const timeNum = () => {
      const time = new Date().getTime();
      return time;
    };
    //是否记住密码
    const onChangeChecked = () => {
      if (!state.checked_Value) {
        removeStore("DcMmkey");
      }
    };
    //登录
    const shubLogIn = () => {
      if (state.user_Name === "") {
        message.error("请输入账号");
        return;
      }
      if (state.user_Password === "") {
        message.error("请输入密码");
        state.user_Password_Border = "red";
        return;
      }
      if (state.login_nopas === "") {
        message.error("请输入验证码");
        state.user_Password_Border = "";
        state.login_nopas_border = "red";
        return;
      }
      if (state.login_nopas === state.login_pas) {
        state.login_nopas_border = "";
        // console.log("发送请求");

        login();
      } else {
        message.error("验证码错误");
        vipiSVG();
        state.login_nopas_border = "red";
      }
      if (state.checked_Value) {
        state.localUser.time = timeNum();
        state.localUser.name = state.user_Name;
        state.localUser.pas = state.user_Password;
        state.localUser.checked = state.checked_Value;
        setStore("DcMmkey", state.localUser);
        // console.log("记住密码");
      } else {
        removeStore("DcMmkey");
        // console.log("bu记住密码");
      }
    };
    const login = async () => {
      const res = await proxy.$http.post("/api/Login", {
        userInfo: {
          username: state.user_Name,
          pwd: state.user_Password,
        },
      });
      if (res.data.success === true) {
        //判断本地否有购物车数据
        let localCart = new Promise((ru, rj) => {
          const cart = getStore("good_cart");
          if (cart === null) {
            rj();
          } else {
            ru();
          }
        });
        localCart
          .then(() => {
            const cart = getStore("good_cart");
            let data = JSON.parse(cart);
            const uid = res.data.data.uid;
            const picsAll = data.map((item) => {
              return new Promise(async (resolve, reject) => {
                const res = await proxy.$http.post("/api/GoodItem", {
                  isWeb: true,
                  isAdd: true,
                  uid,
                  data: item,
                });
                if (res.data.success === true) {
                  resolve();
                } else {
                  reject(new Error("失败"));
                }
              });
            });
            Promise.all(picsAll)
              .then(() => {
                //购物车加载上传完毕
                removeStore("good_cart");
                //储存数据
                seveUser_Info(res);
                router.push({
                  path: route.query.redirect ? route.query.redirect : "/",
                });
                // console.log(route.query);
              })
              .catch((e) => {
                //失败时打印 错误信息
                // console.log(e);
              });
          })
          .catch(() => {
            //储存数据
            seveUser_Info(res);
            router.push({
              path: route.query.redirect ? route.query.redirect : "/",
            });
          });
        // console.log(res.data.data);
      } else {
        message.error("密码输入错误");
        vipiSVG();
        state.user_Password_Border = "red";
        state.pass_erorr = true;
      }
    };
    const seveUser_Info = (res) => {
      setStore("my_token", res.data.token);
      store.commit("seveLogin", res.data.data);
      store.commit("modifyLogin", true);
    };
    // 获取验证码
    const vipiSVG = async () => {
      const res = await proxy.$http.post("/api/verification");
      state.login_Svg = res.data.data;
      state.login_pas = res.data.text;
      // state.login_nopas = res.data.text;
    };
    const openNotification = (type) => {
      notification[type]({
        message: "提示",
        description: "游客账号test,密码test",
      });
    };
    const inuser = () => {
      message.warning("暂未开放此功能");
    };
    return {
      ...toRefs(state),
      onUserChange,
      onChangeChecked,
      shubLogIn,
      openNotification,
      vipiSVG,
      inuser,
      qqlogin,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.icon {
  color: #ff9344;
  font-size: 20px;
  margin-right: 10px;
}
.more_login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
}
.icon_qq {
  font-size: 30px;
  color: rgb(66, 153, 254);
  cursor: pointer;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: $cf;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.warp {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("../../../public/static/img/login_bg.png") no-repeat top center;
  background-size: cover;
  .desc_left {
    user-select: none;
  }
  .warp_box {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .warp_box_left {
    width: 588px;
    height: 610px;
    background: url("../../../public/static/img/login_bg_active.png") no-repeat top center;
    background-size: cover;
  }
  .login_warp {
    width: 500px;
    height: 610px;
    // border-radius: 10px;
    // box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: $cf;
    .logo {
      width: 60px;
      height: 60px;
      margin-top: 30px;
      background-color: $cf;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .decs {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-top: 20px;
      font-size: 24px;
      letter-spacing: 10px;
    }
    .content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      form {
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-direction: column;
      }
      .VerificationCode {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        margin-bottom: 20px;
        .img_svg {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .img_pas {
          margin-left: 30px;
        }
      }
      .user_Password_desc {
        margin-left: 30px;

        color: red;
        width: 100%;
      }
      .desc {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        margin-bottom: 20px;
        .desc_right {
          span:hover {
            color: #ff9344;
            cursor: pointer;
          }
          i {
            margin: 0 6px;
          }
          span {
          }
        }
      }
      .user_Name {
        margin: 30px 0;
      }
      .user_Password {
        margin-bottom: 4px;
      }
      .user_Name,
      .user_Password {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
