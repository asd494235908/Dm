<template>
  <div class="address_awrp">
    <div class="address_titel" v-if="address.length !== 0">
      <div class="name">姓名</div>
      <div class="phone">联系方式</div>
      <div class="address">地址</div>
      <div class="address_info">地址详情</div>
      <div class="difall">默认地址</div>
      <div class="desc">操作</div>
    </div>
    <div class="address_item_warp" v-if="address.length !== 0">
      <div class="address_item" v-for="item in address" :key="item.id">
        <div class="name">
          {{ item.name }}
        </div>
        <div class="phone">{{ item.phone }}</div>
        <div class="address">{{ item.address }}</div>
        <div class="address_info">{{ item.address_info }}</div>

        <div class="difall">
          <a-switch
            v-model:checked="item.checked"
            :disabled="item.disabled"
            @change="onchange(item)"
          />
        </div>
        <div class="desc">
          <a-button
            type="primary"
            size="small"
            shape="circle"
            :ghost="true"
            @click="modifyAddress_Item(item)"
            style="margin: 0 10px"
          >
            <template v-slot:icon><EditOutlined class="item_desc_icon" /></template
          ></a-button>
          <a-popconfirm
            placement="rightTop"
            ok-text="确认"
            cancel-text="取消"
            @confirm="isDellAddress_Item"
            @cancel="noDellAddress"
          >
            <template #title>
              <p>确定要删除吗？</p>
            </template>
            <a-button
              type="primary"
              size="small"
              shape="circle"
              :ghost="true"
              @click="dellAddress_Item(item)"
              style="margin: 0 10px"
            >
              <template v-slot:icon><CloseOutlined class="item_desc_icon" /></template
            ></a-button>
          </a-popconfirm>
        </div>
      </div>
      <div class="addAdderss">
        <a-button size="large" shape="round" type="primary" @click="addAdderess">
          <template #icon>
            <PlusOutlined />
          </template>
          添加地址
        </a-button>
      </div>
    </div>
    <div class="address_no" v-if="address.length === 0">
      <div class="address_no_bg">
        <img src="https://s1.ax1x.com/2020/11/01/Bw1ObQ.png" alt="" />
      </div>
      <div class="address_no_text">当前没有收货地址哦</div>
      <div class="address_no_add_address">
        <div class="addAdderss">
          <a-button size="large" shape="round" type="primary" @click="addAdderess">
            <template #icon>
              <PlusOutlined />
            </template>
            添加地址
          </a-button>
        </div>
      </div>
    </div>
    <div
      class="address_mask"
      @touchmove.stop.prevent="() => {}"
      @mousewheel.prevent="navTopSwitch"
      v-if="Address_Mask"
    >
      <div class="address_content">
        <form>
          <h1 v-if="currentAddress.id === null" class="titel">添加地址</h1>
          <h1 v-if="currentAddress.id !== null" class="titel">修改地址</h1>
          <div class="name">
            <i class="iconfont">&#xe605;</i><i class="text">姓名:</i
            ><a-input v-model:value="currentAddress.name" allowClear />
          </div>
          <div class="phone">
            <i class="iconfont">&#xe6be;</i><i class="text">电话:</i>
            <a-input v-model:value="currentAddress.phone" allowClear type="Number" />
          </div>
          <div class="address">
            <i class="iconfont">&#xe62c;</i>
            <i class="text">城市：</i>
            <a-cascader
              v-if="city.length !== 0"
              :options="city"
              v-model:value="currentAddress.faker_address"
              @change="onCityChange"
              :fieldNames="defaultProps1"
              :changeOnSelect="true"
              popupClassName="aaa"
              placeholder="点击开始下拉"
            />
          </div>
          <div class="address_info">
            <i class="iconfont">&#xe6e0;</i><i class="text">详细地址:</i
            ><a-input v-model:value="currentAddress.address_info" allowClear />
          </div>
          <div class="difall">
            <div class="chek">
              <a-checkbox
                v-model:checked="currentAddress.checked"
                style="margin: 0 10px"
              ></a-checkbox
              >是否设为默认地址
            </div>
          </div>
          <div class="desc">
            <a-button @click="clerAddress"> 取消 </a-button
            ><a-button type="primary" @click="subAddress"> 确定 </a-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { EditOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons-vue";
export default {
  components: { EditOutlined, CloseOutlined, PlusOutlined },
  setup() {
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      address: [],
      order_id: null,
      city: [],
      Address_Mask: false,
      isDell: null,
      defaultProps1: {
        label: "name",
        value: "name",
        children: "districts",
      },
      currentAddress: {
        faker_address: ["四川省", "成都市", "新津区"],
        address: "",
        address_info: "",
        checked: false,
        difall: 1,
        disabled: false,
        id: null,
        name: "",
        phone: "",
        uid: 0,
      },
    });
    onMounted(() => {
      initAddress();
      initCity();
    });
    const initAddress = () => {
      state.address = store.state.userInfo.address;
      state.address.forEach((item) => {
        item.disabled = false;

        if (item.difall === 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      if (route.query.order_id !== undefined && route.query.order_id !== "") {
        state.order_id = Number(route.query.order_id);
      }
    };
    const initCity = async () => {
      const res = await proxy.$http.get("/api/city");
      if (res.data.success === true) {
        state.city = res.data.data;
      } else {
        message.error("获取城市列表失败");
      }
      // console.log(state.city);
    };
    const onchange = (item) => {
      item.disabled = true;
      if (item.checked) {
        item.difall = 0;
      } else {
        item.difall = 1;
      }
      _submirAddress(item);
    };
    //提交用户的地址
    const _submirAddress = async (item) => {
      // console.log(item)
      const res = await proxy.$http.post("/api/subAddress", {
        data: item,
        order_id: state.order_id,
      });
      if (res.data.success === true) {
        _update_userInfo();
        message.success("修改成功");
        state.Address_Mask = false;
        state.currentAddress = {
          faker_address: ["四川省", "成都市", "新津区"],
          address: "",
          address_info: "",
          checked: false,
          difall: 1,
          disabled: false,
          id: null,
          name: "",
          phone: "",
          uid: 0,
        };
      } else {
        message.error("修改失败");
      }
    };
    //更新user信息
    const _update_userInfo = async () => {
      const res = await proxy.$http.post("/api/validate", {});
      const data = res.data;
      if (data.success === true) {
        console.log(data.data)
        store.commit("seveLogin", data.data);
        initAddress();
      } else {
        message.error("跟新数据失败");
      }
    };
    //提交地址
    const subAddress = () => {
      if (state.currentAddress.name === "") {
        message.error("请输入您的姓名");
        return;
      }
      if (state.currentAddress.phone === "") {
        message.error("请输入您的联系方式");
        return;
      }
      if (state.currentAddress.faker_address.length === 0) {
        message.error("请选择您的城市");
        return;
      }
      if (state.currentAddress.address_info === "") {
        message.error("请输入您的详细地址");
        return;
      }
      let olde_address = JSON.parse(JSON.stringify(state.currentAddress));
      let uid = store.state.userInfo.uid;
      let difall = olde_address.checked ? 0 : 1;
      let address = olde_address.faker_address.join("-");
      let data_address = {
        address,
        address_info: olde_address.address_info,
        difall,
        id: olde_address.id,
        name: olde_address.name,
        phone: olde_address.phone,
        uid,
      };
      _submirAddress(data_address);
    };
    //取消提交地址
    const clerAddress = () => {
      state.Address_Mask = false;
      state.currentAddress = {
        faker_address: ["四川省", "成都市", "新津区"],
        address: "",
        address_info: "",
        checked: false,
        difall: 1,
        disabled: false,
        id: null,
        name: "",
        phone: "",
        uid: 0,
      };
    };
    //修改地址
    const modifyAddress_Item = (item) => {
      state.Address_Mask = true;
      state.currentAddress.faker_address = item.address.split("-");
      for (let i in item) {
        for (let k in state.currentAddress) {
          if (i === k) {
            state.currentAddress[k] = item[i];
          }
        }
      }
    };
    //添加地址
    const addAdderess = () => {
      state.Address_Mask = true;
    };

    const onCityChange = () => {};
    //提交被删除的地址
    const isDellAddress_Item = async () => {
      const res = await proxy.$http.post("/api/dellAddress", {
        data: state.isDell,
        order_id: state.order_id,
      });
      if (res.data.success === true) {
        message.info("删除成功");
        _update_userInfo();
      }
    };
    //取消要被删除的地址
    const noDellAddress = () => {
      state.isDell = null;
    };
    //保存要删除的地址
    const dellAddress_Item = (item) => {
      state.isDell = item;
    };
    const cancel_Address_Item = () => {};
    return {
      ...toRefs(state),
      onchange,
      isDellAddress_Item,
      dellAddress_Item,
      cancel_Address_Item,
      onCityChange,
      subAddress,
      clerAddress,
      modifyAddress_Item,
      addAdderess,
      noDellAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.addAdderss {
  width: 100%;
  height: 50px;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.address_awrp::-webkit-scrollbar-thumb:horizontal {
  /*水平滚动条的样式*/
  width: 4px;
  background-color: #cccccc;
  -webkit-border-radius: 6px;
}
.address_awrp::-webkit-scrollbar-track-piece {
  background-color: #fff; /*滚动条的背景颜色*/
  -webkit-border-radius: 0; /*滚动条的圆角宽度*/
}
.address_awrp::-webkit-scrollbar {
  width: 10px; /*滚动条的宽度*/
  height: 8px; /*滚动条的高度*/
}
.address_awrp::-webkit-scrollbar-thumb:vertical {
  /*垂直滚动条的样式*/
  height: 50px;
  background-color: #999;
  -webkit-border-radius: 4px;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 2px solid #fff;
}
.address_awrp::-webkit-scrollbar-thumb:hover {
  /*滚动条的hover样式*/
  height: 50px;
  -webkit-border-radius: 4px;
}
.address_awrp {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px 0;
  position: relative;
  .address_item_warp {
    width: 100%;

    .address_item {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      border-bottom: 1px solid $xt;
      cursor: pointer;
      user-select: none;

      .name,
      .desc,
      .difall {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .phone {
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .address {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .address_info {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .item_desc_icon {
        position: relative;
        top: 1px;
      }
    }
  }

  .address_titel {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    border-bottom: 1px solid $xt;
    padding: 0 10px;
    font-weight: bold;
    .name,
    .desc,
    .difall {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .phone {
      width: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .address {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .address_info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .address_no {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .address_no_bg {
      width: 300px;
      height: 300px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .address_no_text {
      font-size: 20px;
      font-weight: bold;
      color: $c9;
      user-select: none;
    }
    .address_no_add_address {
    }
  }
}
.address_mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  .address_content {
    width: 500px;
    height: 400px;
    background-color: $cf;
    border-radius: 4px;
    form {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 20px 0 10px;
      .titel {
        font-size: 20px;
        font-weight: bold;
        color: $c6;
      }
    }
    .difall {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
    }
    .desc {
      margin-top: 20px;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .name,
    .phone,
    .address,
    .address_info {
      width: 100%;
      height: 60px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .iconfont {
        font-size: 20px;
        margin: 0 5px;
      }
      .text {
        display: inline-block;
        width: 80px;
      }
    }
  }
}
</style>
