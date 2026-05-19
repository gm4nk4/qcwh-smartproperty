<template>
	<Layout :showBack="inQiankun" @back="onBack" />
</template>

<script setup lang="ts" name="layout">
import { onBeforeMount, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Local } from '/@/utils/storage';
import mittBus from '/@/utils/mitt';
import { Layout } from '@zhqc-smart/layout';
import { useQiankun } from '/@/hooks/useQiankun';

const { goMainApp, inQiankun } = useQiankun();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const onBack = () => {
	goMainApp();
};

const onLayoutResize = () => {
	if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) {
		themeConfig.value.isCollapse = false;
		mittBus.emit('layoutMobileResize', {
			layout: 'defaults',
			clientWidth,
		});
	} else {
		mittBus.emit('layoutMobileResize', {
			layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
			clientWidth,
		});
	}
};

onBeforeMount(() => {
	onLayoutResize();
	window.addEventListener('resize', onLayoutResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', onLayoutResize);
});
</script>
