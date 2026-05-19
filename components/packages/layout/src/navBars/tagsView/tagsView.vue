<template>
  <div
    class="layout-navbars-tagsview"
    :class="{
      'layout-navbars-tagsview-shadow': getThemeConfig.layout === 'classic',
    }"
  >
    <el-scrollbar ref="scrollbarRef" @wheel.prevent="onHandleScroll">
      <ul
        class="layout-navbars-tagsview-ul"
        :class="setTagsStyle"
        ref="tagsUlRef"
      >
        <li
          v-for="(v, k) in state.tagsViewList"
          :key="k"
          class="layout-navbars-tagsview-ul-li"
          :data-url="v.url"
          :class="{ 'is-active': isActive(v) }"
          @contextmenu.prevent="onContextmenu(v, $event)"
          @mousedown="onMousedownMenu(v, $event)"
          @click="onTagsClick(v, k)"
          :ref="
            (el) => {
              if (el) tagsRefs[k] = el;
            }
          "
        >
          <SvgIcon
            :name="v.meta.icon"
            v-if="!isActive(v) && getThemeConfig.isTagsviewIcon"
            class="pr5"
          />
          <span>{{ setTagsViewNameI18n(v) }}</span>
          <SvgIcon
            name="ele-Close"
            class="layout-navbars-tagsview-ul-li-icon"
            v-if="!v.meta.isAffix"
            @click.stop="
              closeCurrentTagsView(
                getThemeConfig.isShareTagsView ? v.path : v.url,
              )
            "
          />
        </li>
      </ul>
    </el-scrollbar>
    <Contextmenu
      :dropdown="state.dropdown"
      ref="contextmenuRef"
      @currentContextmenuClick="onCurrentContextmenuClick"
    />
  </div>
</template>

<script setup lang="ts" name="layoutTagsView">
import Sortable from "sortablejs";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import pinia from "/@/stores/index";
import { useTagsViewRoutes } from "/@/stores/tagsViewRoutes";
import { useThemeConfig } from "/@/stores/themeConfig";
import { useKeepALiveNames } from "/@/stores/keepAliveNames";
import { Session } from "/@/utils/storage";
import { isObjectValueEqual } from "/@/utils/arrayOperation";
import other from "/@/utils/other";
import mittBus from "/@/utils/mitt";
import { useMessage } from "/@/hooks/message";

const Contextmenu = defineAsyncComponent(() => import("./contextmenu.vue"));

const tagsRefs = ref<RefType>([]);
const scrollbarRef = ref();
const contextmenuRef = ref();
const tagsUlRef = ref();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const storesTagsViewRoutes = useTagsViewRoutes();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { tagsViewRoutes, favoriteRoutes } = storeToRefs(storesTagsViewRoutes);
const storesKeepALiveNames = useKeepALiveNames();
const route = useRoute();
const router = useRouter();
const state = reactive<TagsViewState>({
  routeActive: "",
  routePath: route.path,
  dropdown: { x: "", y: "" },
  sortable: "",
  tagsRefsIndex: 0,
  tagsViewList: [],
  tagsViewRoutesList: [],
});

const setTagsStyle = computed(() => {
  return themeConfig.value.tagsStyle;
});

const getThemeConfig = computed(() => {
  return themeConfig.value;
});

const setTagsViewNameI18n = computed(() => {
  return (v: RouteItem) => {
    return other.setMenuI18n(v);
  };
});

const isActive = (v: RouteItem) => {
  if (getThemeConfig.value.isShareTagsView) {
    return v.path === state.routePath;
  } else {
    if (
      (v.query && Object.keys(v.query).length) ||
      (v.params && Object.keys(v.params).length)
    ) {
      return v.url ? v.url === state.routeActive : v.path === state.routeActive;
    } else {
      return v.path === state.routeActive;
    }
  }
};

const addBrowserSetSession = (tagsViewList: Array<object>) => {
  Session.set("tagsViewList", tagsViewList);
};

