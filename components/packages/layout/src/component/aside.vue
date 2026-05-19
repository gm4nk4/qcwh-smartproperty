<template>
  <div class="h100" v-show="!isTagsViewCurrenFull">
    <el-aside class="layout-aside" :class="setCollapseStyle">
      <el-scrollbar
        class="flex-auto layout-aside-scrollbar"
        ref="layoutAsideScrollbarRef"
        @mouseenter="onAsideEnterLeave(true)"
        @mouseleave="onAsideEnterLeave(false)"
      >
        <div v-if="showBack">
          <div v-if="setShowLogo" class="back-button" @click="onBackClick">
            <el-icon class="back-icon" size="8"><ArrowLeftBold /></el-icon>
            <span>返回统一门户</span>
          </div>
          <div v-else>
            <div
              class="back-button"
              style="width: 56px; justify-content: center"
            >
              <el-icon class="back-icon" size="8"><ArrowLeftBold /></el-icon>
            </div>
          </div>
        </div>
        <Vertical :menuList="state.menuList" />
      </el-scrollbar>
    </el-aside>
  </div>
</template>

<script setup lang="ts" name="layoutAside">
import {
  defineAsyncComponent,
  reactive,
  computed,
  watch,
  onBeforeMount,
  ref,
} from "vue";
import { storeToRefs } from "pinia";
import pinia from "/@/stores/index";
import { useRoutesList } from "/@/stores/routesList";
import { useThemeConfig } from "/@/stores/themeConfig";
import { useTagsViewRoutes } from "/@/stores/tagsViewRoutes";
import mittBus from "/@/utils/mitt";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "LayoutAside",
});

const props = withDefaults(
  defineProps<{
    showBack?: boolean;
  }>(),
  {
    showBack: false,
  },
);

const emit = defineEmits<{
  back: [];
}>();

const Vertical = defineAsyncComponent(() => import("../navMenu/vertical.vue"));
const { locale } = useI18n();

const layoutAsideScrollbarRef = ref();
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const storesTagsViewRoutes = useTagsViewRoutes();
const { routesList } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive<AsideState>({
  menuList: [],
  clientWidth: 0,
});

const onBackClick = () => {
  emit("back");
};

const setShowLogo = computed(() => {
  let { isCollapse, layout } = themeConfig.value;
  return (
    !isCollapse || layout === "classic" || document.body.clientWidth < 1000
  );
});

const setCollapseStyle = computed(() => {
  const { layout, isCollapse, menuBar } = themeConfig.value;
  const asideBrTheme = ["#FFFFFF", "#FFF", "#fff", "#ffffff"];
  const asideBrColor = asideBrTheme.includes(menuBar)
    ? "layout-el-aside-br-color"
    : "";
  if (state.clientWidth <= 1000) {
    if (isCollapse) {
      document.body.setAttribute("class", "el-popup-parent--hidden");
      const asideEle = document.querySelector(
        ".layout-container",
      ) as HTMLElement;
      const modeDivs = document.createElement("div");
      modeDivs.setAttribute("class", "layout-aside-mobile-mode");
      asideEle.appendChild(modeDivs);
      modeDivs.addEventListener("click", closeLayoutAsideMobileMode);
      return [asideBrColor, "layout-aside-mobile", "layout-aside-mobile-open"];
    } else {
      closeLayoutAsideMobileMode();
      return [asideBrColor, "layout-aside-mobile", "layout-aside-mobile-close"];
    }
  } else {
    return [
      asideBrColor,
      layout === "columns"
        ? isCollapse
          ? "layout-aside-pc-1"
          : locale.value === "en"
            ? "layout-aside-pc-250"
            : "layout-aside-pc-220"
        : isCollapse
          ? "layout-aside-pc-64"
          : locale.value === "en"
            ? "layout-aside-pc-250"
            : "layout-aside-pc-220",
    ];
  }
});

const closeLayoutAsideMobileMode = () => {
  const el = document.querySelector(".layout-aside-mobile-mode");
  el?.setAttribute("style", "animation: error-img-two 0.3s");
  setTimeout(() => {
    el?.parentNode?.removeChild(el);
  }, 300);
  const clientWidth = document.body.clientWidth;
  if (clientWidth < 1000) themeConfig.value.isCollapse = false;
  document.body.setAttribute("class", "");
};

const setFilterRoutes = () => {
  if (themeConfig.value.layout === "columns") return false;
  state.menuList = filterRoutesFun(routesList.value);
};

const filterRoutesFun = <T extends RouteItem>(arr: T[]): T[] => {
  return arr
    .filter((item: T) => !item.meta?.isHide)
    .map((item: T) => {
      item = Object.assign({}, item);
      if (item.children) item.children = filterRoutesFun(item.children);
      return item;
    });
};

const initMenuFixed = (clientWidth: number) => {
  state.clientWidth = clientWidth;
};

const onAsideEnterLeave = (bool: Boolean) => {
  let { layout } = themeConfig.value;
  if (layout !== "columns") return false;
  if (!bool) mittBus.emit("restoreDefault");
  stores.setColumnsMenuHover(bool);
};

onBeforeMount(() => {
  initMenuFixed(document.body.clientWidth);
  setFilterRoutes();
  mittBus.on("setSendColumnsChildren", (res: MittMenu) => {
    state.menuList = res.children;
  });
  mittBus.on("setSendClassicChildren", (res: MittMenu) => {
    let { layout, isClassicSplitMenu } = themeConfig.value;
    if (layout === "classic" && isClassicSplitMenu) {
      state.menuList = [];
      state.menuList = res.children;
    }
  });
  mittBus.on("getBreadcrumbIndexSetFilterRoutes", () => {
    setFilterRoutes();
  });
  mittBus.on("layoutMobileResize", (res: LayoutMobileResize) => {
    initMenuFixed(res.clientWidth);
    closeLayoutAsideMobileMode();
  });
});

watch(themeConfig.value, (val) => {
  if (val.isShowLogoChange !== val.isShowLogo) {
    if (layoutAsideScrollbarRef.value) layoutAsideScrollbarRef.value.update();
  }
});

watch(
  pinia.state,
  (val) => {
    let { layout, isClassicSplitMenu } = val.themeConfig.themeConfig;
    if (layout === "classic" && isClassicSplitMenu) return false;
    setFilterRoutes();
  },
  {
    deep: true,
  },
);
</script>

<style scoped lang="scss">
.layout-aside-scrollbar {
  padding-bottom: 80px;
}

.back-button {
  height: 36px;
  width: 220px;
  background: linear-gradient(84deg, #00b6e8 0%, #015cf8 100%);
  border-radius: 4px;
  color: #fff;
  padding: 0 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  font-size: 16px;
  height: 36px;
  gap: 10px;
  cursor: pointer;
  margin-left: 20px;

  .back-icon {
    border: 1px solid #fff;
    border-radius: 50%;
    width: 17px;
    height: 17px;
  }
}

:deep(.layout-aside-pc-64) {
  .layout-navbars-breadcrumb {
    margin-left: 20px;
  }
  .el-menu--collapse {
    .el-menu-item {
      width: auto !important;
    }

    .el-sub-menu.is-active {
      .el-sub-menu__title {
        background-color: #ffffff !important;
      }
    }
  }
}

:deep(.el-sub-menu.is-active.is-opened.layout-nav-menu__group)
  .el-sub-menu__title {
  background-color: transparent !important;
}
</style>
