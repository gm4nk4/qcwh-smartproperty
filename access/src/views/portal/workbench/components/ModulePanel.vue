<template>
	<div class="module-panel">
		<div class="panel-header">
			<div class="header-title">
				<el-icon><DataBoard /></el-icon>
				<span>模块管理</span>
			</div>
			<div class="header-desc">编辑排序 · 勾选选择显示 · 选中即可调整宽度</div>
		</div>

		<div class="edit-color-section">
			<div class="section-label">编辑颜色方案</div>
			<div class="color-scheme-selector">
				<el-select
					v-model="currentColorScheme"
					placeholder="选择颜色方案"
					style="width: 100%"
				>
					<el-option
						v-for="scheme in colorSchemes"
						:key="scheme.name"
						:label="scheme.name"
						:value="scheme.name"
					/>
				</el-select>
			</div>
		</div>

		<div class="module-content">
			<div class="module-section-container">
				<div class="module-section">
					<div class="section-title">
						<el-icon><Grid /></el-icon>
						<span>公共模块</span>
					</div>
					<div class="module-list">
						<div
							v-for="(module, index) in localPublicModules"
							:key="module.id"
							class="module-item"
							:class="{ checked: module.checked, active: activeModuleIndex === index }"
							@click.stop="handleModuleClick(index, module)"
						>
							<div class="module-checkbox">
								<span class="module-name">{{ module.name }}</span>
								<el-checkbox
									v-model="module.checked"
									:disabled="module.disabled"
									@change="handleModuleChange"
								>
								</el-checkbox>
							</div>
							<div
								class="module-controls"
								@click.stop
							>
								<el-select
									v-model="module.width"
									placeholder="宽度"
									size="small"
									style="width: 100px"
									@change="handleModuleChange"
								>
									<el-option
										v-for="width in widthOptions"
										:key="width"
										:label="`宽 ${width}列`"
										:value="width"
									/>
								</el-select>
								<div class="module-size">宽{{ module.width }} × 高{{ module.height }}</div>
							</div>
						</div>
					</div>
				</div>

				<div class="module-section">
					<div class="section-title">
						<el-icon><OfficeBuilding /></el-icon>
						<span>子应用模块</span>
					</div>
					<div class="module-list">
						<div
							v-for="(module, index) in localSubAppModules"
							:key="module.id"
							class="module-item"
							:class="{
								checked: module.checked,
								active: activeModuleIndex === index + localPublicModules.length,
								dragging: dragIndex === index,
								'drag-over': dragOverIndex === index && dragIndex !== index,
							}"
							draggable="true"
							@click.stop="handleSubAppModuleClick(index, module)"
							@dragstart="handleDragStart($event, index, 'subapp')"
							@dragend="handleDragEnd"
							@dragover.prevent="handleDragOver($event, index)"
							@drop="handleDrop($event, index, 'subapp')"
						>
							<div class="module-box">
								<div class="flex-start">
									<div class="flex-start">
										<div
											class="drag-handle"
											title="拖动排序"
										>
											<el-icon><Rank /></el-icon>
										</div>
										<div class="module-box-name">
											{{ module.name.charAt(0) }}
										</div>
									</div>
									<div class="module-info">
										<div class="module-name">
											{{ module.name }}
										</div>
										<div
											class="module-controls"
											@click.stop
										>
											<!-- <el-select
												v-model="module.width"
												placeholder="宽度"
												size="small"
												style="width: 70px"
												@change="handleModuleChange"
											>
												<el-option
													v-for="width in widthOptions"
													:key="width"
													:label="`宽 ${width}列`"
													:value="width"
												/>
											</el-select> -->
											<div class="module-size">宽{{ module.width }} × 高{{ module.height }}</div>
										</div>
									</div>
								</div>
								<div>
									<el-checkbox
										v-model="module.checked"
										:disabled="module.disabled"
										@change="handleModuleChange"
									>
									</el-checkbox>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="module-section module-tabs-container">
				<div class="section-title">
					<el-icon><Tickets /></el-icon>
					<span>{{ currentModule.name }}</span>
				</div>
				<div>
					<div class="module-tabs">
						<div class="tabs-title">列宽：</div>
						<el-button
							v-for="(tab, index) in tabOptions"
							:key="index"
							class="tab-item"
							:class="{ active: activeTab === index }"
							:disabled="!currentModule.name"
							@click="changeTab(index)"
						>
							{{ tab.label }}
						</el-button>
					</div>
					<div class="module-tabs">
						<div class="tabs-title">列高：</div>
						<el-input
							v-model="currentModule.height"
							type="number"
							:disabled="!currentModule.name"
							placeholder="请输入列高"
							size="small"
							@input="handleModuleChange"
							@change="handleModuleChange"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="ModulePanel">
