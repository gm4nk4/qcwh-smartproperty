<template>
	<div class="layout-preview">
		<div class="preview-header">
			<div class="preview-title">工作台布局预览</div>
			<div class="preview-meta">{{ totalModules }}个模块 · {{ visibleRows }}行</div>
			<div class="preview-actions">
				<el-button size="small">
					<el-icon><Setting /></el-icon>
					角色预览
				</el-button>
				<el-button
					size="small"
					@click="handleReset"
				>
					<el-icon><Refresh /></el-icon>
					重置
				</el-button>
				<el-button
					type="primary"
					size="small"
					@click="handleSave"
				>
					<el-icon><DocumentChecked /></el-icon>
					保存配置
				</el-button>
			</div>
		</div>

		<div class="preview-grid">
			<div class="layout-modules">
				<div
					v-for="(row, rowIndex) in modulesByRow"
					:key="rowIndex"
					class="layout-row"
				>
					<div
						v-for="module in row"
						:key="module.id"
						class="layout-module"
						:class="`tag-${module.type}`"
						:style="{
							width: `${(module.width / 24) * 100}%`,
							height: `${module.height + 20}px`,
						}"
					>
						<div class="module-box">
							<div class="module-header">
								<div
									class="module-tag"
									:class="`tag-${module.type}`"
								>
									{{ module.type === 'public' ? '公共' : '子应用' }}
								</div>
								<div class="module-name">{{ module.name }}</div>
							</div>
							<div class="module-body">
								<div class="module-placeholder">
									<el-icon><Setting /></el-icon>
									<span>关联的{{ module.type === 'public' ? '公共模块' : '应用' }}</span>
								</div>
								<div class="module-footer">
									<span>拖拽时自动调整宽度 · 高度200px</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="LayoutPreview">
/**
 * 工作台布局预览组件
 * @description 右侧布局预览和配置区域，支持模块拖拽和保存配置
 */

import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Setting, Refresh, DocumentChecked } from '@element-plus/icons-vue';
import type { LayoutModuleItem } from '../type';
import { mockLayoutModules } from '../mock';

/** Props 定义 */
interface Props {
	/** 布局模块列表 */
	layoutModules?: LayoutModuleItem[];
}

/** Emits 定义 */
interface Emits {
	/** 保存配置事件 */
	(e: 'save'): void;
	/** 重置事件 */
	(e: 'reset'): void;
}

const props = withDefaults(defineProps<Props>(), {
	layoutModules: () => [...mockLayoutModules],
});

const emit = defineEmits<Emits>();

/** 总模块数 */
const totalModules = computed(() => props.layoutModules.length);

/** 可见行数 */
const visibleRows = computed(() => {
	const modules = props.layoutModules.filter((m) => m.checked);
	if (modules.length === 0) return 1;
	const maxY = Math.max(...modules.map((m) => m.y || 0));
	return Math.ceil(maxY / 80) + 1;
});

/** 将模块按行分组 */
const modulesByRow = computed(() => {
	const modules = props.layoutModules.filter((m) => m.checked);
	const rows: LayoutModuleItem[][] = [];

	modules.forEach((module) => {
		const rowIndex = Math.floor((module.y || 0) / 80);
		if (!rows[rowIndex]) {
			rows[rowIndex] = [];
		}
		rows[rowIndex].push(module);
	});

	// 按x坐标排序
	rows.forEach((row) => {
		row.sort((a, b) => (a.x || 0) - (b.x || 0));
	});

	return rows;
});

/** 处理保存 */
const handleSave = () => {
	ElMessage.success('保存配置成功');
	emit('save');
};



/** 处理重置 */
const handleReset = async () => {
	try {
		await ElMessageBox.confirm('确定要重置配置吗？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
		ElMessage.info('配置已重置');
		emit('reset');
	} catch {
		// 用户取消操作
	}
};
</script>

<style scoped lang="scss">
.layout-preview {
	flex: 1;
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	height: calc(100vh - 360px);
	overflow: hidden;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid #e5e7eb;
	flex-shrink: 0;

	.preview-title {
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
	}

	.preview-meta {
		font-size: 13px;
		color: #6b7280;
	}

	.preview-actions {
		display: flex;
		gap: 8px;
	}
}

.preview-grid {
	position: relative;
	flex: 1;
	background: #f8fafc;
	border-radius: 8px;
	overflow: auto;
	margin-bottom: 20px;
	border: 1px solid #e5e7eb;
}

.layout-modules {
	position: relative;
	padding: 10px;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	min-height: 100%;
	box-sizing: border-box;
}

.layout-row {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
}

.layout-module {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border-radius: 8px;
	transition: all 0.2s;

	&.tag-public {
		.module-box {
			border-top: 4px solid #3b82f6;
		}
	}

	&.tag-subapp {
		.module-box {
			border-top: 4px solid #ec4899;
		}
	}

	.module-box {
		flex: 1;
		margin: 10px;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		border: 2px solid #e5e7eb;
		&:hover {
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
			border-color: #93c5fd;
		}
	}

	.module-header {
		padding: 12px;
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;

		.module-tag {
			padding: 4px 10px;
			border-radius: 4px;
			font-size: 11px;
			font-weight: 600;

			&.tag-public {
				background: #dbeafe;
				color: #1d4ed8;
			}

			&.tag-subapp {
				background: #fce7f3;
				color: #db2777;
			}
		}

		.module-name {
			font-size: 14px;
			font-weight: 600;
			color: #1f2937;
		}
	}

	.module-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 12px;
		background: #fff;
		.module-placeholder {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 8px;
			color: #9ca3af;
			font-size: 13px;

			.el-icon {
				font-size: 32px;
				opacity: 0.4;
			}
		}

		.module-footer {
			font-size: 11px;
			color: #9ca3af;
			text-align: center;
			padding-top: 8px;
			border-top: 1px dashed #e5e7eb;
		}
	}
}
</style>