const getTagsViewRoutes = async () => {
  state.routeActive = await setTagsViewHighlight(route);
  state.routePath = (await route.meta.isDynamic)
    ? route.meta.isDynamicPath
    : route.path;
  state.tagsViewList = [];
  state.tagsViewRoutesList = tagsViewRoutes.value;
  initTagsView();
};

const initTagsView = async () => {
  if (Session.get("tagsViewList") && getThemeConfig.value.isCacheTagsView) {
    state.tagsViewList = await Session.get("tagsViewList");
  } else {
    await state.tagsViewRoutesList.map((v: RouteItem) => {
      if (v.meta?.isAffix && !v.meta.isHide) {
        v.url = setTagsViewHighlight(v);
        state.tagsViewList.push({ ...v });
        storesKeepALiveNames.addCachedView(v);
      }
    });
    await addTagsView(route.path, <RouteToFrom>route);
  }
  getTagsRefsIndex(
    getThemeConfig.value.isShareTagsView ? state.routePath : state.routeActive,
  );
};

const solveAddTagsView = async (path: string, to?: RouteToFrom) => {
  let isDynamicPath = to?.meta?.isDynamic ? to.meta.isDynamicPath : path;
  let current = state.tagsViewList.filter(
    (v: RouteItem) =>
      v.path === isDynamicPath &&
      isObjectValueEqual(
        to?.meta?.isDynamic
          ? v.params
            ? v.params
            : null
          : v.query
            ? v.query
            : null,
        to?.meta?.isDynamic
          ? to?.params
            ? to?.params
            : null
          : to?.query
            ? to?.query
            : null,
      ),
  );
  if (current.length <= 0) {
    let findItem = state.tagsViewRoutesList.find(
      (v: RouteItem) => v.path === isDynamicPath,
    );
    if (!findItem) return false;
    if (findItem.meta.isAffix) return false;
    if (findItem.meta.isLink && !findItem.meta.isIframe) return false;
    to?.meta?.isDynamic
      ? (findItem.params = to.params)
      : (findItem.query = to?.query);
    findItem.url = setTagsViewHighlight(findItem);
    state.tagsViewList.push({ ...findItem });
    await storesKeepALiveNames.addCachedView(findItem);
    addBrowserSetSession(state.tagsViewList);
  }
};

const singleAddTagsView = (path: string, to?: RouteToFrom) => {
  let isDynamicPath = to?.meta?.isDynamic ? to.meta.isDynamicPath : path;
  state.tagsViewList.forEach((v) => {
    if (
      v.path === isDynamicPath &&
      !isObjectValueEqual(
        to?.meta?.isDynamic
          ? v.params
            ? v.params
            : null
          : v.query
            ? v.query
            : null,
        to?.meta?.isDynamic
          ? to?.params
            ? to?.params
            : null
          : to?.query
            ? to?.query
            : null,
      )
    ) {
      to?.meta?.isDynamic ? (v.params = to.params) : (v.query = to?.query);
      v.url = setTagsViewHighlight(v);
      addBrowserSetSession(state.tagsViewList);
    }
  });
};

