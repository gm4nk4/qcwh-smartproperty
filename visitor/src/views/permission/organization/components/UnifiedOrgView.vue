<template>
	<div class="unified-org-view">
		<!-- 编辑弹窗 -->
		<OrgEditDialog v-model:visible="editDialogVisible" :org-info="editingOrgInfo" @save="handleOrgSave" />

		<!-- 小统计卡片 -->
		<div class="mini-stats">
			<div class="mini-stat-card">
				<div class="mini-stat-label">总部门数</div>
				<div class="mini-stat-value">{{ totalDepartments }}</div>
			</div>
			<div class="mini-stat-card highlight">
				<div class="mini-stat-label">总人数</div>
				<div class="mini-stat-value">{{ totalMembers }}</div>
			</div>
			<div class="mini-stat-card">
				<div class="mini-stat-label">一级部门</div>
				<div class="mini-stat-value">{{ organizations.length }}</div>
			</div>
			<div class="mini-stat-card">
				<div class="mini-stat-label">管理层级</div>
				<div class="mini-stat-value">3 级</div>
			</div>
		</div>

		<!-- 主体内容区 -->
		<div class="unified-main-content">
			<!-- 左侧组织树 -->
			<OrgTree
				:organizations="organizations"
				:selected-node-id="selectedNodeId"
				@node-click="handleNodeClick"
				@add-org="handleAddOrg"
				@edit-org="handleEditOrg"
				@delete="handleDeleteOrg"
				@add-item="handleItemOrg"
			/>

			<!-- 右侧表格 -->
			<div class="right-panel">
				<div class="table-container">
					<ConfigurableTableWithForm
						ref="tableRef"
						:table-config="tableConfig"
						@search="handleSearch"
						@reset="handleReset"
						@operation="handleTableOperation"
						:showExport="false"
						:showColumnSettings="false"
						:showSearchToggle="false"
						:showRefresh="false"
					>
					</ConfigurableTableWithForm>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="UnifiedOrgView">
/**
 * 统一组织架构视图组件
 */

import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Organization } from '../type';
import { flattenOrganizations } from '../mock';
import OrgTree from './OrgTree.vue';
import OrgEditDialog from './OrgEditDialog.vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig, type Operation } from '@zhqc-smart/table';

interface Props {
	organizations: Organization[];
	selectedNodeId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: 'update:selectedNodeId', id: number): void;
	(e: 'update:organizations', orgs: Organization[]): void;
}>();

const tableRef = ref();

// 编辑弹窗相关
const editDialogVisible = ref(false);
const editingOrgInfo = ref<Organization | null>(null);

// 计算统计数据
const totalDepartments = computed(() => flattenOrganizations(props.organizations).length);
const totalMembers = computed(() => {
	let count = 0;
	props.organizations.forEach((org) => {
		count += org.memberCount;
		if (org.children) {
			org.children.forEach((child) => {
				count += child.memberCount;
				if (child.children) {
					child.children.forEach((subChild) => {
						count += subChild.memberCount;
					});
				}
			});
		}
	});
	return count;
});

// 表格数据（扁平化）
const tableData = computed(() => flattenOrganizations(props.organizations));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'name', label: '部门名称', width: 180, align: 'center' },
	{ prop: 'manager', label: '负责人', width: 120, align: 'center' },
	{ prop: 'position', label: '岗位', align: 'center' },
	{ prop: 'memberCount', label: '人数', width: 100, align: 'center' },
	{ prop: 'parentName', label: '上级部门', align: 'center' },
];
// 表格配置
const tableConfig = ref<TableConfig>({
	columns: tableColumns,
	data: tableData.value,
	showIndex: true,
	loading: false,
	pagination: true,
	pageSize: 10,
	currentPage: 1,
	total: 500,
	showAddButton: false,
	showExportButton: false,
	showResetButton: false,
	autoLoad: false,
	rightToolbar: {
		showSearch: false,
		export: true,
	},
});

/**
 * 节点点击事件
 */
