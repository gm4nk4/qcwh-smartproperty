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
				:showExport="false"
			>
				<template #tableActions>
					<el-button type="primary" size="large" @click="handleAdd">登记车辆</el-button>
				</template>

				<!-- 类型列插槽 -->
				<template #typeSlot="{ row }">
					<el-tag :type="getTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
				</template>

				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="row.status === '正常' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
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
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import AddDialog from './addDialog.vue';
import RecordDialog from './recordDialog.vue';
import DetailDialog from './detailDialog.vue';

// 弹窗引用
const addDialogRef = ref();
const recordDialogRef = ref();
const detailDialogRef = ref();

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '车牌号', value: 'plateNumber', type: 'text', selected: true },
		{ label: '车主/企业', value: 'owner', type: 'text', selected: true },
		{ label: '类型', value: 'type', type: 'select', selected: true },
		{ label: '归属', value: 'belong', type: 'select', selected: true },
	],
	fieldOptions: {
		type: [
			{ label: '月租', value: '月租' },
			{ label: '临时', value: '临时' },
		],
		belong: [
			{ label: '企业', value: '企业' },
			{ label: '业主', value: '业主' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', width: 120, align: 'center' },
	{ prop: 'vehicleInfo', label: '车辆信息', width: 140, align: 'center' },
	{ prop: 'type', label: '类型', width: 80, align: 'center', slot: 'typeSlot' },
	{ prop: 'belong', label: '归属', width: 80, align: 'center' },
	{ prop: 'owner', label: '车主/企业', minWidth: 120, align: 'center' },
	{ prop: 'parkingSpace', label: '车位', width: 100, align: 'center' },
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
const tableData = ref([
	{
		id: 1,
		plateNumber: '京A12345',
		vehicleInfo: '大众 帕萨特',
		type: '月租',
		belong: '业主',
		owner: '张三',
		parkingSpace: 'A-001',
		monthlyFee: '300',
		expireDate: '2025-12-31',
		status: '正常',
	},
	{
		id: 2,
		plateNumber: '京B67890',
		vehicleInfo: '奔驰 E300L',
		type: '月租',
		belong: '企业',
		owner: '阳光科技有限公司',
		parkingSpace: 'B-002',
		monthlyFee: '500',
		expireDate: '2025-05-15',
		status: '即将到期',
	},
	{
		id: 3,
		plateNumber: '京C11111',
		vehicleInfo: '丰田 凯美瑞',
		type: '临时',
		belong: '业主',
		owner: '李四',
		parkingSpace: '-',
		monthlyFee: '-',
		expireDate: '-',
		status: '正常',
	},
	{
		id: 4,
		plateNumber: '京D22222',
		vehicleInfo: '本田 雅阁',
		type: '月租',
		belong: '业主',
		owner: '王五',
		parkingSpace: 'C-003',
		monthlyFee: '300',
		expireDate: '2025-08-20',
		status: '正常',
	},
	{
		id: 5,
		plateNumber: '京E33333',
		vehicleInfo: '宝马 5系',
		type: '访客',
		belong: '业主',
		owner: '赵六',
		parkingSpace: '-',
		monthlyFee: '-',
		expireDate: '-',
		status: '正常',
	},
	{
		id: 6,
		plateNumber: '京F44444',
		vehicleInfo: '奥迪 A6L',
		type: '月租',
		belong: '企业',
		owner: '星辰集团',
		parkingSpace: 'VIP-001',
		monthlyFee: '800',
		expireDate: '2025-05-05',
		status: '即将到期',
	},
	{
		id: 7,
		plateNumber: '京G55555',
		vehicleInfo: '特斯拉 Model 3',
		type: '月租',
		belong: '业主',
		owner: '钱七',
		parkingSpace: 'D-001',
		monthlyFee: '350',
		expireDate: '2025-11-30',
		status: '正常',
	},
	{
		id: 8,
		plateNumber: '京H66666',
		vehicleInfo: '蔚来 ES6',
		type: '月租',
		belong: '企业',
		owner: '创新科技',
		parkingSpace: 'E-002',
		monthlyFee: '400',
		expireDate: '2025-06-15',
		status: '正常',
	},
]);

// 表格配置
const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: tableData.value,
	selectionType: 'none',
	showIndex: true,
	loading: false,
	pagination: true,
	pageSize: 10,
	currentPage: 1,
	total: tableData.value.length,
	showOperations: true,
}));

// 表格引用
const tableRef = ref();

// 查询参数
const queryParams = reactive({
	plateNumber: '',
	owner: '',
	type: '',
	belong: '',
});

// 获取类型标签样式
const getTypeTag = (type: string) => {
	const typeMap: Record<string, string> = {
		月租: 'primary',
		临时: 'info',
		访客: 'warning',
	};
	return typeMap[type] || 'info';
};

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	console.log('查询', queryParams);
};

// 重置
const handleReset = () => {
	queryParams.plateNumber = '';
	queryParams.owner = '';
	queryParams.type = '';
	queryParams.belong = '';
	console.log('重置');
};

// 新增
const handleAdd = () => {
	addDialogRef.value?.openDialog();
};

// 刷新列表
const handleRefresh = () => {
	console.log('刷新列表');
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
const handleDetail = (row: any) => {
	detailDialogRef.value?.openDialog(row.id, row);
};

// 记录
const handleRecord = (row: any) => {
	recordDialogRef.value?.openDialog(row.id, row);
};

// 编辑
const handleEdit = (row: any) => {
	addDialogRef.value?.openDialog(row.id, row);
};
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
