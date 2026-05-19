<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<ConfigurableTableWithForm
				ref="tableRef"
				:query-form-config="queryFormConfig"
				:table-config="tableConfig"
				@search="handleSearch"
				@reset="handleReset"
				:showExport="false"
			>
				<!-- 类型列插槽 -->
				<template #typeSlot="{ row }">
					<el-tag :type="getTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
				</template>

				<!-- 入场抓拍列插槽 -->
				<template #entryCaptureSlot="{ row }">
					<el-image
						v-if="row.entryCapture"
						:src="row.entryCapture"
						:preview-src-list="[row.entryCapture]"
						fit="cover"
						class="capture-image"
						preview-teleported
					/>
					<span v-else class="no-capture">-</span>
				</template>

				<!-- 出场抓拍列插槽 -->
				<template #exitCaptureSlot="{ row }">
					<el-image
						v-if="row.exitCapture"
						:src="row.exitCapture"
						:preview-src-list="[row.exitCapture]"
						fit="cover"
						class="capture-image"
						preview-teleported
					/>
					<span v-else class="no-capture">-</span>
				</template>

				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="getStatusTag(row.status)" size="small">{{ row.status }}</el-tag>
				</template>
			</ConfigurableTableWithForm>
		</div>
	</div>
</template>

<script setup lang="ts" name="passRecordIndex">
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '车牌号', value: 'plateNumber', type: 'text', selected: true },
		{ label: '归属', value: 'belong', type: 'text', selected: true },
		{ label: '类型', value: 'type', type: 'select', selected: true },
	],
	fieldOptions: {
		type: [
			{ label: '月租', value: '月租' },
			{ label: '临时', value: '临时' },
			{ label: '访客', value: '访客' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', width: 120, align: 'center' },
	{ prop: 'type', label: '类型', width: 80, align: 'center', slot: 'typeSlot' },
	{ prop: 'belong', label: '归属', width: 100, align: 'center' },
	{ prop: 'entryGate', label: '进场岗亭', width: 120, align: 'center' },
	{ prop: 'entryTime', label: '入场时间', width: 160, align: 'center' },
	{ prop: 'entryCapture', label: '入场抓拍', minWidth: 100, align: 'center', slot: 'entryCaptureSlot' },
	{ prop: 'exitGate', label: '出场岗亭', width: 120, align: 'center' },
	{ prop: 'exitTime', label: '出场时间', minWidth: 160, align: 'center' },
	{ prop: 'exitCapture', label: '出场抓拍', width: 100, align: 'center', slot: 'exitCaptureSlot' },
	{ prop: 'fee', label: '费用', width: 80, align: 'center' },
	{ prop: 'status', label: '状态', width: 90, align: 'center', slot: 'statusSlot' },
];

// 表格数据
const tableData = ref([
	{
		id: 1,
		plateNumber: '京A12345',
		type: '月租',
		belong: '业主',
		entryGate: '东门岗亭',
		entryTime: '2025-04-30 08:15:32',
		entryCapture: 'https://picsum.photos/seed/entry1/100/60',
		exitGate: '东门岗亭',
		exitTime: '2025-04-30 18:45:21',
		exitCapture: 'https://picsum.photos/seed/exit1/100/60',
		fee: '¥0',
		status: '已出场',
	},
	{
		id: 2,
		plateNumber: '京B67890',
		type: '临时',
		belong: '访客',
		entryGate: '南门岗亭',
		entryTime: '2025-04-30 09:20:15',
		entryCapture: 'https://picsum.photos/seed/entry2/100/60',
		exitGate: '南门岗亭',
		exitTime: '2025-04-30 14:30:08',
		exitCapture: 'https://picsum.photos/seed/exit2/100/60',
		fee: '¥15',
		status: '已出场',
	},
	{
		id: 3,
		plateNumber: '京C11111',
		type: '月租',
		belong: '企业',
		entryGate: '西门岗亭',
		entryTime: '2025-04-30 07:45:00',
		entryCapture: 'https://picsum.photos/seed/entry3/100/60',
		exitGate: '-',
		exitTime: '-',
		exitCapture: '',
		fee: '-',
		status: '在场',
	},
	{
		id: 4,
		plateNumber: '京D22222',
		type: '访客',
		belong: '访客',
		entryGate: '北门岗亭',
		entryTime: '2025-04-30 10:05:42',
		entryCapture: 'https://picsum.photos/seed/entry4/100/60',
		exitGate: '北门岗亭',
		exitTime: '2025-04-30 11:30:55',
		exitCapture: 'https://picsum.photos/seed/exit4/100/60',
		fee: '¥5',
		status: '已出场',
	},
	{
		id: 5,
		plateNumber: '京E33333',
		type: '临时',
		belong: '业主',
		entryGate: '东门岗亭',
		entryTime: '2025-04-30 11:15:20',
		entryCapture: 'https://picsum.photos/seed/entry5/100/60',
		exitGate: '-',
		exitTime: '-',
		exitCapture: '',
		fee: '-',
		status: '在场',
	},
	{
		id: 6,
		plateNumber: '京F44444',
		type: '月租',
		belong: '企业',
		entryGate: '南门岗亭',
		entryTime: '2025-04-29 19:30:00',
		entryCapture: 'https://picsum.photos/seed/entry6/100/60',
		exitGate: '南门岗亭',
		exitTime: '2025-04-30 08:00:15',
		exitCapture: 'https://picsum.photos/seed/exit6/100/60',
		fee: '¥0',
		status: '已出场',
	},
	{
		id: 7,
		plateNumber: '京G55555',
		type: '访客',
		belong: '访客',
		entryGate: '西门岗亭',
		entryTime: '2025-04-30 14:20:30',
		entryCapture: 'https://picsum.photos/seed/entry7/100/60',
		exitGate: '西门岗亭',
		exitTime: '2025-04-30 16:45:10',
		exitCapture: 'https://picsum.photos/seed/exit7/100/60',
		fee: '¥10',
		status: '已出场',
	},
	{
		id: 8,
		plateNumber: '京H66666',
		type: '月租',
		belong: '业主',
		entryGate: '东门岗亭',
		entryTime: '2025-04-30 06:50:00',
		entryCapture: 'https://picsum.photos/seed/entry8/100/60',
		exitGate: '-',
		exitTime: '-',
		exitCapture: '',
		fee: '-',
		status: '在场',
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
}));

// 表格引用
const tableRef = ref();

// 查询参数
const queryParams = reactive({
	plateNumber: '',
	belong: '',
	type: '',
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

// 获取状态标签样式
const getStatusTag = (status: string) => {
	const statusMap: Record<string, string> = {
		已出场: 'success',
		在场: 'primary',
	};
	return statusMap[status] || 'info';
};

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	console.log('查询', queryParams);
};

// 重置
const handleReset = () => {
	queryParams.plateNumber = '';
	queryParams.belong = '';
	queryParams.type = '';
	console.log('重置');
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

.capture-image {
	width: 80px;
	height: 40px;
	border-radius: 4px;
	cursor: pointer;
	margin-top: 4px;
}

.no-capture {
	color: #c0c4cc;
}
</style>
