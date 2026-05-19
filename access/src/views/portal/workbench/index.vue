<template>
	<div class="workbench-config">
		<StatCards :stats="statsData" />

		<div class="main-content">
			<ModulePanel
				:public-modules="publicModules"
				:sub-app-modules="subAppModules"
				:color-schemes="colorSchemes"
				@update="handleModuleUpdate"
			/>

			<LayoutPreview
				:layout-modules="layoutModules"
				@save="handleSave"
				@cancel="handleCancel"
				@reset="handleReset"
			/>
		</div>
	</div>
</template>

<script setup lang="ts" name="WorkbenchConfig">
/**
 * 工作台配置主页面
 * @description 工作台配置页面，包含模块管理和布局预览功能
 */

import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import StatCards from './components/StatCards.vue';
import ModulePanel from './components/ModulePanel.vue';
import LayoutPreview from './components/LayoutPreview.vue';
import type { StatsData, ModuleItem, LayoutModuleItem, ColorScheme } from './type';
import { mockStatsData, mockPublicModules, mockSubAppModules, mockLayoutModules, mockColorSchemes } from './mock';

/** 统计数据 */
const statsData = reactive<StatsData>({ ...mockStatsData });

/** 公共模块列表 */
const publicModules = ref<ModuleItem[]>([...mockPublicModules]);

/** 子应用模块列表 */
const subAppModules = ref<ModuleItem[]>([...mockSubAppModules]);

/** 布局模块列表 */
const layoutModules = ref<LayoutModuleItem[]>([...mockLayoutModules]);

/** 颜色方案列表 */
const colorSchemes = ref<ColorScheme[]>([...mockColorSchemes]);

/** 处理模块更新 */
const handleModuleUpdate = (data: { publicModules: ModuleItem[]; subAppModules: ModuleItem[] }) => {
	publicModules.value = data.publicModules;
	subAppModules.value = data.subAppModules;

	// 更新布局模块的宽度和勾选状态
	syncLayoutModules();

	const totalChecked = publicModules.value.filter((m) => m.checked).length + subAppModules.value.filter((m) => m.checked).length;

	statsData.displayedModules = totalChecked;
};

/** 同步布局模块的宽度和勾选状态 */
const syncLayoutModules = () => {
	layoutModules.value = publicModules.value.concat(subAppModules.value).map((module) => ({
		...module,
		x: 0,
		y: 0,
		visible: module.checked,
		tagType: module.type === 'public' ? 'public' : 'subapp',
	}));
};

/** 处理保存 */
const handleSave = () => {
	ElMessage.success('工作台配置保存成功');
};

/** 处理取消 */
const handleCancel = () => {
	ElMessage.info('已取消操作');
};

/** 处理重置 */
const handleReset = () => {
	publicModules.value = [...mockPublicModules];
	subAppModules.value = [...mockSubAppModules];
	layoutModules.value = [...mockLayoutModules];
	statsData.displayedModules = mockStatsData.displayedModules;
	ElMessage.success('配置已重置');
};
</script>

<style scoped lang="scss">
.workbench-config {
	padding: 20px;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
}

.main-content {
	display: flex;
	gap: 20px;
	flex: 1;
}
</style>
