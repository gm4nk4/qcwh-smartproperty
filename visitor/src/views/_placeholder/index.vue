<template>
	<div class="layout-padding placeholder-view">
		<div class="placeholder-view__inner">
			<div class="placeholder-view__icon">
				<SvgIcon name="ele-Cpu" :size="40" />
			</div>
			<div class="placeholder-view__title">{{ title }}</div>
			<div class="placeholder-view__hint">{{ hint }}</div>
			<div class="placeholder-view__path">{{ currentPath }}</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="placeholderView">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const title = computed(() => {
	const metaTitle = (route.meta && (route.meta as any).title) as string | undefined;
	return metaTitle || 'Coming soon';
});

const hint = computed(() => 'Phase 1 任务尚未迁移该页面,后续 Track 完成后将替换此占位。');

const currentPath = computed(() => route.fullPath);
</script>

<style scoped lang="scss">
.placeholder-view {
	display: flex;
	flex: 1;
	min-height: 100%;
}
.placeholder-view__inner {
	margin: auto;
	max-width: 520px;
	padding: 48px 32px;
	text-align: center;
	border-radius: 16px;
	background: var(--el-fill-color-blank, #ffffff);
	box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}
.placeholder-view__icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 72px;
	height: 72px;
	border-radius: 50%;
	background: var(--el-color-primary-light-9, #ecf5ff);
	color: var(--el-color-primary, #409eff);
	margin-bottom: 16px;
}
.placeholder-view__title {
	font-size: 20px;
	font-weight: 600;
	color: var(--el-text-color-primary, #303133);
	margin-bottom: 8px;
}
.placeholder-view__hint {
	font-size: 14px;
	color: var(--el-text-color-regular, #606266);
	line-height: 1.6;
	margin-bottom: 16px;
}
.placeholder-view__path {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 999px;
	font-family: 'JetBrains Mono', 'Menlo', monospace;
	font-size: 12px;
	color: var(--el-text-color-secondary, #909399);
	background: var(--el-fill-color-light, #f5f7fa);
}
</style>
