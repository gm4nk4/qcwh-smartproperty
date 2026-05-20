<template>
	<el-dialog
		v-model="dialogVisible"
		:title="dialogTitle"
		width="900px"
		class="permission-assign-dialog"
		:close-on-click-modal="false"
		destroy-on-close
	>
		<!-- 顶部操作栏 -->
		<div class="toolbar">
			<div class="toolbar-left">
				<el-button type="primary" size="small" :icon="Expand" @click="expandAll">
					{{ allExpanded ? '折叠全部' : '展开全部' }}
				</el-button>
				<el-button type="primary" size="small" @click="checkAll">
					{{ allChecked ? '全不选' : '全选' }}
				</el-button>
			</div>
			<div class="toolbar-right">
				<span class="checked-count"> 已选 {{ checkedCount }}/{{ totalCount }} 个功能 </span>
			</div>
		</div>

		<!-- 权限树 -->
		<div class="permission-tree-container" v-if="dialogVisible">
			<el-tree
				ref="treeRef"
				:key="treeKey"
				:data="permissionTree"
				:props="treeProps"
				show-checkbox
				node-key="id"
				:default-expand-all="allExpanded"
				:expand-on-click-node="false"
				:default-checked-keys="defaultCheckedKeys"
				@check="handleCheck"
				class="permission-tree"
			/>
		</div>

		<!-- 底部按钮 -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSave">确认分配</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { Expand } from '@element-plus/icons-vue';
import type { PermissionTreeNode, PermissionAssignDialogProps, PermissionAssignDialogEmits } from '../type';
import { mockPermissionTree } from '../mock';

const props = defineProps<PermissionAssignDialogProps>();
const emit = defineEmits<PermissionAssignDialogEmits>();

const treeRef = ref();

// 对话框标题
const dialogTitle = computed(() => {
	return props.roleInfo ? `权限分配 - ${props.roleInfo.roleName}` : '权限分配';
});

// 对话框可见性
const dialogVisible = computed({
	get: () => props.visible,
	set: (val) => emit('update:visible', val),
});

// 树配置
const treeProps = {
	children: 'children',
	label: 'label',
};

// 权限树数据
const permissionTree = ref<PermissionTreeNode[]>([]);

// 默认选中的权限
const defaultCheckedKeys = ref<string[]>([]);

// 用于强制重新渲染树的 key
const treeKey = ref(0);

// 是否全部展开
const allExpanded = ref(true);

// 是否全部选中
const allChecked = ref(false);

// 初始化权限树
const initPermissionTree = () => {
	permissionTree.value = JSON.parse(JSON.stringify(mockPermissionTree));
	allChecked.value = false;
	allExpanded.value = true;
};

// 计算已选数量
const checkedCount = computed(() => {
	if (!treeRef.value) return 0;
	const checkedNodes = treeRef.value.getCheckedKeys();
	const halfCheckedNodes = treeRef.value.getHalfCheckedKeys();
	return checkedNodes.length + halfCheckedNodes.length;
});

// 计算总数
const totalCount = computed(() => {
	const countNodes = (nodes: PermissionTreeNode[]): number => {
		let count = 0;
		nodes.forEach((node) => {
			count++;
			if (node.children) {
				count += countNodes(node.children);
			}
		});
		return count;
	};
	return countNodes(permissionTree.value);
});

// 处理节点选中
const handleCheck = () => {
	updateAllCheckedStatus();
};

// 更新全选状态
const updateAllCheckedStatus = () => {
	if (!treeRef.value) return;
	const allKeys = getAllKeys(permissionTree.value);
	const checkedKeys = treeRef.value.getCheckedKeys(true);
	allChecked.value = allKeys.length === checkedKeys.length;
};

// 获取所有节点的key
const getAllKeys = (nodes: PermissionTreeNode[]): string[] => {
	const keys: string[] = [];
	nodes.forEach((node) => {
		keys.push(node.id);
		if (node.children) {
			keys.push(...getAllKeys(node.children));
		}
	});
	return keys;
};

// 暂存当前选中的权限
const savedCheckedKeys = ref<string[]>([]);

