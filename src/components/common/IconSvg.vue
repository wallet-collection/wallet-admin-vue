<template>
    <div v-if="iconClass" class="svg-icon iconfont" :class="iconClass"></div>
</template>

<script>
export default {
    name: "icon-svg",
    props: {
        iconClass: {
            type: String,
            required: true
        }
    },
    computed: {
        iconName() {
            return `${this.iconClass}`;
        }
    }
};
</script>

<style lang="less" scoped>
.svg-icon {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  //fill: currentColor;
  //overflow: hidden;
}
</style>