const addTagsView = (path: string, to?: RouteToFrom) => {
  nextTick(async () => {
    let item: RouteItem;
    if (to?.meta?.isDynamic) {
      if (!getThemeConfig.value.isShareTagsView)
        await solveAddTagsView(path, to);
      else await singleAddTagsView(path, to);
      if (
        state.tagsViewList.some(
          (v: RouteItem) => v.path === to?.meta?.isDynamicPath,
        )
      ) {
        addBrowserSetSession(state.tagsViewList);
        return false;
      }
      item = state.tagsViewRoutesList.find(
        (v: RouteItem) => v.path === to?.meta?.isDynamicPath,
      );
    } else {
      if (!getThemeConfig.value.isShareTagsView)
        await solveAddTagsView(path, to);
      else await singleAddTagsView(path, to);
      if (state.tagsViewList.some((v: RouteItem) => v.path === path)) {
        addBrowserSetSession(state.tagsViewList);
        return false;
      }
      item = state.tagsViewRoutesList.find((v: RouteItem) => v.path === path);
    }
    if (!item) return false;
    if (item?.meta?.isLink && !item.meta.isIframe) return false;
    if (to?.meta?.isDynamic)
      item.params = to?.params ? to?.params : route.params;
    else item.query = to?.query ? to?.query : route.query;
    item.url = setTagsViewHighlight(item);
    await storesKeepALiveNames.addCachedView(item);
    await state.tagsViewList.push({ ...item });
    await addBrowserSetSession(state.tagsViewList);
  });
};

const refreshCurrentTagsView = async (fullPath: string) => {
  const decodeURIPath = decodeURI(fullPath);
  let item: RouteToFrom = {};
  state.tagsViewList.forEach((v: RouteItem) => {
    v.transUrl = transUrlParams(v);
    if (v.transUrl) {
      if (v.transUrl === transUrlParams(v)) item = v;
    } else {
      if (v.path === decodeURIPath) item = v;
    }
  });
  if (!item) return false;
  await storesKeepALiveNames.delCachedView(item);
  mittBus.emit("onTagsViewRefreshRouterView", fullPath);
  if (item.meta?.isKeepAlive) storesKeepALiveNames.addCachedView(item);
};

const closeCurrentTagsView = (path: string) => {
  state.tagsViewList.map((v: RouteItem, k: number, arr: RouteItems) => {
    if (!v.meta?.isAffix) {
      if (
        getThemeConfig.value.isShareTagsView ? v.path === path : v.url === path
      ) {
        storesKeepALiveNames.delCachedView(v);
        state.tagsViewList.splice(k, 1);
        setTimeout(() => {
          if (
            state.tagsViewList.length === k &&
            getThemeConfig.value.isShareTagsView
              ? state.routePath === path
              : state.routeActive === path
          ) {
            if (arr[arr.length - 1].meta.isDynamic) {
              if (k !== arr.length)
                router.push({ name: arr[k].name, params: arr[k].params });
              else
                router.push({
                  name: arr[arr.length - 1].name,
                  params: arr[arr.length - 1].params,
                });
            } else {
              if (k !== arr.length)
                router.push({ path: arr[k].path, query: arr[k].query });
              else
                router.push({
                  path: arr[arr.length - 1].path,
                  query: arr[arr.length - 1].query,
                });
            }
          } else {
            if (
              state.tagsViewList.length !== k &&
              getThemeConfig.value.isShareTagsView
                ? state.routePath === path
                : state.routeActive === path
            ) {
              if (arr[k].meta.isDynamic) {
                router.push({ name: arr[k].name, params: arr[k].params });
              } else {
                router.push({ path: arr[k].path, query: arr[k].query });
              }
            }
          }
        }, 0);
      }
    }
  });
  addBrowserSetSession(state.tagsViewList);
};

const closeOtherTagsView = (path: string) => {
  if (Session.get("tagsViewList")) {
    state.tagsViewList = [];
    Session.get("tagsViewList").map((v: RouteItem) => {
      if (v.meta?.isAffix && !v.meta.isHide) {
        v.url = setTagsViewHighlight(v);
        storesKeepALiveNames.delOthersCachedViews(v);
        state.tagsViewList.push({ ...v });
      }
    });
    addTagsView(path, <RouteToFrom>route);
    addBrowserSetSession(state.tagsViewList);
  }
};

const closeAllTagsView = () => {
  if (Session.get("tagsViewList")) {
    storesKeepALiveNames.delAllCachedViews();
    state.tagsViewList = [];
    Session.get("tagsViewList").map((v: RouteItem) => {
      if (v.meta?.isAffix && !v.meta.isHide) {
        v.url = setTagsViewHighlight(v);
        state.tagsViewList.push({ ...v });
        router.push({
          path: state.tagsViewList[state.tagsViewList.length - 1].path,
        });
      }
    });
    addBrowserSetSession(state.tagsViewList);
  }
};

