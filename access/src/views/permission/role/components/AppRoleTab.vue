<template>
	<div class="main-content">
		<!-- 左侧树形区域 -->
		<AppTree
			:tree-data="appTreeData"
			@node-click="handleNodeClick"
		/>

		<!-- 右侧表格区域 -->
		<div class="right-panel">
			<div class="panel-card">
				<ConfigurableTableWithForm
					ref="tableRef"
					:query-form-config="queryFormConfig"
					@operation="handleTableOperation"
					:table-config="tableConfig"
					@search="handleSearch"
					@reset="handleReset"
					:showExport="true"
					:showColumnSettings="true"
					:showSearchToggle="true"
					:showRefresh="true"
				>
					<template #tableActions>
						<div class="table-actions-container">
							<el-button
								type="primary"
								size="large"
							>
								<template #icon>
									<svg
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
											fill="currentColor"
										/>
									</svg>
								</template>
								新增角色
							</el-button>
							<el-button
								type="danger"
								size="large"
								plain
							>
								<template #icon>
									<svg
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H14.5L13.5 3H10.5L9.5 4H5V6H19V4Z"
											fill="currentColor"
										/>
									</svg>
								</template>
								删除
							</el-button>
						</div>
					</template>
					<!-- 授权平台角色列插槽 -->
					<template #authPlatformRolesSlot="{ row }">
						<div class="platform-roles">
							<el-tag
								v-for="(role, index) in row.authPlatformRoles"
								:key="index"
								size="small"
								type="info"
								class="role-tag"
							>
								{{ role }}
							</el-tag>
							<span
								v-if="row.authPlatformRoles.length === 0"
								class="no-data"
							>--</span>
						</div>
					</template>
					<!-- 授权用户列插槽 -->
					<template #authUserCountSlot="{ row }">
						<span class="auth-count">{{ row.authUserCount }}</span>
					</template>
					<!-- 状态列插槽 -->
					<template #statusSlot="{ row }">
						<el-tag
							:type="getStatusTagType(row.status)"
							size="small"
						>
							{{ row.status }}
						</el-tag>
					</template>
				</ConfigurableTableWithForm>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="AppRoleTab">
/**
 * 子应用角色标签页组件
 * @description 实现子应用角色管理功能
 */

import { ref, reactive, computed } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig, type Operation } from '@zhqc-smart/table';
import type { Role, QueryParams, AppTreeNode } from '../type';
import { mockRoles, mockAppTree } from '../mock';
import AppTree from './AppTree.vue';

// 组件引用
const tableRef = ref();

// 查询参数
const queryParams = reactive<QueryParams>({
	roleName: '',
	roleCode: '',
});

// 表格数据
const tableData = ref<Role[]>(mockRoles);

// 树形数据
const appTreeData = ref<AppTreeNode[]>(mockAppTree);

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '角色名称', value: 'roleName', type: 'text', selected: true },
		{ label: '角色编码', value: 'roleCode', type: 'text', selected: true },
	],
	maxConditions: 2,
	initialConditions: 2,
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'roleName', label: '角色名称', width: 140, align: 'center' },
	{ prop: 'roleCode', label: '角色编码', width: 160, align: 'center' },
	{ prop: 'appName', label: '所属子应用', width: 120, align: 'center' },
	{ prop: 'description', label: '说明', minWidth: 200, align: 'center' },
	{ prop: 'authUserCount', label: '授权用户', width: 100, align: 'center', slot: 'authUserCountSlot' },
	{ prop: 'authPlatformRoles', label: '授权平台角色', width: 140, align: 'center', slot: 'authPlatformRolesSlot' },
	{ prop: 'status', label: '状态', width: 90, align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 320,
		fixed: 'right',
		align: 'center',
		buttonSize: 'small',
		operations: (row: any): Operation[] => {
			const ops: Operation[] = [
				{ label: '修改', action: 'edit', type: 'primary', link: true },
				{ label: row.status === '启用' ? '禁用' : '启用', action: 'toggleStatus', type: 'warning', link: true },
				{ label: '角色分配', action: 'assignRole', type: 'primary', link: true },
				{ label: '权限分配', action: 'assignPermission', type: 'primary', link: true },
				{ label: '删除', action: 'delete', type: 'danger', link: true },
			];
			return ops;
		},
	},
];

// 表格配置
const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: tableData.value,
	selectionType: 'checkbox',
	showIndex: true,
	loading: false,
	pagination: true,
	pageSize: 10,
	currentPage: 1,
	total: mockRoles.length,
	showAddButton: false,
	showExportButton: false,
	showResetButton: false,
	autoLoad: false,
	rightToolbar: {
		showSearch: true,
		export: true,
	},
}));

/**
 * 获取状态标签类型
 * @param status 状态值
 * @returns Element Plus tag 类型
 */
const getStatusTagType = (status: string) => {
	return status === '启用' ? 'success' : 'danger';
};

/**
 * 处理树形节点点击
 * @param data 节点数据
 */
const handleNodeClick = (data: AppTreeNode) => {
	console.log('点击了应用节点:', data);
	useMessage().info(`选择了应用: ${data.name}`);
};

/**
 * 处理查询
 * @param formData 表单数据
 */
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	console.log('查询参数:', queryParams);
};

/**
 * 处理重置
 */
const handleReset = () => {
	queryParams.roleName = '';
	queryParams.roleCode = '';
	console.log('重置查询条件');
};

/**
 * 处理表格操作
 * @param data 操作数据
 */
const handleTableOperation = (data: any) => {
	console.log('点击了操作按钮:', data.action, data.row);
	switch (data.action) {
		case 'edit':
			break;
		case 'toggleStatus':
			break;
		case 'assignRole':
			break;
		case 'assignPermission':
			break;
		case 'delete':
			break;
		default:
			break;
	}
};
</script>

<style scoped lang="scss">
.main-content {
	flex: 1;
	display: flex;
	gap: 16px;
	overflow: hidden;
}

.right-panel {
	flex: 1;
	overflow: hidden;

	.panel-card {
		border: none;
	}
}

.panel-card {
	background: #ffffff;
	border-radius: 12px;
	border: 1px solid #e5e7eb;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	:deep(.layout-padding) {
		padding: 0 !important;
		height: 100% !important;
	}

	:deep(.layout-padding-auto.layout-padding-view) {
		padding: 0 !important;
		height: 100% !important;
	}
}

.table-actions-container {
	display: flex;
	gap: 12px;
}

.auth-count {
	color: #1890ff;
	font-weight: 500;
}

.platform-roles {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	justify-content: center;

	.role-tag {
		margin: 0;
	}

	.no-data {
		color: #9ca3af;
	}
}
</style>
