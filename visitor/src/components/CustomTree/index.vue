<template>
	<div class="custom-tree-container" :class="{ 'is-line': treeType === 'line', 'is-border': treeType === 'border' }">
		<el-tree
			ref="treeRef"
			v-bind="$attrs"
			:data="data"
			:props="treeProps"
			:expand-on-click-node="false"
			default-expand-all
			class="custom-tree"
			@node-click="handleNodeClick"
		>
			<template #default="{ node, data }">
				<div class="tree-node" :class="{ isLeaf: isLeaf(data) }">
					<div class="node-content" :class="{ active: selectedNodeId === data.id }">
						<div class="node-main">
							<template v-if="treeType === 'border'">
								<div class="node-icon">{{ data.name.charAt(0) }}</div>
								<div class="node-info">
									<div class="node-name">
										<div>{{ data.name }}</div>
										<div class="node-meta">
											<span class="node-count">{{ data.memberCount }} 人</span>
										</div>
									</div>
									<div class="node-manager">负责人：{{ data.manager }}（{{ data.position }}）</div>
								</div>
							</template>
							<template v-else>
								<div class="node-info">
									<span class="node-name">{{ data.name }}</span>
									<span v-if="data.code" class="node-code">{{ data.code }}</span>
									<el-tag v-if="data.typeLabel" :type="getTagType(data.type)" size="small">
										{{ data.typeLabel }}
									</el-tag>
								</div>
							</template>
						</div>
						<div class="node-actions">
							<el-button type="primary" link size="small" @click="handleAdd(data)">
								<slot name="add-item" :data="data">
									<el-icon><Plus /></el-icon>
								</slot>
							</el-button>
							<el-button type="primary" link size="small" @click="handleEdit(data)">
								<slot name="edit-item" :data="data">
									<el-icon><Edit /></el-icon>
								</slot>
							</el-button>
							<el-button type="danger" link size="small" @click="handleDelete(data)">
								<slot name="delete-item" :data="data">
									<el-icon><Delete /></el-icon>
								</slot>
							</el-button>
						</div>
					</div>
				</div>
			</template>
		</el-tree>
	</div>
</template>

<script setup lang="ts" name="CustomTree">
/**
 * 统一树形组件 - 支持组织架构和空间两种样式
 */

type TreeType = 'line' | 'border';

interface Props {
	data: any[];
	treeType?: TreeType;
	selectedNodeId?: number;
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	treeType: 'border',
	selectedNodeId: undefined,
});

const emit = defineEmits<{
	(e: 'node-click', data: any): void;
	(e: 'edit', data: any): void;
	(e: 'delete', data: any): void;
	(e: 'add-item', data: any): void;
}>();

const treeRef = ref();
const treeProps = {
	children: 'children',
	label: 'name',
};

const isLeaf = (data: any) => !data.children || data.children.length === 0;

const getTagType = (type: string) => {
	const typeMap: Record<string, any> = {
		project: 'primary',
		building: 'success',
		floor: 'warning',
		room: 'info',
		public: 'danger',
	};
	return typeMap[type] || 'info';
};

const handleNodeClick = (data: any) => {
	emit('node-click', data);
};

const handleEdit = (data: any) => {
	emit('edit', data);
};

const handleDelete = (data: any) => {
	emit('delete', data);
};

const handleAdd = (data: any) => {
	emit('add-item', data);
};

defineExpose({
	getNode: (data: any) => treeRef.value?.getNode(data),
	getCurrentNode: () => treeRef.value?.getCurrentNode(),
	setCurrentNode: (data: any) => treeRef.value?.setCurrentNode(data),
	remove: (data: any) => treeRef.value?.remove(data),
	append: (data: any, parentData: any) => treeRef.value?.append(data, parentData),
	insertBefore: (data: any, refData: any) => treeRef.value?.insertBefore(data, refData),
	insertAfter: (data: any, refData: any) => treeRef.value?.insertAfter(data, refData),
	updateKeyChildren: (data: any, children: any[]) => treeRef.value?.updateKeyChildren(data, children),
	filter: (query: any) => treeRef.value?.filter(query),
	collapse: () => treeRef.value?.collapse,
	expand: () => treeRef.value?.expand,
	expandAll: () => treeRef.value?.expandAll,
	collapseAll: () => treeRef.value?.collapseAll,
	setCheckedKeys: (keys: any[]) => treeRef.value?.setCheckedKeys(keys),
	setChecked: (data: any, checked: boolean) => treeRef.value?.setChecked(data, checked),
	getCheckedNodes: () => treeRef.value?.getCheckedNodes(),
	getCheckedKeys: () => treeRef.value?.getCheckedKeys(),
	getHalfCheckedNodes: () => treeRef.value?.getHalfCheckedNodes(),
	getHalfCheckedKeys: () => treeRef.value?.getHalfCheckedKeys(),
	setData: (data: any[]) => treeRef.value?.setData(data),
});
</script>

