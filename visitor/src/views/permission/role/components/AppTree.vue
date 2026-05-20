<template>
	<div class="tree-section">
		<!-- 搜索框 -->
		<div class="search-box">
			<el-input v-model="searchText" placeholder="请输入应用名称" clearable size="small">
				<template #prefix>
					<el-icon><Search /></el-icon>
				</template>
			</el-input>
		</div>
		<div class="tree-container">
			<el-tree
				ref="treeRef"
				:data="treeData"
				:props="treeProps"
				node-key="id"
				:expand-on-click-node="false"
				default-expand-all
				:highlight-current="true"
				@node-click="handleNodeClick"
				class="custom-tree"
			>
				<template #default="{ data }">
					<div class="tree-node" :class="{ isLeaf: isLeaf(data) }">
						<div class="node-content">
							<div class="node-main">
								<span v-if="data.type === 'group'" class="tree-icon group-icon">
									<svg viewBox="0 0 24 24" fill="none">
										<path d="M3 4H13V14H3V4ZM11 16H21V21H11V16ZM13 6H21V11H13V6Z" fill="#64748B" />
									</svg>
								</span>
								<span v-else class="tree-icon app-icon">
									<svg viewBox="0 0 24 24" fill="none">
										<path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V4ZM14 14H20V20H14V4Z" fill="#64748B" />
									</svg>
								</span>
								<span class="node-name">{{ data.name }}</span>
								<span v-if="data.count !== undefined" class="tree-count">{{ data.count }}</span>
							</div>
						</div>
					</div>
				</template>
			</el-tree>
		</div>
	</div>
</template>

<script setup lang="ts" name="AppTree">
/**
 * 应用树形组件
 */

import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import type { AppTreeNode } from '../type';

interface Props {
	treeData: AppTreeNode[];
}

defineProps<Props>();

const emit = defineEmits<{
	(e: 'node-click', data: AppTreeNode): void;
}>();

const treeRef = ref();
const searchText = ref('');

const treeProps = {
	label: 'name',
	children: 'children',
};

const isLeaf = (data: AppTreeNode) => !data.children || data.children.length === 0;

const handleNodeClick = (data: AppTreeNode) => {
	emit('node-click', data);
};
</script>

<style scoped lang="scss">
.tree-section {
	border-radius: 10px;
	border: 1px solid #e5e7eb;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.search-box {
	padding: 16px;
	border-bottom: 1px solid #f0f0f0;
}

.tree-container {
	flex: 1;
	overflow-y: auto;
	padding: 8px 16px;
}

.tree-node {
	width: 100%;
	.node-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0px;
		height: 42px;
		border-radius: 6px;
		padding-right: 10px;
		transition: background 0.2s;

		&:hover {
			// background: var(--el-color-primary-light-9);
		}

		.node-main {
			display: flex;
			align-items: center;
			gap: 8px;
			flex: 1;

			.node-name {
				font-size: 14px;
				color: #1f2937;
				font-weight: 500;
			}

			.tree-icon {
				width: 18px;
				height: 18px;
				flex-shrink: 0;

				svg {
					display: block;
					width: 100%;
					height: 100%;
				}
			}

			.tree-count {
				font-size: 12px;
				color: #909399;
				margin-left: auto;
			}
		}
	}
}
.isLeaf {
	padding-left: 10px !important;
}

:deep(.el-tree-node__content) {
	height: auto;
	padding: 0;
	border-radius: 6px;
}

:deep(.el-tree-node__expand-icon) {
	padding: 8px;
}

:deep(.custom-tree) {
	.el-tree-node {
		position: relative;
	}

	.el-tree-node__children {
		position: relative;
		padding-left: 24px;

		&::before {
			content: '';
			position: absolute;
			left: 13px;
			top: 0;
			bottom: 0;
			width: 1px;
			background: #d1d5db;
		}
	}

	.el-tree-node__content {
		padding-left: 0 !important;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			left: -11px;
			top: 50%;
			width: 14px;
			height: 1px;
			background: #d1d5db;
		}
		.is-leaf {
			display: none;
		}
	}

	.el-tree-node:last-child > .el-tree-node__children::before {
		height: 50%;
		bottom: auto;
	}

	.el-tree-node.is-leaf > .el-tree-node__content::before {
		width: 14px;
	}

	& > .el-tree-node > .el-tree-node__content::before {
		display: none;
	}
}
</style>
