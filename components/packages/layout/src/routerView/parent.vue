<template>
	<div class="layout-parent">
		<router-view v-slot="{ Component }">
			<transition :name="setTransitionName" mode="out-in">
				<keep-alive>
					<component :is="Component" :key="state.refreshRouterViewKey" class="w100" v-show="!isIframePage" v-if="route.meta.isKeepAlive" />
				</keep-alive>
			</transition>
			<transition :name="setTransitionName" mode="out-in">
				<component :is="Component" :key="state.refreshRouterViewKey" class="w100" v-show="!isIframePage" v-if="!route.meta.isKeepAlive" />
			</transition>
		</router-view>
		<transition :name="setTransitionName" mode="out-in">
			<Iframes class="w100" v-show="isIframePage" :refreshKey="state.iframeRefreshKey" :name="setTransitionName" :list="state.iframeList" />
		</transition>
	</div>
</template>

<script setup lang="ts" name="layoutParentView">
import { defineAsyncComponent, reactive } from 'vue';
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Session } from '/@/utils/storage';
import mittBus from '/@/utils/mitt';

const Iframes = defineAsyncComponent(() => import('./iframes.vue'));

const route = useRoute();
const router = useRouter();
const storesKeepAliveNames = useKeepALiveNames();
const storesThemeConfig = useThemeConfig();
const { keepAliveNames, cachedViews } = storeToRefs(storesKeepAliveNames);
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive<ParentViewState>({
	refreshRouterViewKey: '',
	iframeRefreshKey: '',
	keepAliveNameList: [],
	iframeList: [],
});

const setTransitionName = computed(() => {
	return themeConfig.value.animation;
});

const isIframePage = computed(() => {
	return route.meta.isIframe;
});

const getIframeListRoutes = async () => {
	router.getRoutes().forEach((v) => {
		if (v.meta.isIframe) {
			v.meta.isIframeOpen = false;
			v.meta.loading = true;
			state.iframeList.push({ ...v });
		}
	});
};

onBeforeMount(() => {
	state.keepAliveNameList = keepAliveNames.value;
	mittBus.on('onTagsViewRefreshRouterView', (fullPath: string) => {
		state.keepAliveNameList = keepAliveNames.value.filter((name: string) => route.name !== name);
		state.refreshRouterViewKey = '';
		state.iframeRefreshKey = '';
		nextTick(() => {
			state.refreshRouterViewKey = fullPath;
			state.iframeRefreshKey = fullPath;
			state.keepAliveNameList = keepAliveNames.value;
		});
	});
});

onMounted(() => {
	getIframeListRoutes();
	nextTick(() => {
		setTimeout(() => {
			if (themeConfig.value.isCacheTagsView) {
				let tagsViewArr: RouteItem[] = Session.get('tagsViewList') || [];
				cachedViews.value = tagsViewArr.filter((item) => item.meta?.isKeepAlive).map((item) => item.name as string);
			}
		}, 0);
	});
});

onUnmounted(() => {
	mittBus.off('onTagsViewRefreshRouterView', () => {});
});

watch(
	() => route.fullPath,
	() => {
		state.refreshRouterViewKey = decodeURI(route.fullPath);
	},
	{
		immediate: true,
	}
);
</script>
