<template>
  <div class="layout-navbars-breadcrumb">
    <img
      class="layout-navbars-breadcrumb-icon"
      :src="themeConfig.isCollapse ? Fold : Expand"
      @click="onThemeConfigChange"
    />
  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumb">
import { reactive, computed, onMounted, defineAsyncComponent } from "vue";
import {
  onBeforeRouteUpdate,
  RouteLocation,
  useRoute,
  useRouter,
} from "vue-router";
import { Local } from "/@/utils/storage";
import other from "/@/utils/other";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "/@/stores/themeConfig";
import { useRoutesList } from "/@/stores/routesList";
const Expand = new URL("../../asset/images/expand.png", import.meta.url).href;
const Fold = new URL("../../asset/images/fold.png", import.meta.url).href;
// 定义变量内容
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { routesList } = storeToRefs(stores);
const route = useRoute();
const router = useRouter();
const state = reactive<BreadcrumbState>({
  breadcrumbList: [],
  routeSplit: [],
  routeSplitFirst: "",
  routeSplitIndex: 1,
});

// 动态设置经典、横向布局不显示
const isShowBreadcrumb = computed(() => {
  initRouteSplit(route);
  const { layout, isBreadcrumb } = themeConfig.value;
  if (layout === "classic" || layout === "transverse") return false;
  else return isBreadcrumb ? true : false;
});
// 面包屑点击时
const onBreadcrumbClick = (v: RouteItem) => {
  const { redirect, path } = v;
  if (redirect) router.push(redirect);
  else router.push(path);
};
// 展开/收起左侧菜单点击
const onThemeConfigChange = () => {
  themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
  setLocalThemeConfig();
};
// 存储布局配置
const setLocalThemeConfig = () => {
  Local.remove("themeConfig");
  Local.set("themeConfig", themeConfig.value);
};
// 处理面包屑数据
const getBreadcrumbList = (arr: RouteItems) => {
  arr.forEach((item: RouteItem) => {
    state.routeSplit.forEach((v: string, k: number, arrs: string[]) => {
      if (state.routeSplitFirst === item.path) {
        state.routeSplitFirst += `/${arrs[state.routeSplitIndex]}`;
        state.breadcrumbList.push(item);
        state.routeSplitIndex++;
        if (item.children) getBreadcrumbList(item.children);
      }
    });
  });
};
// 当前路由字符串切割成数组，并删除第一项空内容
const initRouteSplit = (toRoute: RouteLocation) => {
  let path = toRoute.path;
  if (!themeConfig.value.isBreadcrumb) return false;
  state.breadcrumbList = [routesList.value[0]];
  state.routeSplit = path.split("/");
  state.routeSplit.shift();
  state.routeSplitFirst = `/${state.routeSplit[0]}`;
  state.routeSplitIndex = 1;
  getBreadcrumbList(routesList.value);
  state.breadcrumbList.push(route);
  // 首页或异常页只显示第一个
  if (
    toRoute.name === "router.home" ||
    (toRoute.name === "staticRoutes.notFound" &&
      state.breadcrumbList.length > 1)
  ) {
    state.breadcrumbList.splice(0, state.breadcrumbList.length - 1);
  } else if (state.breadcrumbList.length > 0) {
    state.breadcrumbList[state.breadcrumbList.length - 1].meta.tagsViewName =
      other.setMenuI18n(<RouteToFrom>route);
  }
};
// 页面加载时
onMounted(() => {
  initRouteSplit(route);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
  // 传入跳转的目标路由对象
  initRouteSplit(to);
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb {
  // flex: 1;
  height: inherit;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;

  .layout-navbars-breadcrumb-icon {
    cursor: pointer;
    font-size: 18px;
    color: var(--theme-text-system);
    height: 28px;
    width: 28px;
    // border-radius: 12px;
    // border: 1px solid var(--next-border-color-light);
    // background: rgba(255, 255, 255, 0.96);
    // box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
    opacity: 1;
    flex: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .layout-navbars-breadcrumb-span {
    display: flex;
    align-items: center;
    color: var(--theme-text-system);
    font-weight: 600;
  }

  .layout-navbars-breadcrumb-iconfont {
    font-size: 14px;
    margin-right: 6px;
  }

  :deep(.el-breadcrumb) {
    min-width: 0;
  }

  :deep(.el-breadcrumb__separator) {
    margin: 0 10px;
    color: #c4cbda;
  }

  :deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
    font-weight: unset !important;
    color: var(--theme-text-dataAssist);
    font-size: 13px;

    &:hover {
      color: var(--el-color-primary) !important;
    }
  }
}
</style>