// 展开/折叠全部
const expandAll = () => {
	// 保存当前选中的权限
	if (treeRef.value) {
		const checkedKeys = treeRef.value.getCheckedKeys(true);
		savedCheckedKeys.value = checkedKeys;
	}

	// 切换展开状态
	allExpanded.value = !allExpanded.value;

	// 强制重新渲染树
	treeKey.value++;

	// 恢复选中的权限
	nextTick(() => {
		if (treeRef.value && savedCheckedKeys.value.length > 0) {
			treeRef.value.setCheckedKeys(savedCheckedKeys.value);
		}
	});
};

// 全选/全不选
const checkAll = () => {
	allChecked.value = !allChecked.value;
	if (!treeRef.value) return;

	if (allChecked.value) {
		const allKeys = getAllKeys(permissionTree.value);
		treeRef.value.setCheckedKeys(allKeys);
	} else {
		treeRef.value.setCheckedKeys([]);
	}
};

// 初始化编辑模式下的选中权限
const initCheckedPermissions = (roleInfo: any) => {
	// 这里可以根据实际情况从 roleInfo 中获取已分配的权限
	// 目前先选中前几个演示
	const demoKeys = [
		'app-work-order',
		'work-order-view',
		'work-order-list',
		'work-order-detail',
		'work-order-manage',
		'work-order-edit',
		'work-order-assign',
	];
	defaultCheckedKeys.value = demoKeys;
};

// 取消
const handleCancel = () => {
	dialogVisible.value = false;
};

// 保存
const handleSave = () => {
	if (!treeRef.value) return;

	const checkedKeys = treeRef.value.getCheckedKeys();
	const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();

	const saveData = {
		checkedKeys: [...checkedKeys, ...halfCheckedKeys],
		permissions: permissionTree.value,
	};

	emit('save', saveData);
	dialogVisible.value = false;
};

// 监听 visible 变化
watch(
	() => props.visible,
	(val) => {
		if (val) {
			initPermissionTree();
			if (props.roleInfo) {
				initCheckedPermissions(props.roleInfo);
			} else {
				defaultCheckedKeys.value = [];
			}
			// 重置为展开状态
			allExpanded.value = true;
			treeKey.value++;
		}
	}
);
</script>

<style scoped lang="scss">
.permission-assign-dialog {
	:deep(.el-dialog__header) {
		margin: 0;
		padding: 16px 24px;
		border-bottom: 1px solid #e5e7eb;
		background: linear-gradient(135deg, #0088ff 0%, #0066cc 100%);

		.el-dialog__title {
			color: #ffffff;
			font-size: 16px;
			font-weight: 600;
		}

		.el-dialog__headerbtn {
			.el-dialog__close {
				color: #ffffff;

				&:hover {
					color: #f3f4f6;
				}
			}
		}
	}

	:deep(.el-dialog__body) {
		padding: 20px 24px;
	}

	:deep(.el-dialog__footer) {
		padding: 16px 24px;
		border-top: 1px solid #e5e7eb;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid #e5e7eb;

		.toolbar-left {
			display: flex;
			gap: 12px;
		}

		.toolbar-right {
			.checked-count {
				font-size: 13px;
				color: #6b7280;
			}
		}
	}

	.permission-tree-container {
		max-height: 500px;
		overflow-y: auto;
		padding: 8px;
		background: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
	}

	.permission-tree {
		background: transparent;

		:deep(.el-tree-node__content) {
			height: 36px;
			padding: 0 8px;
			border-radius: 4px;
			transition: background-color 0.2s;

			&:hover {
				background-color: #eff6ff;
			}
		}

		:deep(.el-tree-node__label) {
			font-size: 14px;
			color: #374151;
		}

		:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
			background-color: #0088ff;
			border-color: #0088ff;
		}

		:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
			background-color: #0088ff;
			border-color: #0088ff;
		}
	}

	.dialog-footer {
		display: flex;
		justify-content: center;
		gap: 12px;

		.el-button {
			min-width: 100px;
		}
	}
}
</style>
