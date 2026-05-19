<template>
	<div class="pass-record">
		<ConfigurableTableWithForm
			ref="tableRef"
			:table-config="tableConfig"
			@search="handleSearch"
			@reset="handleReset"
			@operation="handleOperation"
			:showColumnSettings="false"
			:showSearchToggle="false"
			:showExport="false"
			:showRefresh="false"
		>
			<!-- 类型列插槽 -->
			<template #vehicleTypeSlot="{ row }">
				<el-tag :type="getVehicleTypeTag(row.vehicleType)" size="small">{{ row.vehicleType }}</el-tag>
			</template>

			<!-- 方向列插槽 -->
			<template #directionSlot="{ row }">
				<el-tag :type="row.direction === '进场' ? 'primary' : 'warning'" size="small">{{ row.direction }}</el-tag>
			</template>

			<!-- 状态列插槽 -->
			<template #statusSlot="{ row }">
				<el-tag :type="row.status === '在场' ? 'primary' : 'info'" size="small">{{ row.status }}</el-tag>
			</template>
		</ConfigurableTableWithForm>
	</div>
</template>

<script setup lang="ts" name="PassRecord">
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';

// 接收 props
const props = defineProps<{
	gateId?: string;
}>();

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [{ label: '车牌号', value: 'plateNumber', type: 'text', selected: true }],
	fieldOptions: {},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', width: 120, align: 'center' },
	{ prop: 'vehicleType', label: '类型', width: 100, align: 'center', slot: 'vehicleTypeSlot' },
	{ prop: 'owner', label: '归属', minWidth: 120, align: 'center' },
	{ prop: 'direction', label: '方向', width: 80, align: 'center', slot: 'directionSlot' },
	{ prop: 'entryTime', label: '入场', width: 160, align: 'center' },
	{ prop: 'exitTime', label: '出场', width: 160, align: 'center' },
	{ prop: 'fee', label: '费用', width: 80, align: 'center' },
	{ prop: 'status', label: '状态', width: 80, align: 'center', slot: 'statusSlot' },
];

// 表格数据
const tableData = ref([
	{
		id: 1,
		plateNumber: '京A12345',
		vehicleType: '月租',
		owner: '张三',
		direction: '进场',
		entryTime: '2025-04-28 08:30:00',
		exitTime: '-',
		fee: '0',
		status: '在场',
		gateId: '1',
	},
	{
		id: 2,
		plateNumber: '京B67890',
		vehicleType: '临时',
		owner: '李四',
		direction: '出场',
		entryTime: '2025-04-28 09:00:00',
		exitTime: '2025-04-28 14:30:00',
		fee: '15',
		status: '已离场',
		gateId: '2',
	},
	{
		id: 3,
		plateNumber: '京C11111',
		vehicleType: '访客',
		owner: '王五',
		direction: '进场',
		entryTime: '2025-04-28 10:15:00',
		exitTime: '-',
		fee: '0',
		status: '在场',
		gateId: '3',
	},
	{
		id: 4,
		plateNumber: '京D22222',
		vehicleType: '月租',
		owner: '赵六',
		direction: '出场',
		entryTime: '2025-04-27 18:00:00',
		exitTime: '2025-04-28 08:00:00',
		fee: '0',
		status: '已离场',
		gateId: '1',
	},
	{
		id: 5,
		plateNumber: '京E33333',
		vehicleType: '临时',
		owner: '钱七',
		direction: '进场',
		entryTime: '2025-04-28 11:20:00',
		exitTime: '-',
		fee: '0',
		status: '在场',
		gateId: '2',
	},
	{
		id: 6,
		plateNumber: '京F44444',
		vehicleType: '访客',
		owner: '孙八',
		direction: '出场',
		entryTime: '2025-04-28 07:30:00',
		exitTime: '2025-04-28 12:00:00',
		fee: '10',
		status: '已离场',
		gateId: '3',
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
	showOperations: false,
}));

// 表格引用
const tableRef = ref();

// 查询参数
const queryParams = reactive({
	plateNumber: '',
	vehicleType: '',
	status: '',
});

// 获取类型标签样式
const getVehicleTypeTag = (type: string) => {
	const typeMap: Record<string, string> = {
		月租: 'primary',
		临时: 'warning',
		访客: 'info',
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
	queryParams.vehicleType = '';
	queryParams.status = '';
	console.log('重置');
};

// 操作处理
const handleOperation = (data: any) => {
	console.log('操作', data);
};
</script>

<style scoped lang="scss">
.pass-record {
	height: 100%;
}
:deep(.mb20) {
	margin-bottom: 0 !important;
}
</style>