const openCurrenFullscreen = async (path: string) => {
  const item = state.tagsViewList.find((v: RouteItem) =>
    getThemeConfig.value.isShareTagsView ? v.path === path : v.url === path,
  );
  if (item.meta.isDynamic)
    await router.push({ name: item.name, params: item.params });
  else await router.push({ name: item.name, query: item.query });
  stores.setCurrenFullscreen(true);
};

const getCurrentRouteItem = (item: RouteItem): any => {
  let resItem: RouteToFrom = {};
  state.tagsViewList.forEach((v: RouteItem) => {
    v.transUrl = transUrlParams(v);
    if (v.transUrl) {
      if (v.transUrl === transUrlParams(v) && v.transUrl === item.commonUrl)
        resItem = v;
    } else {
      if (v.path === decodeURI(item.path)) resItem = v;
    }
  });
  if (!resItem) return null;
  else return resItem;
};

const onCurrentContextmenuClick = async (item: RouteItem) => {
  item.commonUrl = transUrlParams(item);
  if (!getCurrentRouteItem(item))
    return ElMessage({
      type: "warning",
      message: "请正确输入路径及完整参数（query、params）",
    });
  const { path, name, params, query, meta, url } = getCurrentRouteItem(item);
  switch (item.contextMenuClickId) {
    case 0:
      if (meta.isDynamic) await router.push({ name, params });
      else await router.push({ path, query });
      refreshCurrentTagsView(route.fullPath);
      break;
    case 1:
      closeCurrentTagsView(getThemeConfig.value.isShareTagsView ? path : url);
      break;
    case 2:
      if (meta.isDynamic) await router.push({ name, params });
      else await router.push({ path, query });
      closeOtherTagsView(path);
      break;
    case 3:
      closeAllTagsView();
      break;
    case 4:
      openCurrenFullscreen(getThemeConfig.value.isShareTagsView ? path : url);
      break;
    case 5:
      favoriteRoute(item);
      break;
  }
};

const favoriteRoute = (item: RouteItem) => {
  if (!favoriteRoutes.value.find((o) => o.path === item.path)) {
    storesTagsViewRoutes.setFavoriteRoutes(item);
  } else {
    useMessage().error("已经存在收藏");
  }
};

const onContextmenu = (v: RouteItem, e: MouseEvent) => {
  const { clientX, clientY } = e;
  state.dropdown.x = clientX;
  state.dropdown.y = clientY;
  contextmenuRef.value.openContextmenu(v);
};

const onMousedownMenu = (v: RouteItem, e: MouseEvent) => {
  if (!v.meta?.isAffix && e.button === 1) {
    const item = Object.assign({}, { contextMenuClickId: 1, ...v });
    onCurrentContextmenuClick(item);
  }
};

const onTagsClick = (v: RouteItem, k: number) => {
  state.tagsRefsIndex = k;
  router.push(v);
};

const transUrlParams = (v: RouteItem) => {
  let params = v.query && Object.keys(v.query).length > 0 ? v.query : v.params;
  if (!params) return "";
  let path = "";
  for (let [key, value] of Object.entries(params)) {
    if (v.meta?.isDynamic) path += `/${value}`;
    else path += `&${key}=${value}`;
  }
  if (v.meta?.isDynamic) {
    return v.isFnClick
      ? decodeURI(v.path)
      : `${v.path.split(":")[0]}${path.replace(/^\//, "")}`;
  } else {
    return `${v.path}${path.replace(/^&/, "?")}`;
  }
};

