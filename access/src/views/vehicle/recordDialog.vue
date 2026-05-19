<template>
	<el-dialog :close-on-click-modal="false" title="通行记录" width="1002px" draggable v-model="visible" class="record-dialog">
		<div style="height: 400px; overflow-y: auto">
			<ConfigurableTableWithForm
				ref="tableRef"
				:table-config="tableConfig"
				@search="handleSearch"
				@reset="handleReset"
				:showColumnSettings="false"
				:showSearchToggle="false"
				:showExport="false"
				:showRefresh="false"
			>
				<!-- 类型列插槽 -->
				<template #typeSlot="{ row }">
					<el-tag :type="getTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
				</template>

				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="row.status === '在场' ? 'success' : 'primary'" size="small">{{ row.status }}</el-tag>
				</template>
			</ConfigurableTableWithForm>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="RecordDialog">
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';

// 定义变量内容
const visible = ref(false);
const tableRef = ref();

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [],
	fieldOptions: {},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'type', label: '类型', width: 80, align: 'center', slot: 'typeSlot' },
	{ prop: 'entryGate', label: '进场岗亭', width: 120, align: 'center' },
	{ prop: 'entryTime', label: '入场时间', width: 160, align: 'center' },
	{ prop: 'exitGate', label: '出场岗亭', width: 120, align: 'center' },
	{ prop: 'exitTime', label: '出场时间', width: 160, align: 'center' },
	{ prop: 'parkingSpace', label: '区域/车位', width: 100, align: 'center' },
	{ prop: 'fee', label: '费用', width: 80, align: 'center' },
	{ prop: 'status', label: '状态', width: 80, align: 'center', slot: 'statusSlot' },
];

// 表格数据
const tableData = ref([
	{
		id: 1,
		type: '月租',
		entryGate: '东门入口岗亭',
		entryTime: '2025-04-28 08:30:00',
		exitGate: '东门出口岗亭',
		exitTime: '2025-04-28 18:30:00',
		parkingSpace: 'A-001',
		fee: '0',
		status: '在场',
	},
	{
		id: 2,
		type: '临时',
		entryGate: '西门入口岗亭',
		entryTime: '2025-04-28 09:00:00',
		exitGate: '西门出口岗亭',
		exitTime: '2025-04-28 14:30:00',
		parkingSpace: 'B-002',
		fee: '15',
		status: '出场',
	},
	{
		id: 3,
		type: '访客',
		entryGate: '东门入口岗亭',
		entryTime: '2025-04-28 10:15:00',
		exitGate: '-',
		exitTime: '-',
		parkingSpace: 'C-001',
		fee: '-',
		status: '在场',
	},
	{
		id: 4,
		type: '月租',
		entryGate: '北门入口岗亭',
		entryTime: '2025-04-27 18:00:00',
		exitGate: '东门出口岗亭',
		exitTime: '2025-04-28 08:00:00',
		parkingSpace: 'VIP-001',
		fee: '0',
		status: '在场',
	},
	{
		id: 5,
		type: '临时',
		entryGate: '西门入口岗亭',
		entryTime: '2025-04-28 11:20:00',
		exitGate: '-',
		exitTime: '-',
		parkingSpace: 'D-001',
		fee: '-',
		status: '在场',
	},
	{
		id: 6,
		type: '访客',
		entryGate: '东门入口岗亭',
		entryTime: '2025-04-28 07:30:00',
		exitGate: '西门出口岗亭',
		exitTime: '2025-04-28 12:00:00',
		parkingSpace: 'E-002',
		fee: '10',
		status: '出场',
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

// 查询参数
const queryParams = reactive({
	type: '',
	status: '',
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
	queryParams.type = '';
	queryParams.status = '';
	console.log('重置');
};

// 车辆数据
const vehicleData = ref<any>(null);

// 打开弹窗
const openDialog = (id?: string, row?: any) => {
	visible.value = true;
	vehicleData.value = row;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.record-dialog {
	:deep(.el-dialog__body) {
		padding-top: 10px;
		height: 500px;
		overflow-y: auto;
	}
}
:deep(.mb20) {
	margin-bottom: 0 !important;
}
</style>