/**
 * 工作台模块面板组件
 * @description 左侧模块选择和配置面板，包含颜色方案选择、公共模块和子应用模块管理
 */

import { ref, watch } from 'vue';
import { Grid, OfficeBuilding, Tickets, DataBoard, Rank } from '@element-plus/icons-vue';
import type { ModuleItem, ColorScheme } from '../type';
import { mockPublicModules, mockSubAppModules, mockColorSchemes } from '../mock';

/** Props 定义 */
interface Props {
	/** 公共模块列表 */
	publicModules?: ModuleItem[];
	/** 子应用模块列表 */
	subAppModules?: ModuleItem[];
	/** 颜色方案列表 */
	colorSchemes?: ColorScheme[];
}

/** Emits 定义 */
interface Emits {
	/** 模块更新事件 */
	(e: 'update', data: { publicModules: ModuleItem[]; subAppModules: ModuleItem[] }): void;
}

const props = withDefaults(defineProps<Props>(), {
	publicModules: () => [...mockPublicModules],
	subAppModules: () => [...mockSubAppModules],
	colorSchemes: () => [...mockColorSchemes],
});

const emit = defineEmits<Emits>();

/** 当前颜色方案 */
const currentColorScheme = ref(props.colorSchemes.find((s) => s.isDefault)?.name || '默认方案（所有角色）');

/** 本地公共模块数据 */
const localPublicModules = ref<ModuleItem[]>([...props.publicModules]);

/** 本地子应用模块数据 */
const localSubAppModules = ref<ModuleItem[]>([...props.subAppModules]);

/** 宽度选项 */
const widthOptions = [8, 16, 24];

/** 标签页选项 */
const tabOptions = [
	{ label: '1/3 列', value: 1 / 3, width: 8 },
	{ label: '2/3 列', value: 2 / 3, width: 16 },
	{ label: '整行', value: 1, width: 24 },
];

/** 当前激活的标签页 */
const activeTab = ref(0);

const activeModuleIndex = ref(-1);
const currentModule = ref<ModuleItem>({} as ModuleItem);

/** 拖拽状态 */
const dragIndex = ref(-1);
const dragOverIndex = ref(-1);
const dragType = ref<'public' | 'subapp'>('subapp');

/** 拖拽开始 */
const handleDragStart = (event: DragEvent, index: number, type: 'public' | 'subapp') => {
	dragIndex.value = index;
	dragType.value = type;
	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', String(index));
	}
};

/** 拖拽结束 */
const handleDragEnd = () => {
	dragIndex.value = -1;
	dragOverIndex.value = -1;
};

/** 拖拽经过 */
const handleDragOver = (event: DragEvent, index: number) => {
	event.preventDefault();
	dragOverIndex.value = index;
};

/** 放置 */
const handleDrop = (event: DragEvent, targetIndex: number, type: 'public' | 'subapp') => {
	event.preventDefault();
	if (dragIndex.value === -1 || dragIndex.value === targetIndex) {
		return;
	}

	// 获取要移动的模块
	const modules = type === 'public' ? localPublicModules.value : localSubAppModules.value;
	const [draggedModule] = modules.splice(dragIndex.value, 1);
	modules.splice(targetIndex, 0, draggedModule);

	// 重置拖拽状态
	dragIndex.value = -1;
	dragOverIndex.value = -1;

	// 触发更新
	handleModuleChange();
};

/** 处理模块变化 */
const handleModuleChange = () => {
	emit('update', {
		publicModules: [...localPublicModules.value],
		subAppModules: [...localSubAppModules.value],
	});
};

/** 处理模块点击 */
const handleModuleClick = (index: number, module: ModuleItem) => {
	activeModuleIndex.value = index;
	currentModule.value = module;
	initTab(module);
};

