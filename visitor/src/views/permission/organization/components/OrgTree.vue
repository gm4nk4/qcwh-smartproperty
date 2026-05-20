<template>
	<div class="left-panel" :class="{ noborder: appName }">
		<div class="panel-header" v-show="showHeader">
			<div class="header-title">{{ headerTitle }}</div>
			<el-tag v-if="appName" type="warning" size="small"> 独立架构 </el-tag>
			<el-button type="primary" size="small" @click="handleAddOrg">
				<slot name="add-btn">添加部门</slot>
			</el-button>
		</div>
		<div class="tree-container">
			<CustomTree
				ref="treeRef"
				node-key="id"
				:data="organizations"
				tree-type="border"
				:selected-node-id="selectedNodeId"
				v-bind="$attrs"
				@node-click="handleNodeClick"
				@edit="handleEditOrg"
				@delete="handleDelete"
				@add-item="handleAdd"
			>
				<template #add-item="{ data }">
					<div>
						<el-icon v-show="data.id == 1"><Plus /></el-icon>
					</div>
				</template>
			</CustomTree>
		</div>
	</div>
</template>

<script setup lang="ts" name="OrgTree">
/**
 * 组织架构树组件
 */

import CustomTree from '/@/components/CustomTree/index.vue';
import type { Organization } from '../type';

interface Props {
	organizations: Organization[];
	selectedNodeId?: number;
	headerTitle?: string;
	showHeader?: boolean;
	appName?: string;
}

withDefaults(defineProps<Props>(), {
	organizations: () => [],
	selectedNodeId: 1,
	showHeader: true,
	headerTitle: '统一组织架构树（全平台共用）',
	appName: '',
});

const emit = defineEmits<{
	(e: 'node-click', data: Organization): void;
	(e: 'add-org'): void;
	(e: 'edit-org', data: Organization): void;
	(e: 'delete', data: Organization): void;
	(e: 'add-item', data: Organization): void;
}>();

const treeRef = ref();

const handleNodeClick = (data: Organization) => {
	emit('node-click', data);
};

const handleAddOrg = () => {
	emit('add-org');
};

const handleEditOrg = (data: Organization) => {
	emit('edit-org', data);
};

const handleDelete = (data: Organization) => {
	emit('delete', data);
};

const handleAdd = (data: Organization) => {
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
.left-panel {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border: 1px solid #e5eaf3;
	border-radius: 10px;
	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 16px 0;
		gap: 8px;

		.header-title {
			font-size: 14px;
			font-weight: 500;
			color: #1f2937;
			flex: 1;
		}
	}

	.tree-container {
		flex: 1;
		overflow-y: auto;
		padding: 8px 12px;
		min-height: 0;
	}
}
.noborder {
	border: none;
}
</style>
