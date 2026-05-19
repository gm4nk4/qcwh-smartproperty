<template>
	<el-main class="layout-main" :style="isFixedHeader ? `height: calc(100% - ${setMainHeight})` : `minHeight: calc(100% - ${setMainHeight})`">
		<el-scrollbar
			ref="layoutMainScrollbarRef"
			class="layout-main-scroll layout-backtop-header-fixed"
			wrap-class="layout-main-scroll"
			view-class="layout-main-scroll"
		>
			<LayoutParentView />
			<LayoutFooter v-if="isFooter" />
		</el-scrollbar>
		<el-backtop :target="setBacktopClass" />
		<check-token />
	</el-main>
</template>

<script setup lang="ts" name="layoutMain">
import { defineAsyncComponent } from 'vue';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';

const LayoutParentView = defineAsyncComponent(() => import('../routerView/parent.vue'));
const LayoutFooter = defineAsyncComponent(() => import('../footer/index.vue'));
const CheckToken = defineAsyncComponent(() => import('/@/components/CheckToken/index.vue'));

const layoutMainScrollbarRef = ref();
const route = useRoute();
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);

const isFooter = computed(() => {
	return themeConfig.value.isFooter && !route.meta.isIframe;
});

const isFixedHeader = computed(() => {
	return themeConfig.value.isFixedHeader;
});

const setBacktopClass = computed(() => {
	if (themeConfig.value.isFixedHeader) return `.layout-backtop-header-fixed .el-scrollbar__wrap`;
	else return `.layout-backtop .el-scrollbar__wrap`;
});

const setMainHeight = computed(() => {
	if (isTagsViewCurrenFull.value) return '0px';
	return themeConfig.value.isTagsview ? 'var(--layout-tags-height)' : '0px';
});

onMounted(() => {
	NextLoading.done(600);
});

defineExpose({
	layoutMainScrollbarRef,
});
</script>
