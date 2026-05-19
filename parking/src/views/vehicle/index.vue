<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<ConfigurableTableWithForm
				ref="tableRef"
				:query-form-config="queryFormConfig"
				:table-config="tableConfig"
				@search="handleSearch"
				@reset="handleReset"
				@operation="handleOperation"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:showExport="false"
			>
				<template #tableActions>
					<el-button type="primary" size="large" @click="handleAdd">登记车辆</el-button>
				</template>

				<!-- 类型列插槽 -->
				<template #typeSlot="{ row }">
					<el-tag :type="getTypeTag(row.type)" size="small">{{ getTypeText(row.type) }}</el-tag>
				</template>

				<!-- 归属列插槽 -->
				<template #belongTypeSlot="{ row }">
					{{ getBelongTypeText(row.belongType) }}
				</template>

				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
				</template>
			</ConfigurableTableWithForm>

			<!-- 登记车辆弹窗 -->
			<AddDialog ref="addDialogRef" @refresh="handleRefresh" />

			<!-- 通行记录弹窗 -->
			<RecordDialog ref="recordDialogRef" />

			<!-- 详情弹窗 -->
			<DetailDialog ref="detailDialogRef" />
		</div>
	</div>
</template>

<script setup lang="ts" name="vehicleIndex">
import { ref, reactive, computed, onMounted } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import AddDialog from './addDialog.vue';
import RecordDialog from './recordDialog.vue';
import DetailDialog from './detailDialog.vue';
import { getVehiclePage, deleteVehicle } from '/@/api/vehicle';
import type { Vehicle, VehiclePageParams } from '/@/api/vehicle/type';

// 弹窗引用
const addDialogRef = ref();
const recordDialogRef = ref();
const detailDialogRef = ref();

// 表格引用
const tableRef = ref();

// 加载状态
const loading = ref(false);

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '车牌号/车主/企业', value: 'queryName', type: 'text', selected: true },
		{ label: '类型', value: 'type', type: 'select', selected: true },
		{ label: '归属', value: 'belongType', type: 'select', selected: true },
	],
	fieldOptions: {
		type: [
			{ label: '月租', value: 'monthly' },
			{ label: '临时', value: 'temporary' },
		],
		belongType: [
			{ label: '企业', value: 'enterprise' },
			{ label: '业主', value: 'owner' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', width: 120, align: 'center' },
	{ prop: 'vehicleBrand', label: '车辆信息', width: 140, align: 'center' },
	{ prop: 'type', label: '类型', width: 80, align: 'center', slot: 'typeSlot' },
	{ prop: 'belongType', label: '归属', width: 80, align: 'center', slot: 'belongTypeSlot' },
	{ prop: 'contactPerson', label: '联系人', minWidth: 120, align: 'center' },
	{ prop: 'enterpriseName', label: '企业', minWidth: 120, align: 'center' },
	{ prop: 'parkingSpaceCode', label: '车位', width: 100, align: 'center' },
	{ prop: 'monthlyFee', label: '月租费', width: 100, align: 'center' },
	{ prop: 'expireDate', label: '到期日', width: 120, align: 'center' },
	{ prop: 'status', label: '状态', width: 90, align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 150,
		fixed: 'right',
		align: 'center',
		operations: [
			{ label: '详情', action: 'detail', type: 'primary', link: true },
			{ label: '记录', action: 'record', type: 'primary', link: true },
			{ label: '编辑', action: 'edit', type: 'primary', link: true },
		],
	},
];

// 表格数据
const tableData = ref<Vehicle[]>([]);

// 分页参数
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0,
});

// 查询参数
const queryParams = reactive<VehiclePageParams>({
	current: 1,
	size: 10,
	queryName: '',
	type: '',
	belongType: '',
});

// 表格配置
const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: tableData.value,
	selectionType: 'none',
	showIndex: true,
	loading: loading.value,
	pagination: true,
	pageSize: pagination.size,
	currentPage: pagination.current,
	total: pagination.total,
	showOperations: true,
}));

// 类型映射
const typeMap: Record<string, { text: string; tag: string }> = {
	monthly: { text: '月租', tag: 'primary' },
	temporary: { text: '临时', tag: 'info' },
};

// 归属映射
const belongTypeMap: Record<string, string> = {
	enterprise: '企业',
	owner: '业主',
};

// 状态映射
const statusMap: Record<string, { text: string; tag: string }> = {
	normal: { text: '正常', tag: 'success' },
	soon: { text: '即将到期', tag: 'warning' },
	expired: { text: '已过期', tag: 'danger' },
};

// 获取类型文字
const getTypeText = (type: string) => {
	return typeMap[type]?.text || type || '-';
};

// 获取类型标签样式
const getTypeTag = (type: string) => {
	return typeMap[type]?.tag || 'info';
};

// 获取状态文字
const getStatusText = (status: string) => {
	return statusMap[status]?.text || status || '-';
};

// 获取状态标签样式
const getStatusTag = (status: string) => {
	return statusMap[status]?.tag || 'info';
};

// 获取归属文字
const getBelongTypeText = (belongType: string) => {
	return belongTypeMap[belongType] || belongType || '-';
};

// 获取表格数据
const fetchTableData = async () => {
	loading.value = true;
	try {
		const res = await getVehiclePage(queryParams);
		if (res.code === 0 && res.data) {
			tableData.value = res.data.records || [];
			pagination.total = res.data.total || 0;
		}
	} catch (err) {
		console.error('获取车辆列表失败', err);
	} finally {
		loading.value = false;
	}
};

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	queryParams.current = 1;
	fetchTableData();
};

// 重置
const handleReset = () => {
	queryParams.queryName = '';
	queryParams.type = '';
	queryParams.belongType = '';
	queryParams.current = 1;
	fetchTableData();
};

// 新增
const handleAdd = () => {
	addDialogRef.value?.openDialog();
};

// 刷新列表
const handleRefresh = () => {
	fetchTableData();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
	pagination.size = size;
	pagination.current = 1;
	fetchTableData();
};

// 页码变化
const handleCurrentChange = (page: number) => {
	pagination.current = page;
	fetchTableData();
};

// 操作处理
const handleOperation = (data: any) => {
	const { action, row } = data;
	switch (action) {
		case 'detail':
			handleDetail(row);
			break;
		case 'record':
			handleRecord(row);
			break;
		case 'edit':
			handleEdit(row);
			break;
	}
};

// 详情
const handleDetail = (row: Vehicle) => {
	detailDialogRef.value?.openDialog(row.id, row);
};

// 记录
const handleRecord = (row: Vehicle) => {
	recordDialogRef.value?.openDialog(row.id, row);
};

// 编辑
const handleEdit = (row: Vehicle) => {
	addDialogRef.value?.openDialog(row.id, row);
};

// 页面加载时获取数据
onMounted(() => {
	fetchTableData();
});
</script>

<style scoped lang="scss">
.layout-padding {
	position: relative !important;
	height: 100% !important;
	overflow: hidden !important;
}

.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
	height: 100% !important;
	display: flex;
	flex-direction: column;
}
</style>
