<template>
  <el-container class="layout-container" style="flex-direction: column">
    <LayoutHeader />
    <el-container
      class="layout-container-view"
      style="height: calc(100vh - 64px)"
    >
      <LayoutAside :showBack="showBack" @back="onBack" />
      <el-scrollbar ref="layoutScrollbarRef" class="layout-backtop">
        <div class="layout-content-card" :class="{ 'has-tags': isTagsview }">
          <LayoutTagsView v-if="isTagsview" />
          <LayoutMain ref="layoutMainRef" />
        </div>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="layoutDefaults">
import { defineAsyncComponent } from "vue";
import { useThemeConfig } from "/@/stores/themeConfig";
import { NextLoading } from "/@/utils/loading";

defineOptions({
  name: "LayoutDefaults",
});

defineProps<{
  showBack?: boolean;
}>();

const emit = defineEmits<{
  back: [];
}>();

const onBack = () => {
  emit("back");
};

const LayoutAside = defineAsyncComponent(
  () => import("../component/aside.vue"),
);
const LayoutHeader = defineAsyncComponent(
  () => import("../component/header.vue"),
);
const LayoutMain = defineAsyncComponent(() => import("../component/main.vue"));
const LayoutTagsView = defineAsyncComponent(
  () => import("../navBars/tagsView/tagsView.vue"),
);

const layoutScrollbarRef = ref<RefType>("");
const layoutMainRef = ref<InstanceType<typeof LayoutMain>>();
const route = useRoute();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const isTagsview = computed(() => {
  return themeConfig.value.isTagsview;
});

const updateScrollbar = () => {
  layoutScrollbarRef.value?.update();
  layoutMainRef.value?.layoutMainScrollbarRef?.update();
};

const initScrollBarHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      updateScrollbar();
      layoutScrollbarRef.value?.wrapRef &&
        (layoutScrollbarRef.value.wrapRef.scrollTop = 0);
      layoutMainRef.value?.layoutMainScrollbarRef?.wrapRef &&
        (layoutMainRef.value.layoutMainScrollbarRef.wrapRef.scrollTop = 0);
    }, 500);
  });
};

onMounted(() => {
  initScrollBarHeight();
  NextLoading.done(600);
});

watch(
  () => route.path,
  () => {
    initScrollBarHeight();
  },
);

watch(
  themeConfig,
  () => {
    updateScrollbar();
  },
  {
    deep: true,
  },
);
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

.layout-container-view {
  overflow: hidden;
}

.layout-backtop {
  height: 100%;
}

.layout-content-card {
  background: var(--el-bg-color);
  border-radius: 16px !important;
  overflow: hidden;
  margin: 8px;

  &.has-tags {
    margin-top: 0;
  }
}
</style>