const setTagsViewHighlight = (v: RouteToFrom) => {
  let params = v.query && Object.keys(v.query).length > 0 ? v.query : v.params;
  if (!params || Object.keys(params).length <= 0) return v.path;
  let path = "";
  for (let i in params) {
    path += params[i];
  }
  return `${v.meta?.isDynamic ? v.meta.isDynamicPath : v.path}-${path}`;
};

const onHandleScroll = (e: WheelEventType) => {
  scrollbarRef.value.$refs.wrapRef.scrollLeft += e.wheelDelta / 4;
};

const tagsViewmoveToCurrentTag = () => {
  nextTick(() => {
    if (tagsRefs.value.length <= 0) return false;
    let liDom = tagsRefs.value[state.tagsRefsIndex];
    let liIndex = state.tagsRefsIndex;
    let liLength = tagsRefs.value.length;
    let liFirst = tagsRefs.value[0];
    let liLast = tagsRefs.value[tagsRefs.value.length - 1];
    let scrollRefs = scrollbarRef.value.$refs.wrapRef;
    let scrollS = scrollRefs.scrollWidth;
    let offsetW = scrollRefs.offsetWidth;
    let scrollL = scrollRefs.scrollLeft;
    let liPrevTag = tagsRefs.value[state.tagsRefsIndex - 1];
    let liNextTag = tagsRefs.value[state.tagsRefsIndex + 1];
    let beforePrevL = 0;
    let afterNextL = 0;
    if (liDom === liFirst) {
      scrollRefs.scrollLeft = 0;
    } else if (liDom === liLast) {
      scrollRefs.scrollLeft = scrollS - offsetW;
    } else {
      if (liIndex === 0) beforePrevL = liFirst.offsetLeft - 5;
      else beforePrevL = liPrevTag?.offsetLeft - 5;
      if (liIndex === liLength)
        afterNextL = liLast.offsetLeft + liLast.offsetWidth + 5;
      else afterNextL = liNextTag.offsetLeft + liNextTag.offsetWidth + 5;
      if (afterNextL > scrollL + offsetW) {
        scrollRefs.scrollLeft = afterNextL - offsetW;
      } else if (beforePrevL < scrollL) {
        scrollRefs.scrollLeft = beforePrevL;
      }
    }
    scrollbarRef.value.update();
  });
};

const getTagsRefsIndex = (path: string | unknown) => {
  nextTick(async () => {
    let tagsViewList = await state.tagsViewList;
    state.tagsRefsIndex = tagsViewList.findIndex((v: RouteItem) => {
      if (getThemeConfig.value.isShareTagsView) {
        return v.path === path;
      } else {
        return v.url === path;
      }
    });
    tagsViewmoveToCurrentTag();
  });
};

const initSortable = async () => {
  const el = <HTMLElement>document.querySelector(".layout-navbars-tagsview-ul");
  if (!el) return false;
  state.sortable.el && state.sortable.destroy();
  state.sortable = Sortable.create(el, {
    animation: 300,
    dataIdAttr: "data-url",
    disabled: getThemeConfig.value.isSortableTagsView ? false : true,
    onEnd: () => {
      const sortEndList: RouteItem[] = [];
      state.sortable.toArray().map((val: string) => {
        state.tagsViewList.map((v: RouteItem) => {
          if (v.url === val) sortEndList.push({ ...v });
        });
      });
      addBrowserSetSession(sortEndList);
    },
  });
};

const onSortableResize = async () => {
  await initSortable();
  if (other.isMobile()) state.sortable.el && state.sortable.destroy();
};

onBeforeMount(() => {
  onSortableResize();
  window.addEventListener("resize", onSortableResize);
  mittBus.on("onCurrentContextmenuClick", (data: RouteItem) => {
    data.isFnClick = true;
    onCurrentContextmenuClick(data);
  });
  mittBus.on("openOrCloseSortable", () => {
    initSortable();
  });
  mittBus.on("openShareTagsView", () => {
    if (getThemeConfig.value.isShareTagsView) {
      router.push("/home/index");
      state.tagsViewList = [];
      state.tagsViewRoutesList.map((v: RouteItem) => {
        if (v.meta?.isAffix && !v.meta.isHide) {
          v.url = setTagsViewHighlight(v);
          state.tagsViewList.push({ ...v });
        }
      });
    }
  });
});

