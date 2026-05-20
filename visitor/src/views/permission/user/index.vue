<template>
	<div class="user-page">
		<!-- 顶部统计卡片 -->
		<div class="stat-cards">
			<div class="stat-card" v-for="(stat, index) in stats" :key="index">
				<div class="stat-icon" :style="{ backgroundColor: stat.color + '15' }">
					<svg class="icon" viewBox="0 0 48 48" fill="none">
						<path
							d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 14C26.76 14 29 16.24 29 19C29 21.76 26.76 24 24 24C21.24 24 19 21.76 19 19C19 16.24 21.24 14 24 14ZM24 38C20.14 38 16.56 36.28 14.08 33.4C14.12 28.6 22 25.86 24 25.86C25.98 25.86 33.88 28.58 33.92 33.38C31.44 36.28 27.86 38 24 38Z"
							:fill="stat.color"
						/>
					</svg>
				</div>
				<div class="stat-content">
					<div class="stat-title">{{ stat.title }}</div>
					<div class="stat-value">{{ stat.value }}</div>
				</div>
			</div>
		</div>

		<!-- 权限体系说明 -->
		<div class="permission-tip">
			<div class="tip-icon">
				<svg viewBox="0 0 24 24" fill="none">
					<path
						d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C21.98 6.48 17.5 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
						fill="#3b82f6"
					/>
				</svg>
			</div>
			<div class="tip-text">
				双层授权体系：平台角色+直接子应用角色-用户通过平台角色继承子应用权限，也可直接分配子应用角色进行补充。最终权限=平台角色映射直接分配的并集。
			</div>
		</div>

		<!-- 主内容区域 -->
		<div class="main-content">
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
						<el-button type="primary" size="large" @click="handleAddUser">
							<template #icon>
								<svg viewBox="0 0 24 24" fill="none">
									<path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
								</svg>
							</template>
							添加用户
						</el-button>
						<el-button type="danger" size="large" plain>
							<template #icon>
								<svg viewBox="0 0 24 24" fill="none">
									<path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H14.5L13.5 3H10.5L9.5 4H5V6H19V4Z" fill="currentColor" />
								</svg>
							</template>
							删除
						</el-button>
					</div>
				</template>
				<!-- 岗位标签列插槽 -->
				<template #postTagsSlot="{ row }">
					<div class="post-tags">
						<el-tag v-for="(tag, idx) in row.postTags" :key="idx" size="small" type="info" class="post-tag">{{ tag }}</el-tag>
					</div>
				</template>
				<!-- 子应用赋权列插槽 -->
				<template #appAuthSlot="{ row }">
					<div class="app-auth">{{ row.appAuth }}</div>
				</template>
				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
				</template>
			</ConfigurableTableWithForm>
			<userDetail v-model:visible="dialogVisible" />
			<userAuthDialog :user-info="userInfo" v-model:visible="authDialogVisible" />
			<userEditDialog :user-info="currentUserInfo" v-model:visible="editDialogVisible" @save="handleSaveEdit" />
			<userResetPwdDialog :user-info="currentUserInfo" v-model:visible="resetPwdDialogVisible" @save="handleResetPwd" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig, type Operation } from '@zhqc-smart/table';
import type { User, QueryParams } from './type';
import { mockUsers, mockStats, roleOptions, statusOptions } from './mock';
import { useMessageBox } from '/@/hooks/message';
import userDetail from './userDetail.vue';
import userAuthDialog from './userAuthDialog.vue';
import userEditDialog from './userEditDialog.vue';
import userResetPwdDialog from './userResetPwdDialog.vue';
import { useThemeOrUserInfo } from '/@/hooks/useThemeOrUserInfo';

const tableRef = ref();
const dialogVisible = ref(false);
const authDialogVisible = ref(false);
const editDialogVisible = ref(false);
const resetPwdDialogVisible = ref(false);
const { userInfos } = useThemeOrUserInfo();

const tableData = ref<User[]>(mockUsers);
const stats = ref(mockStats);
const currentUserInfo = ref<any>(null);
const userInfo = computed(() => {
	return userInfos.value?.user?.sysUser ?? {};
});

const queryParams = reactive<QueryParams>({
	userName: '',
	platformRole: '',
	status: '',
});

const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '用户名称', value: 'userName', type: 'text', selected: true },
		{ label: '平台角色', value: 'platformRole', type: 'select', selected: true },
		{ label: '状态', value: 'status', type: 'select', selected: true },
	],
	fieldOptions: {
		platformRole: roleOptions,
		status: statusOptions,
	},
	maxConditions: 3,
	initialConditions: 3,
}));

