<template>
	<el-dialog :close-on-click-modal="false" title="通行记录" width="1002px" draggable v-model="visible" class="record-dialog">
		<div style="height: 400px; overflow-y: auto">
			<ConfigurableTableWithForm
				ref="tableRef"
				:table-config="tableConfig"
				@search="handleSearch"
				@reset="handleReset"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
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
import { getPassRecordPage } from '/@/api/passRecord';
import type { PassRecord } from '/@/api/passRecord/type';

// 定义变量内容
const visible = ref(false);
const tableRef = ref();
const loading = ref(false);
const tableData = ref<PassRecord[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [],
	fieldOptions: {},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'vehicleType', label: '类型', align: 'center', slot: 'typeSlot' },
	{ prop: 'entryGate', label: '进场岗亭', align: 'center' },
	{ prop: 'entryTime', label: '入场时间', align: 'center' },
	{ prop: 'exitGate', label: '出场岗亭', align: 'center' },
	{ prop: 'exitTime', label: '出场时间', align: 'center' },
	{ prop: 'totalFee', label: '费用', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center', slot: 'statusSlot' },
];

// 表格配置
const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: tableData.value,
	selectionType: 'none',
	showIndex: true,
	loading: loading.value,
	pagination: true,
	pageSize: pageSize.value,
	currentPage: currentPage.value,
	total: total.value,
	showOperations: false,
}));

// 查询参数
const queryParams = reactive({
	vehicleType: '',
	status: '',
});

// 车辆数据
const vehicleData = ref<any>(null);

// 获取列表数据
const fetchList = async () => {
	if (!vehicleData.value?.plateNumber) return;
	loading.value = true;
	try {
		const res = await getPassRecordPage({
			current: currentPage.value,
			size: pageSize.value,
			queryName: vehicleData.value.plateNumber,
		});
		if (res.code === 0) {
			tableData.value = res.data.records || [];
			total.value = res.data.total || 0;
		}
	} finally {
		loading.value = false;
	}
};

// 获取类型标签样式
const getTypeTag = (type: string) => {
	const typeMap: Record<string, string> = {
		月租: 'primary',
		临时: 'info',
		访客: 'warning',
	};
	return typeMap[type] || 'info';
};

// 分页大小变化
const handleSizeChange = (size: number) => {
	pageSize.value = size;
	currentPage.value = 1;
	fetchList();
};

// 页码变化
const handleCurrentChange = (page: number) => {
	currentPage.value = page;
	fetchList();
};

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	currentPage.value = 1;
	fetchList();
};

// 重置
const handleReset = () => {
	queryParams.vehicleType = '';
	queryParams.status = '';
	currentPage.value = 1;
	fetchList();
};

// 打开弹窗
const openDialog = (id?: string, row?: any) => {
	visible.value = true;
	vehicleData.value = row;
	currentPage.value = 1;
	fetchList();
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
