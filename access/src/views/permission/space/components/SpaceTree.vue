<template>
	<div class="tree-section">
		<div class="tree-container">
			<CustomTree
				ref="treeRef"
				:data="spaces"
				tree-type="line"
				node-key="id"
				v-bind="$attrs"
				@edit="handleEditSpace"
				@delete="handleDelete"
				@add-space="handleAddSubSpace"
			/>
		</div>
	</div>
</template>

<script setup lang="ts" name="SpaceTree">
/**
 * 空间树形组件
 */

import CustomTree from '/@/components/CustomTree/index.vue';
import type { Space } from '../type';

interface Props {
	spaces: Space[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: 'edit-space', data: Space): void;
	(e: 'delete', data: Space): void;
	(e: 'add-space', parentData?: Space): void;
}>();

const treeRef = ref();

const handleEditSpace = (data: Space) => {
	emit('edit-space', data);
};

const handleDelete = (data: Space) => {
	emit('delete', data);
};

const handleAddSubSpace = (data: Space) => {
	emit('add-space', data);
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
.tree-section {
	border-radius: 10px;
	border: 1px solid #e5e7eb;
	height: calc(100vh - 450px);
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.tree-actions {
		display: flex;
		justify-content: flex-end;
		padding: 8px 16px;
		border-bottom: 1px solid #f0f0f0;

		:deep(.el-button) {
			padding: 4px;

			svg {
				width: 18px;
				height: 18px;
			}
		}
	}

	.tree-container {
		flex: 1;
		overflow-y: auto;
		padding: 8px 16px;
	}
}
</style>