onUnmounted(() => {
  mittBus.off("onCurrentContextmenuClick", () => {});
  mittBus.off("openOrCloseSortable", () => {});
  mittBus.off("openShareTagsView", () => {});
  window.removeEventListener("resize", onSortableResize);
});

onBeforeUpdate(() => {
  tagsRefs.value = [];
});

onMounted(() => {
  getTagsViewRoutes();
  initSortable();
});

onBeforeRouteUpdate(async (to) => {
  state.routeActive = setTagsViewHighlight(to);
  state.routePath = to.meta.isDynamic ? to.meta.isDynamicPath : to.path;
  await addTagsView(to.path, <RouteToFrom>to);
  getTagsRefsIndex(
    getThemeConfig.value.isShareTagsView ? state.routePath : state.routeActive,
  );
});

watch(
  pinia.state,
  (val) => {
    if (
      val.tagsViewRoutes.tagsViewRoutes.length ===
      state.tagsViewRoutesList.length
    )
      return false;
    getTagsViewRoutes();
  },
  {
    deep: true,
  },
);
</script>

<style scoped lang="scss">
.layout-navbars-tagsview {
  background: transparent;
  margin: 0;
  padding: 0 24px;
  border: none;
  border-radius: 0;
  box-shadow: none;
  position: relative;
  z-index: 3;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  :deep(.el-scrollbar__wrap) {
    overflow-x: auto !important;
  }
  &-ul {
    list-style: none;
    margin: 0;
    padding: 0;
    min-height: var(--layout-tags-height);
    display: flex;
    align-items: center;
    gap: 0;
    color: var(--theme-text-dataAssist);
    font-size: 16px;
    white-space: nowrap;
    &-li {
      height: var(--layout-tags-height);
      line-height: var(--layout-tags-height);
      display: flex;
      align-items: center;
      gap: 10px;
      border: none;
      padding: 0 18px 0 0;
      margin-right: 22px;
      border-radius: 0;
      position: relative;
      z-index: 0;
      cursor: pointer;
      justify-content: flex-start;
      background: transparent;
      box-shadow: none;
      color: #999999;
      font-weight: 500;
      transition: color 0.2s ease;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 18px;
        bottom: 0;
        height: 3px;
        border-radius: 999px;
        background: transparent;
        transition: background 0.2s ease;
      }
      &:hover {
        color: #606b80;
      }
      &-iconfont {
        display: none;
      }
      &-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        position: relative;
        height: 16px;
        width: 16px;
        text-align: center;
        line-height: 16px;
        color: #b7c0cf;
        transition: color 0.2s ease;
        &:hover {
          color: #7b8698;
        }
      }
      :deep(.svg-icon) {
        margin-right: -2px;
      }
      span {
        line-height: 1;
      }
    }
    .is-active {
      color: var(--el-color-primary);
      background: transparent;
      box-shadow: none;
      font-weight: 700;
      &::after {
        background: var(--el-color-primary);
      }
      .layout-navbars-tagsview-ul-li-icon {
        color: #c2cad8;
      }
    }
  }
  .tags-style-four,
  .tags-style-five {
    align-items: center;
    .layout-navbars-tagsview-ul-li {
      margin-right: 22px;
      padding: 0 18px 0 0;
      border: none !important;
      background: transparent !important;
      border-radius: 0 !important;
      &:hover {
        background: transparent !important;
      }
    }
    .is-active {
      background: transparent !important;
      color: var(--el-color-primary) !important;
    }
  }
}
.layout-navbars-tagsview-shadow {
  box-shadow: none;
}
</style>