const tableColumns: TableColumn[] = [
	{ prop: 'userName', label: '用户名称', width: 140, align: 'center' },
	{ prop: 'userId', label: '用户ID', width: 120, align: 'center' },
	{ prop: 'deptName', label: '归属组织', width: 140, align: 'center' },
	{ prop: 'platformRole', label: '平台角色', width: 140, align: 'center' },
	{ prop: 'postTags', label: '岗位标签', align: 'center', slot: 'postTagsSlot' },
	{ prop: 'appAuth', label: '子应用赋权', align: 'center', slot: 'appAuthSlot' },
	{ prop: 'status', label: '状态', width: 100, align: 'center', slot: 'statusSlot' },
	{ prop: 'lastLoginTime', label: '最后登录', width: 200, align: 'center' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 380,
		fixed: 'right',
		align: 'center',
		buttonSize: 'small',
		operations: (_row: any): Operation[] => {
			const ops: Operation[] = [
				{ label: '编辑', action: 'edit', type: 'primary', link: true },
				{ label: '详情', action: 'detail', type: 'info', link: true },
				{ label: '用户授权', action: 'auth', type: 'primary', link: true },
				{ label: '禁用', action: 'disable', type: 'warning', link: true },
				{ label: '重置密码', action: 'resetPwd', type: 'info', link: true },
				{ label: '删除', action: 'delete', type: 'danger', link: true },
			];
			return ops;
		},
	},
];

const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: tableData.value,
	selectionType: 'checkbox',
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
		showSearch: true,
		export: true,
	},
}));

const getStatusTagType = (status: string) => {
	const typeMap: Record<string, any> = {
		在线: 'success',
		离线: 'info',
		禁用: 'danger',
	};
	return typeMap[status] || 'info';
};

const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	console.log('查询', queryParams);
};

const handleReset = () => {
	queryParams.userName = '';
	queryParams.platformRole = '';
	queryParams.status = '';
	console.log('重置');
};

const handleAddUser = () => {
	currentUserInfo.value = null;
	editDialogVisible.value = true;
};

const handleSaveEdit = (data: any) => {
	console.log('保存用户数据:', data);
	if (currentUserInfo.value) {
		// 编辑模式，更新现有用户
		const index = tableData.value.findIndex((u) => u.id === currentUserInfo.value.id);
		if (index !== -1) {
			tableData.value[index] = { ...tableData.value[index], ...data };
		}
	} else {
		// 添加模式，新增用户
		const newUser: User = {
			id: Date.now(),
			userName: data.userName,
			userId: `U${Date.now().toString().slice(-6)}`,
			deptName: data.deptName,
			platformRole: '普通用户',
			postTags: data.postTags,
			appAuth: '无',
			status: '离线',
			lastLoginTime: '-',
		};
		tableData.value.unshift(newUser);
	}
};

const handleResetPwd = (data: any) => {
	console.log('重置密码:', data);
	console.log('用户信息:', currentUserInfo.value);
	// 这里可以添加实际的API调用逻辑
};

const handleTableOperation = (data: any) => {
	console.log('点击了操作按钮:', data.action, data.row);
	switch (data.action) {
		case 'detail':
			dialogVisible.value = true;
			break;
		case 'auth':
			authDialogVisible.value = true;
			break;
		case 'edit':
			currentUserInfo.value = data.row;
			editDialogVisible.value = true;
			break;
		case 'disable':
			useMessageBox()
				.confirm('确定禁用用户吗？')
				.then(() => {
					// 确认禁用
					console.log('禁用用户', data.row);
				})
				.catch(() => {
					// 取消禁用
					console.log('取消禁用');
				});
			break;
		case 'resetPwd':
			currentUserInfo.value = data.row;
			resetPwdDialogVisible.value = true;
			break;
		case 'delete':
			useMessageBox()
				.confirm('确定删除用户吗？')
				.then(() => {
					// 确认删除
					console.log('删除用户', data.row);
				})
				.catch(() => {
					// 取消删除
					console.log('取消删除');
				});
			break;
		default:
			break;
	}
};
</script>

<style scoped lang="scss">
.user-page {
	padding: 20px;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
	overflow: hidden;
}

/* 统计卡片 */
.stat-cards {
	display: flex;
	gap: 16px;
}

.stat-card {
	flex: 1;
	background: #ffffff;
	border-radius: 12px;
	padding: 20px;
	display: flex;
	align-items: center;
	gap: 16px;
	border: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-icon {
	width: 64px;
	height: 64px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;

	.icon {
		width: 40px;
		height: 40px;
	}
}

.stat-content {
	flex: 1;

	.stat-title {
		font-size: 14px;
		color: #6b7280;
		margin-bottom: 4px;
		font-weight: 500;
	}

	.stat-value {
		font-size: 28px;
		font-weight: 700;
		color: #111827;
		line-height: 1.2;
	}
}

/* 权限说明提示 */
.permission-tip {
	background: #f0f9ff;
	border: 1px solid #bae6fd;
	border-radius: 8px;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	gap: 12px;
}

.tip-icon {
	flex-shrink: 0;
	margin-top: 2px;

	svg {
		width: 20px;
		height: 20px;
	}
}

.tip-text {
	flex: 1;
	font-size: 13px;
	color: #0369a1;
	line-height: 1.6;
}

.tip-actions {
	flex-shrink: 0;
}

/* 主内容区域 */
.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: #ffffff;
	border-radius: 12px;

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

/* 岗位标签 */
.post-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	justify-content: center;

	.post-tag {
		margin: 0;
	}
}

/* 子应用赋权 */
.app-auth {
	white-space: pre-line;
	text-align: center;
	font-size: 12px;
	color: #374151;
	line-height: 1.5;
}
</style>
