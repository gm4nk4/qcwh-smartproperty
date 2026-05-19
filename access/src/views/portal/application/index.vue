<template>
	<div class="sub-app-manage">
		<StatCards :stats="statCardsConfig" />

		<div
			class="filter-section"
			v-if="viewMode === 'card'"
		>
			<div class="filter-right">
				<el-button
					type="primary"
					@click="handleAddApp"
				>
					<template #icon>
						<Plus />
					</template>
					新增应用
				</el-button>
				<div class="s-toggle">
					<el-button
						type="primary"
						@click="viewMode = 'list'"
					>
						列表视图
					</el-button>
				</div>
			</div>
		</div>

		<div class="content-section">
			<ConfigurableTableWithForm
				v-if="viewMode === 'list'"
				ref="tableRef"
				:query-form-config="queryFormConfig"
				@operation="handleTableOperation"
				:table-config="tableConfig"
				@search="handleSearch"
				@reset="handleReset"
				:show-export="true"
				:show-column-settings="true"
				:show-search-toggle="true"
				:show-refresh="true"
			>
				<template #tableActions>
					<div class="table-actions-container">
						<el-button
							type="primary"
							size="large"
							@click="handleAddApp"
						>
							<template #icon>
								<Plus />
							</template>
							新增应用
						</el-button>
						<el-button
							type="primary"
							@click="viewMode = 'card'"
						>
							卡片视图
						</el-button>
					</div>
				</template>
				<template #categorySlot="{ row }">
					<el-tag
						:type="getCategoryTagType(row.category)"
						size="small"
					>
						{{ row.category }}
					</el-tag>
				</template>
				<template #modulesSlot="{ row }">
					<div class="module-tags">
						<el-tag
							v-for="(module, index) in row.modules"
							:key="index"
							size="small"
							class="module-tag"
						>
							{{ module }}
						</el-tag>
					</div>
				</template>
				<template #statusSlot="{ row }">
					<el-tag
						:type="getStatusTagType(row.status)"
						size="small"
					>
						{{ getStatusText(row.status) }}
					</el-tag>
				</template>
			</ConfigurableTableWithForm>
			<AppCardView
				v-else
				:data="tableData"
				@action="handleCardAction"
			/>
		</div>

		<AppDetailDialog
			v-model:visible="detailDialogVisible"
			:app-data="currentApp"
		/>
		<AddAppDialog
			v-model:visible="addDialogVisible"
			@save="handleAddSave"
		/>
		<AppConfigDialog
			v-model:visible="configDialogVisible"
			:app-data="currentConfigApp"
			@save="handleConfigSave"
		/>
	</div>
</template>

<script setup lang="ts" name="ApplicationManage">
/**
 * 子应用管理主页面
 * @description 支持列表和卡片两种视图，使用 ConfigurableTableWithForm 组件
 */

import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig, type Operation } from '@zhqc-smart/table';
import type { StatsData, ApplicationItem, AddAppFormData, QueryParams } from './type';
import { mockStatsData, mockApplicationList, getStatCardsConfig, statusOptions, categoryOptions } from './mock';
import StatCards from './components/StatCards.vue';
import AppCardView from './components/AppCardView.vue';
import AppDetailDialog from './components/AppDetailDialog.vue';
import AddAppDialog from './components/AddAppDialog.vue';
import AppConfigDialog from './components/AppConfigDialog.vue';

/** 视图模式：card-卡片，list-列表 */
const viewMode = ref<'card' | 'list'>('list');

/** 查询参数 */
const queryParams = reactive<QueryParams>({
	appName: '',
	appStatus: '',
	appCategory: '',
});

/** 表格数据 */
const tableData = ref<ApplicationItem[]>(mockApplicationList);
/** 统计数据 */
const stats = reactive<StatsData>(mockStatsData);
/** 统计卡片配置 */
const statCardsConfig = computed(() => getStatCardsConfig(stats));

/** 当前查看的应用 */
const currentApp = ref<ApplicationItem | null>(null);
/** 详情弹窗可见性 */
const detailDialogVisible = ref(false);
/** 新增弹窗可见性 */
const addDialogVisible = ref(false);
/** 配置弹窗可见性 */
const configDialogVisible = ref(false);
/** 当前配置的应用 */
const currentConfigApp = ref<ApplicationItem | null>(null);

/** 查询表单配置 */
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '应用名称', value: 'appName', type: 'text', selected: true },
		{ label: '应用状态', value: 'appStatus', type: 'select', selected: true },
		{ label: '应用分类', value: 'appCategory', type: 'select', selected: true },
	],
	fieldOptions: {
		appStatus: statusOptions,
		appCategory: categoryOptions,
	},
	maxConditions: 3,
	initialConditions: 3,
}));

