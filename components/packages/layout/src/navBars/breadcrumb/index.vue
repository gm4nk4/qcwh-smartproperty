<template>
  <div class="layout-navbars-breadcrumb-index">
    <Logo> </Logo>
    <User />
  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumbIndex">
import { defineAsyncComponent, useSlots } from "vue";
import { useRoutesList } from "/@/stores/routesList";
import { useThemeConfig } from "/@/stores/themeConfig";

defineOptions({
  name: "LayoutBreadcrumbIndex",
});

const Logo = defineAsyncComponent(() => import("../../logo/index.vue"));
const User = defineAsyncComponent(() => import("./user.vue"));

const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const slots = useSlots();
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-index {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 8px;
}
</style>