/** 初始化标签页 */
const initTab = (module: ModuleItem) => {
	tabOptions.forEach((tab, index) => {
		if (tab.width === module.width) {
			activeTab.value = index;
		}
	});
};
/** 处理标签页点击 */
const changeTab = (index: number) => {
	activeTab.value = index;
	currentModule.value.width = tabOptions[index].width;
	handleModuleChange();
};

/** 处理子应用模块点击 */
const handleSubAppModuleClick = (index: number, module: ModuleItem) => {
	activeModuleIndex.value = index + localPublicModules.value.length;
	currentModule.value = module;
	initTab(module);
};

/** 监听 props 变化，同步本地数据 */
watch(
	() => props.publicModules,
	(newVal) => {
		localPublicModules.value = [...newVal];
	},
	{ deep: true }
);

watch(
	() => props.subAppModules,
	(newVal) => {
		localSubAppModules.value = [...newVal];
	},
	{ deep: true }
);
</script>

<style scoped lang="scss">
.module-panel {
	width: 360px;
	min-width: 360px;
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	height: 100%;
	overflow-y: auto;
}

.panel-header {
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid #e5e7eb;
	flex-shrink: 0;

	.header-title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 8px;

		.el-icon {
			color: #3b82f6;
			font-size: 18px;
		}
	}

	.header-desc {
		font-size: 12px;
		color: #6b7280;
	}
}

.edit-color-section {
	margin-bottom: 24px;
	flex-shrink: 0;

	.section-label {
		font-size: 13px;
		font-weight: 600;
		color: #374151;
		margin-bottom: 10px;
	}
}

.module-content {
	flex: 1;
	.module-section-container {
		padding-right: 20px;
		height: calc(100vh - 712px);
		overflow-y: auto;
		overflow-x: hidden;
	}
}

.module-section {
	margin-bottom: 24px;
	flex-shrink: 0;

	.section-title {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		font-weight: 600;
		color: #374151;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 2px solid #3b82f6;

		.el-icon {
			color: #3b82f6;
			font-size: 16px;
		}
	}

	.module-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.module-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		.flex-start {
			display: flex;
			align-items: center;
			gap: 8px;
		}
		.module-box-name {
			height: 42px;
			width: 42px;
			font-weight: 500;
			font-size: 16px;
			color: #1677ff;
			text-align: center;
			background: rgba(22, 119, 255, 0.05);
			border-radius: 6px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.drag-handle {
			cursor: grab;
			padding: 4px;
			color: #9ca3af;
			transition: color 0.2s;
			&:hover {
				color: #3b82f6;
			}
			&:active {
				cursor: grabbing;
			}
		}
	}
	.module-item {
		padding: 14px 12px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: #f9fafb;
		transition: all 0.2s;
		.module-checkbox {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&:hover {
			border-color: #93c5fd;
			background: #eff6ff;
		}

		&.active {
			border-color: #3b82f6;
			background: #eff6ff;
		}

		&.dragging {
			opacity: 0.5;
			border-style: dashed;
			cursor: grabbing;
		}

		&.drag-over {
			border-color: #3b82f6;
			border-style: dashed;
			background: #eff6ff;
			transform: scale(1.02);
		}

		.module-controls {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 10px;
		}

		.module-size {
			font-size: 12px;
			color: #9ca3af;
			background: white;
			padding: 4px 8px;
			border-radius: 4px;
			border: 1px solid #e5e7eb;
		}

		.module-app {
			font-size: 12px;
			color: #d97706;
			background: #fef3c7;
			padding: 4px 8px;
			border-radius: 4px;
		}
	}

	.module-tabs {
		display: flex;
		align-items: center;
		gap: 8px;
		.tabs-title {
			font-size: 14px;
			color: #374151;
			width: 60px;
		}
		.tab-item {
			flex: 1;
			&:hover {
				border-color: #93c5fd;
				background: #eff6ff;
			}

			&.active {
				background: #3b82f6;
				color: #fff;
				border-color: #3b82f6;
			}
		}
	}
}
.module-tabs:last-child {
	margin-top: 10px;
}
.module-tabs-container {
	margin-top: 24px;
	margin-bottom: 0;
}
</style>
