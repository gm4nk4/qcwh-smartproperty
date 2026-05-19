<template>
	<LayoutDefaults :showBack="showBack" @back="onBack">
	</LayoutDefaults>
	<LockScreen v-if="themeConfig.isLockScreen" />
</template>

<script setup lang="ts" name="layout">
import { onBeforeMount, onUnmounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Local } from '/@/utils/storage';
import mittBus from '/@/utils/mitt';

defineOptions({
	name: 'Layout',
});

defineProps<{
	showBack?: boolean;
}>();

const emit = defineEmits<{
	back: [];
}>();

const onBack = () => {
	emit('back');
};

const LayoutDefaults = defineAsyncComponent(() => import('./main/defaults.vue'));
const LockScreen = defineAsyncComponent(() => import('./lockScreen/index.vue'));

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

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
