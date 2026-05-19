<template>
  <div class="layout-navbars-container">
    <BreadcrumbIndex />
  </div>
</template>

<script setup lang="ts" name="layoutNavBars">
import { defineAsyncComponent } from "vue";

defineOptions({
  name: "LayoutNavBars",
});

const BreadcrumbIndex = defineAsyncComponent(
  () => import("./breadcrumb/index.vue"),
);
</script>

<style scoped lang="scss">
.layout-navbars-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  height: 64px !important;
  padding: 0 20px !important;
}
</style>