const handleNodeClick = (data: Organization) => {
	emit('update:selectedNodeId', data.id);
};

/**
 * 添加组织
 */
const handleAddOrg = () => {
	editingOrgInfo.value = null;
	editDialogVisible.value = true;
};

const handleItemOrg = (data: Organization) => {
	editingOrgInfo.value = null;
	editDialogVisible.value = true;
};

const handleDeleteOrg = (data: Organization) => {
	handleDelete(data);
};
/**
 * 编辑组织
 */
const handleEditOrg = (data: Organization) => {
	editingOrgInfo.value = data;
	editDialogVisible.value = true;
};

/**
 * 删除组织
 */
const handleDelete = async (item: Organization) => {
	try {
		await ElMessageBox.confirm(`确定要删除部门"${item.name}"吗？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
		// 创建新数组
		const newOrgs = JSON.parse(JSON.stringify(props.organizations));
		deleteOrg(newOrgs, item.id);
		emit('update:organizations', newOrgs);
		ElMessage.success('删除成功');
	} catch {
		// 用户取消操作
	}
};

/**
 * 删除组织递归函数
 */
function deleteOrg(list: Organization[], id: number): boolean {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id === id) {
			list.splice(i, 1);
			return true;
		}
		if (list[i].children && (list[i]?.children || []).length > 0) {
			if (deleteOrg(list[i]?.children || [], id)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 保存组织
 */
const handleOrgSave = (data: any) => {
	// 创建新数组
	const newOrgs = JSON.parse(JSON.stringify(props.organizations));

	if (editingOrgInfo.value) {
		updateOrg(newOrgs, editingOrgInfo.value.id, data);
		ElMessage.success('编辑成功');
	} else {
		const newId = Date.now();
		const newOrg: Organization = {
			...data,
			id: newId,
			memberCount: 0,
		};
		newOrgs.push(newOrg);
		ElMessage.success('新增成功');
	}

	emit('update:organizations', newOrgs);
};

/**
 * 更新组织
 */
function updateOrg(list: Organization[], id: number, data: any): boolean {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id === id) {
			list[i] = {
				...list[i],
				...data,
			};
			return true;
		}
		if (list[i].children && (list[i]?.children || []).length > 0) {
			if (updateOrg(list[i]?.children || [], id, data)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 表格搜索事件
 */
const handleSearch = (params: any) => {
	console.log('搜索参数:', params);
	ElMessage.info('搜索功能待实现');
};

/**
 * 表格重置事件
 */
const handleReset = () => {
	console.log('重置搜索');
	ElMessage.info('重置功能待实现');
};

/**
 * 表格操作事件
 */
const handleTableOperation = (operation: Operation, row: any) => {
	if (operation.key === 'edit') {
		handleEditOrg(row);
	} else if (operation.key === 'delete') {
		handleDelete(row);
	}
};
</script>

<style scoped lang="scss">
.unified-org-view {
	display: flex;
	flex-direction: column;
	gap: 16px;
	min-height: 0;
	height: 100%;
	:deep(.configurable-table-with-form) {
		.form-container,
		.table-actions-container {
			margin-bottom: 0 !important;
		}
	}
}

.mini-stats {
	display: flex;
	gap: 12px;

	.mini-stat-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 16px;
		background: #ffffff;
		border-radius: 8px;
		border: 1px solid #e5e7eb;

		.mini-stat-label {
			font-size: 12px;
			color: #6b7280;
		}

		.mini-stat-value {
			font-size: 18px;
			font-weight: 600;
			color: #1f2937;
		}

		&.highlight {
			border-color: #93c5fd;
			background: #eff6ff;

			.mini-stat-value {
				color: #1d4ed8;
			}
		}
	}
}

.unified-main-content {
	display: flex;
	gap: 16px;
	min-height: 0;
	flex: 1;
}

.right-panel {
	flex: 1;
	background: #ffffff;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.table-container {
		flex: 1;
		overflow: hidden;

		:deep(.table-container) {
			height: 100%;
		}
	}
}
</style>
