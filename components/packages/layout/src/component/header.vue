<template>
  <el-header class="layout-header" v-show="!isTagsViewCurrenFull">
    <NavBarsIndex />
  </el-header>
</template>

<script setup lang="ts" name="layoutHeader">
import { defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useTagsViewRoutes } from "/@/stores/tagsViewRoutes";

defineOptions({
  name: "LayoutHeader",
});

const NavBarsIndex = defineAsyncComponent(() => import("../navBars/index.vue"));

const storesTagsViewRoutes = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
</script>

<style scoped lang="scss">
.layout-header {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}
</style>
