<template>
	<div class="layout-logo" :class="{ 'is-collapsed': !setShowLogo }" @click="onThemeConfigChange">
		<img :src="brandLogo" alt="" class="layout-logo__mark" />
		<span v-if="setShowLogo" class="layout-logo__title">{{ themeConfig.globalTitle }}</span>
	</div>
</template>

<script setup lang="ts" name="layoutLogo">
import { useThemeConfig } from '/@/stores/themeConfig';
import { useThemeImage } from '/@/utils/themeImages';
import logoMini from '/@/assets/logo-mini.svg';


const handleBack = () => {
  // 直接调用
  (window as any)?.__QIANKUN__?.goMainApp();
};

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const brandBadge = useThemeImage('brandBadge');
const brandLogo = computed(() => brandBadge.value || logoMini);

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	if (themeConfig.value.layout === 'transverse') return false;
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};
</script>

<style scoped lang="scss">
.layout-logo {
	width: 100%;
	min-height: var(--layout-sidebar-header-height);
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 22px var(--layout-sidebar-item-offset) 18px;
	color: var(--theme-text-system);
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	min-width: 0;

	&__mark {
		flex: none;
		display: block;
		width: 34px;
		height: 34px;
		object-fit: contain;
	}

	&__title {
		white-space: nowrap;
		display: inline-block;
		font-size: 18px;
		line-height: 1;
		font-weight: 700;
		letter-spacing: 0.02em;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	&.is-collapsed {
		justify-content: center;
		padding-inline: 0;

		.layout-logo__mark {
			width: 30px;
			height: 30px;
		}
	}
}
</style>
