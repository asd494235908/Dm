<template>
  <div class="user_Info_Warp">
    <div class="user_img">
      <h3 class="img_titel">头像</h3>
      <div class="content">
        <a-tooltip v-if="isPIC">
          <template #title> 点击修改头像 </template>
          <a-avatar
            :size="60"
            shape="square"
            class="img_content"
            :src="LogIn_User_Info.img"
            @click="modiufindePic"
          >
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </a-tooltip>
        <a-upload
          v-else
          v-model:fileList="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :headers="headers"
          :show-upload-list="false"
          :directory="false"
          :before-upload="beforeUpload"
          :withCredentials="false"
          @change="handleChange"
          :customRequest="customRequest"
          ic
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <!-- todo -->
            <loading-outlined v-if="loading" />
            <plus-outlined v-else />
            <div class="ant-upload-text">上传头像</div>
          </div>
        </a-upload>
      </div>
    </div>
    <div class="user_nickname">
      <h3 class="nickname_titel">昵称</h3>
      <div class="nickname_content">
        <a-input
          v-model:value="nickname"
          allowClear
          placeholder="请输入您的昵称"
        />
      </div>
    </div>
    <div class="user_nickname">
      <h3 class="nickname_titel">个性签名</h3>
      <div class="nickname_content">
        <a-textarea
          v-model:value="user_autograph"
          placeholder="展示你的个性"
          auto-size
          showCount
          allowClear
          :maxlength="100"
        />
      </div>
    </div>
    <div class="user_sex">
      <h3 class="sex_titel">性别</h3>
      <div class="sex_content">
        <p class="sex_text">
          <a-radio-group
            class="group"
            :options="sexArr"
            v-model:value="sex"
            @change="onChange1"
          />
        </p>
      </div>
    </div>
    <div class="user_time">
      <h3 class="time_titel">出生年月</h3>
      <div class="time_content">
        <p v-if="isYer">{{ dateString }}</p>
        <a-date-picker
          v-else
          v-model:value="datatime"
          :locale="locale"
          :moment="moment"
          @change="onChangeDate"
        />
        <a-tooltip>
          <template #title> 修改 </template>
          <a-button
            type="primary"
            shape="circle"
            @click="modiufindYer"
            :ghost="true"
            style="margin: 0 10px"
          >
            <template v-slot:icon
              ><EditOutlined class="item_desc_icon" /></template
          ></a-button>
        </a-tooltip>
      </div>
    </div>
    <div class="submint_user_info">
      <a-button
        size="large"
        shape="round"
        type="primary"
        @click="handelSubInfo"
      >
        提交
      </a-button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, toRefs, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import {
  RightOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
moment.locale("zh-cn");
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  components: {
    LoadingOutlined,
    PlusOutlined,
    RightOutlined,
    UserOutlined,
    EditOutlined,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const state = reactive({
      isPIC: true,
      isYer: true,
      moment,
      locale,
      datatime: "",
      dateString: "",
      nickname: "",
      user_autograph: "",
      fileList: [],
      loading: false,
      imageUrl: "",
      sex: "",
      sexArr: [
        { label: "男", value: "男" },
        { label: "女", value: "女" },
      ],
      headers: {
        uid: 0,
      },
    });
    onMounted(() => {
      state.headers.uid = store.state.userInfo.uid;
    });
    //更新user信息
    const _update_userInfo = async () => {
      const res = await proxy.$http.post("/api/validate", {});
      const data = res.data;
      if (data.success === true) {
        store.commit("seveLogin", data.data);
      } else {
        message.error("跟新数据失败");
      }
    };
    //当前的头像，昵称，签名
    const LogIn_User_Info = computed(() => {
      let data = {
        img: "",
        nick_name: "",
        desc: "",
        sex: "",
      };
      if (store.state.login) {
        if (
          store.state.userInfo.user_img === "null" ||
          store.state.userInfo.user_img === null
        ) {
          data.img = "https://www.dcmaomi.com:3000/serverImage/weidnglu.png";
        } else {
          data.img = store.state.userInfo.user_img;
        }
        if (
          store.state.userInfo.user_name === "null" ||
          store.state.userInfo.user_name === null
        ) {
          data.nick_name = "未设置";
        } else {
          state.nickname = store.state.userInfo.user_name;
          data.nick_name = store.state.userInfo.user_name;
        }
        if (
          store.state.userInfo.user_autograph === "null" ||
          store.state.userInfo.user_autograph === null
        ) {
          data.desc = "未设置";
        } else {
          state.user_autograph = store.state.userInfo.user_autograph;
          data.desc = store.state.userInfo.user_autograph;
        }
        if (
          store.state.userInfo.sex === "null" ||
          store.state.userInfo.sex === null
        ) {
          data.sex = "未设置";
        } else {
          state.sex = store.state.userInfo.sex;
          data.sex = store.state.userInfo.sex;
        }
        if (
          store.state.userInfo.user_time === "null" ||
          store.state.userInfo.user_time === null
        ) {
          state.dateString = "未设置";
        } else {
          state.dateString = store.state.userInfo.user_time;
        }
      } else {
        data.img = "https://www.dcmaomi.com:3000/serverImage/weidnglu.png";
        data.nick_name = "未登录";
        data.desc = "";
      }
      return data;
    });
    const handleChange = (info) => {
      if (info.file.status === "uploading") {
        state.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get state url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          state.imageUrl = imageUrl;
          state.loading = false;
        });
      }
      if (info.file.status === "error") {
        state.loading = false;
      }
    };
    const beforeUpload = (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("只能上传jpg/png格式的头像!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片不得大于2MB!");
      }
      return isJpgOrPng && isLt2M;
    };
    const userInfo = computed(() => {
      if (store.state.login) {
        return store.state.userInfo;
      } else {
        return {};
      }
    });
    const customRequest = (data) => {
      const formData = new FormData();
      formData.append("file", data.file);
      updata(formData);
      //   formData.append("token", "aiufpaidfupipiu"); //随便写一个token示例
    };
    const updata = async (formData) => {
      let config = {
        headers: { uid: state.headers.uid },
      };
      const res = await proxy.$http.post("/api/upload", formData, config);
      if (res.data.status === 200) {
        _update_userInfo();
        state.loading = false;
      }
    };
    //选择性别
    const onChange1 = () => {};
    const onChangeDate = (date, dateString) => {
      state.dateString = dateString;
    };
    const handelSubInfo = async () => {
      if (state.nickname === "") {
        message.error("请输入您的昵称");
        return;
      }
      if (state.sex === "") {
        message.error("请选择您的性别");
        return;
      }
      if (state.dateString === "" || state.dateString === "未设置") {
        message.error("请选择您的出生年月");
        return;
      }
      let data = {
        user_name: state.nickname,
        sex: state.sex,
        user_autograph: state.user_autograph,
        user_time: state.dateString,
        uid: store.state.userInfo.uid,
      };
      const res = await proxy.$http.post("/api/modifyUserInfo", {
        data,
      });
      if (res.data.success === true) {
        _update_userInfo();
        state.isYer = true;
        message.success("修改成功");
      } else {
        message.error("修改失败");
      }
    };
    const modiufindYer = () => {
      state.isYer = !state.isYer;
    };
    const modiufindePic = () => {
      state.isPIC = !state.isPIC;
    };
    return {
      ...toRefs(state),
      userInfo,
      handleChange,
      beforeUpload,
      customRequest,
      LogIn_User_Info,
      onChange1,
      onChangeDate,
      handelSubInfo,
      modiufindYer,
      modiufindePic,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.submint_user_info {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user_Info_Warp::-webkit-scrollbar-thumb:horizontal {
  /*水平滚动条的样式*/
  width: 4px;
  background-color: #cccccc;
  -webkit-border-radius: 6px;
}
.user_Info_Warp::-webkit-scrollbar-track-piece {
  background-color: #fff; /*滚动条的背景颜色*/
  -webkit-border-radius: 0; /*滚动条的圆角宽度*/
}
.user_Info_Warp::-webkit-scrollbar {
  width: 10px; /*滚动条的宽度*/
  height: 8px; /*滚动条的高度*/
}
.user_Info_Warp::-webkit-scrollbar-thumb:vertical {
  /*垂直滚动条的样式*/
  height: 50px;
  background-color: #999;
  -webkit-border-radius: 4px;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 2px solid #fff;
}
.user_Info_Warp::-webkit-scrollbar-thumb:hover {
  /*滚动条的hover样式*/
  height: 50px;
  -webkit-border-radius: 4px;
}
.user_Info_Warp {
  width: 100%;
  .user_time {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $xt;
    padding: 10px 50px;
    .time_titel {
      font-size: 15px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // background-color: $ee;

      border-radius: 4px;
      padding-left: 10px;
      font-size: 15px;
      color: $main-col;
      font-weight: bold;
    }
    .time_content {
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        width: 100px;
      }
    }
  }

  .user_sex {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $xt;
    padding: 10px 50px;
    .sex_titel {
      font-size: 15px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // background-color: $ee;

      border-radius: 4px;
      padding-left: 10px;
      font-size: 15px;
      color: $main-col;
      font-weight: bold;
    }
    .sex_content {
      .sex_text {
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        .group {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .user_nickname {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $xt;
    padding: 10px 50px;
    .nickname_titel {
      font-size: 15px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // background-color: $ee;

      border-radius: 4px;
      padding-left: 10px;
      font-size: 15px;
      color: $main-col;
      font-weight: bold;
    }

    .nickname_content {
      width: 500px;
      z-index: 99;
    }
  }

  .user_img {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $xt;
    padding: 10px 50px;
    .content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .avatar-uploader {
        width: 102px;
        height: 102px;
        margin: 0 15px;
      }
      .img_content {
        cursor: pointer;
        border-radius: 50%;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
      }
    }
    .img_titel {
      font-size: 15px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // background-color: $ee;

      border-radius: 4px;
      padding-left: 10px;
      font-size: 15px;
      color: $main-col;
      font-weight: bold;
    }
  }
}
</style>
