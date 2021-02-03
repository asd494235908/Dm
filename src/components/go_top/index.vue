<template>
  <div class="commodity_desc">
    <a-back-top class="icon"><VerticalAlignTopOutlined class="icons" /></a-back-top>
  </div>
</template>
<script>
import { VerticalAlignTopOutlined } from "@ant-design/icons-vue";
export default {
  components: { VerticalAlignTopOutlined },
};
</script>
<style lang="scss" scoped>
@import "@/assets/style/theme.scss";
.icon {
  background-color: $cf;
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  .icons {
    font-size: 20px;
  }
}
</style>