/** 表格列配置 */
const tableColumns: TableColumn[] = [
	{ prop: 'name', label: '应用名称', minWidth: 160, align: 'center' },
	{ prop: 'description', label: '应用描述', minWidth: 240, align: 'center' },
	{ prop: 'category', label: '应用分类', width: 120, align: 'center', slot: 'categorySlot' },
	{ prop: 'code', label: '应用编码', width: 140, align: 'center' },
	{ prop: 'version', label: '版本', width: 100, align: 'center' },
	{ prop: 'userCount', label: '授权用户', width: 100, align: 'center' },
	{ prop: 'validPeriod', label: '授权有效期', width: 180, align: 'center' },
	{ prop: 'modules', label: '功能模块', minWidth: 200, align: 'center', slot: 'modulesSlot' },
	{ prop: 'status', label: '应用状态', width: 100, align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 200,
		fixed: 'right',
		align: 'center',
		buttonSize: 'small',
		operations: (): Operation[] => [
			{ label: '查看', action: 'detail', type: 'primary', link: true },
			{ label: '配置', action: 'config', type: 'primary', link: true },
			{ label: '启用/停用', action: 'toggle', type: 'primary', link: true },
		],
	},
];

/** 表格配置 */
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

/**
 * 获取分类标签类型
 */
const getCategoryTagType = (category: string) => {
	const typeMap: Record<string, any> = {
		客户服务: 'info',
		空间与设备: 'success',
		第三方应用: 'warning',
	};
	return typeMap[category] || 'info';
};

/**
 * 获取状态标签类型
 */
const getStatusTagType = (status: string) => {
	const typeMap: Record<string, any> = {
		active: 'success',
		inactive: 'danger',
		testing: 'warning',
	};
	return typeMap[status] || 'info';
};

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
	const statusMap: Record<string, string> = {
		active: '已激活',
		inactive: '已停用',
		testing: '测试中',
	};
	return statusMap[status] || status;
};

/**
 * 搜索
 */
const handleSearch = (formData?: Record<string, any>) => {
	if (formData) {
		Object.assign(queryParams, formData);
	}
	console.log('查询参数:', queryParams);
};

/**
 * 重置
 */
const handleReset = () => {
	queryParams.appName = '';
	queryParams.appStatus = '';
	queryParams.appCategory = '';
};

/**
 * 新增应用
 */
const handleAddApp = () => {
	addDialogVisible.value = true;
};

/**
 * 新增保存
 */
const handleAddSave = (data: AddAppFormData) => {
	console.log('新增应用:', data);
};

/**
 * 查看详情
 */
const handleViewDetail = (row: ApplicationItem) => {
	currentApp.value = row;
	detailDialogVisible.value = true;
};

/**
 * 配置
 */
const handleConfig = (row: ApplicationItem) => {
	currentConfigApp.value = row;
	configDialogVisible.value = true;
};

/**
 * 配置保存
 */
const handleConfigSave = (data: any) => {
	console.log('配置保存:', data);
	ElMessage.success('配置保存成功');
};

/**
 * 切换状态
 */
const handleToggleStatus = async (row: ApplicationItem) => {
	const action = row.status === 'active' ? '停用' : '启用';
	const actionType = row.status === 'active' ? 'danger' : 'primary';

	try {
		await ElMessageBox.confirm(
			`确定要${action}应用「${row.name}」吗？${row.status === 'active' ? '停用后用户将无法访问该应用。' : ''}`,
			`${action}确认`,
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: actionType as any,
			}
		);

		row.status = row.status === 'active' ? 'inactive' : 'active';
		ElMessage.success(`${row.status === 'active' ? '启用' : '停用'}成功`);
	} catch {
		// 用户取消操作
	}
};

/**
 * 表格操作处理
 */
const handleTableOperation = (data: any) => {
	console.log('点击了操作按钮:', data.action, data.row);
	switch (data.action) {
		case 'detail':
			handleViewDetail(data.row);
			break;
		case 'config':
			handleConfig(data.row);
			break;
		case 'toggle':
			handleToggleStatus(data.row);
			break;
		default:
			break;
	}
};

/**
 * 卡片操作处理
 */
const handleCardAction = (action: string, row: ApplicationItem) => {
	console.log('卡片操作:', action, row);
	switch (action) {
		case 'detail':
			handleViewDetail(row);
			break;
		case 'config':
			handleConfig(row);
			break;
		default:
			break;
	}
};
</script>

<style scoped lang="scss">
.sub-app-manage {
	padding: 20px;
	min-height: 100%;
	display: flex;
	flex-direction: column;
}

.filter-section {
	padding: 20px;
	border-radius: 8px;
	margin: 20px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-left {
	display: flex;
	gap: 12px;
	align-items: center;
}

.search-input {
	width: 240px;
}

.filter-select {
	width: 150px;
}

.more-filter-btn {
	display: flex;
	align-items: center;
	gap: 4px;
}

.filter-right {
	display: flex;
	gap: 16px;
	align-items: center;
}

.content-section {
	flex: 1;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 20px;
}

.table-actions-container {
	display: flex;
	gap: 12px;
}

.module-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	justify-content: center;

	.module-tag {
		max-width: 80px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

</style>