<style scoped lang="scss">
.custom-tree-container {
	width: 100%;
	height: 100%;

	&.is-border {
		.node-content {
			.node-main {
				.node-icon {
					width: 32px;
					height: 32px;
					background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
					border-radius: 6px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #ffffff;
					font-size: 16px;
					font-weight: 600;
					flex-shrink: 0;
				}

				.node-info {
					flex: 1;
					min-width: 0;
					line-height: 1;

					.node-name {
						display: flex;
						font-size: 14px;
						font-weight: 500;
						color: #1f2937;
						margin-bottom: 4px;
					}

					.node-meta {
						display: flex;
						align-items: center;
						gap: 8px;
						margin-bottom: 2px;

						.node-count {
							font-size: 12px;
							color: #3b82f6;
							background: #eff6ff;
							padding: 2px 6px;
							border-radius: 4px;
						}
					}

					.node-manager {
						font-size: 12px;
						color: #6b7280;
					}
				}
			}
		}
	}

	&.is-line {
		.node-content {
			.node-main {
				.node-info {
					display: flex;
					align-items: center;
					gap: 8px;

					.node-name {
						font-size: 14px;
						color: #1f2937;
						font-weight: 500;
					}

					.node-code {
						font-size: 12px;
						color: #9ca3af;
					}
				}
			}
		}
	}
}

.tree-node {
	width: 100%;

	.node-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 12px;
		border-radius: 8px;
		transition: all 0.2s;
		cursor: pointer;
		flex: 1;

		.node-main {
			display: flex;
			align-items: flex-start;
			gap: 10px;
			flex: 1;
			min-width: 0;
		}

		.node-actions {
			opacity: 0;
			transition: opacity 0.2s;
		}

		&:hover .node-actions {
			opacity: 1;
		}
	}
}
.tree-node.isLeaf {
	padding-left: 10px !important;
}

:deep(.el-tree-node__content) {
	height: auto;
	padding: 0 !important;
}

:deep(.custom-tree) {
	.el-tree-node {
		position: relative;
	}

	.el-tree-node__children {
		position: relative;
		padding-left: 26px;
		margin-left: 0;
		overflow: unset;

		&::before {
			content: '';
			position: absolute;
			left: 10px;
			top: -13px;
			bottom: 34px;
			width: 1px;
			background: #d1d5db;
		}
	}

	.el-tree-node__content {
		position: relative;
		border-radius: 10px 10px 10px 10px;
		border: 1px solid #e5eaf3;
		margin: 12px 0;
		padding-left: 0 !important;

		&::before {
			content: '';
			position: absolute;
			left: -16px;
			top: 28px;
			width: 16px;
			height: 1px;
			background: #d1d5db;
		}
	}

	.el-tree-node__expand-icon {
		padding: 8px;
	}

	.is-leaf {
		display: none;
	}
}

.is-line {
	:deep(.custom-tree) {
		.el-tree-node__children {
			padding-left: 24px;

			&::before {
				left: 13px;
				top: 0;
				bottom: 0;
			}
		}

		.el-tree-node__content {
			margin: 0;
			border: none;
			border-radius: 6px;

			&::before {
				left: -11px;
				top: 50%;
				width: 14px;
				height: 1px;
			}
		}

		.el-tree-node:last-child > .el-tree-node__children::before {
			height: 50%;
			bottom: auto;
		}

		& > .el-tree-node > .el-tree-node__content::before {
			display: none;
		}
	}

	.tree-node {
		.node-content {
			padding: 8px 0px;
			height: 42px;
			border-radius: 6px;

			.node-actions {
				:deep(.el-button) {
					padding: 4px;

					svg {
						width: 16px;
						height: 16px;
					}
				}
			}
		}
	}
}
</style>
<style lang="scss">
.custom-tree-container {
	.el-tree-node__children:empty::before {
		display: none !important;
	}

	// 根节点（最顶层）不显示横向连接线
	.el-tree > .el-tree-node > .el-tree-node__content::before {
		display: none;
	}

	// 叶子节点不显示横向连接线
	.el-tree-node.is-leaf > .el-tree-node__content::before {
		display: none;
	}
}
</style>
