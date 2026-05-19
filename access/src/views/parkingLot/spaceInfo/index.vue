<template>
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
				<div class="table-actions-container">
					<el-button type="primary" size="large" @click="handleImport">感应器数据导入</el-button>
					<el-button type="primary" size="large" @click="handleBatchAdd">批量生成车位编号</el-button>
				</div>
			</template>

			<!-- 类型列插槽 -->
			<template #typeSlot="{ row }">
				<el-tag :type="getTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
			</template>

			<!-- 当前忙闲列插槽 -->
			<template #busyStatusSlot="{ row }">
				<div>
					<el-tag :type="row.busyStatus === '空闲' ? 'success' : 'danger'" size="small">{{ row.busyStatus }}</el-tag>
					<div v-if="row.busyStatus === '占用中'" class="plate-text">{{ row.bindPlate }}</div>
				</div>
			</template>

			<!-- 绑定状态列插槽 -->
			<template #bindStatusSlot="{ row }">
				<el-tag :type="row.bindStatus === '已绑定' ? 'primary' : 'info'" size="small">{{ row.bindStatus }}车辆</el-tag>
			</template>
		</ConfigurableTableWithForm>

		<!-- 感应器数据导入弹框 -->
		<ImportDialog ref="importDialogRef" @refresh="handleRefresh" />

		<!-- 批量生成车位编号弹框 -->
		<AddDialog ref="addDialogRef" @refresh="handleRefresh" />

		<!-- 配置弹框 -->
		<SetDialog ref="setDialogRef" @refresh="handleRefresh" />
	</div>
</template>

<script setup lang="ts" name="spaceInfoIndex">
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import ImportDialog from './importDialog.vue';
import AddDialog from './addDialog.vue';
import SetDialog from './setDialog.vue';

// 弹框引用
const importDialogRef = ref();
const addDialogRef = ref();
const setDialogRef = ref();

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '绑定状态', value: 'bindStatus', type: 'select', selected: true },
		{ label: '占用车牌号', value: 'occupyPlate', type: 'text', selected: true },
		{ label: '绑定车牌号', value: 'bindPlate', type: 'text', selected: true },
	],
	fieldOptions: {
		bindStatus: [
			{ label: '已绑定车辆', value: '已绑定' },
			{ label: '未绑定车辆', value: '未绑定' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'code', label: '车位编号', align: 'center' },
	{ prop: 'parkingLot', label: '所属停车场', align: 'center' },
	{ prop: 'type', label: '类型', align: 'center', slot: 'typeSlot' },
	{ prop: 'sensor', label: '感应器', align: 'center' },
	{ prop: 'busyStatus', label: '当前忙闲', align: 'center', slot: 'busyStatusSlot' },
	{ prop: 'bindStatus', label: '绑定状态', align: 'center', slot: 'bindStatusSlot' },
	{ prop: 'bindPlate', label: '绑定车牌', align: 'center' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 120,
		fixed: 'right',
		align: 'center',
		operations: [
			{ label: '配置', action: 'config', type: 'primary', link: true },
			{ label: '删除', action: 'delete', type: 'danger', link: true },
		],
	},
];

// 表格数据
const tableData = ref([
	{
		id: 1,
		code: 'A-001',
		parkingLot: '阳光花园地下停车场',
		type: '月租',
		sensor: '正常',
		busyStatus: '占用中',
		bindStatus: '已绑定',
		bindPlate: '京A12345',
	},
	{
		id: 2,
		code: 'A-002',
		parkingLot: '阳光花园地下停车场',
		type: '月租',
		sensor: '正常',
		busyStatus: '空闲',
		bindStatus: '已绑定',
		bindPlate: '京B67890',
	},
	{
		id: 3,
		code: 'VIP-001',
		parkingLot: '阳光花园地下停车场',
		type: '临时',
		sensor: '正常',
		busyStatus: '占用中',
		bindStatus: '未绑定',
		bindPlate: '-',
	},
	{
		id: 4,
		code: 'B-001',
		parkingLot: '翠苑小区地面停车场',
		type: '访客',
		sensor: '故障',
		busyStatus: '空闲',
		bindStatus: '未绑定',
		bindPlate: '-',
	},
	{
		id: 5,
		code: 'B-002',
		parkingLot: '翠苑小区地面停车场',
		type: '月租',
		sensor: '正常',
		busyStatus: '空闲',
		bindStatus: '已绑定',
		bindPlate: '京D22222',
	},
	{
		id: 6,
		code: 'C-001',
		parkingLot: '商业中心停车场',
		type: '临时',
		sensor: '正常',
		busyStatus: '占用中',
		bindStatus: '未绑定',
		bindPlate: '-',
	},
	{
		id: 7,
		code: 'C-002',
		parkingLot: '商业中心停车场',
		type: '访客',
		sensor: '正常',
		busyStatus: '空闲',
		bindStatus: '未绑定',
		bindPlate: '-',
	},
	{
		id: 8,
		code: 'D-001',
		parkingLot: '市民广场地下停车场',
		type: '月租',
		sensor: '正常',
		busyStatus: '占用中',
		bindStatus: '已绑定',
		bindPlate: '京F44444',
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
	bindStatus: '',
	occupyPlate: '',
	bindPlate: '',
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
	queryParams.bindStatus = '';
	queryParams.occupyPlate = '';
	queryParams.bindPlate = '';
};

// 感应器数据导入
const handleImport = () => {
	importDialogRef.value?.openDialog();
};

// 批量生成车位编号
const handleBatchAdd = () => {
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
		case 'config':
			handleConfig(row);
			break;
		case 'delete':
			handleDelete(row);
			break;
	}
};

// 配置
const handleConfig = (row: any) => {
	setDialogRef.value?.openDialog(row.id, row);
};

// 删除
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm('确认删除该车位吗？');
		useMessage().success('删除成功');
	} catch {}
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
.table-actions-container {
	display: flex;
	justify-content: space-between;
}
.plate-text {
	font-size: 10px;
	color: #909399;
}
</style>
