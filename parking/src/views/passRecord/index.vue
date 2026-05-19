<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<ConfigurableTableWithForm
				ref="tableRef"
				:query-form-config="queryFormConfig"
				:table-config="tableConfig"
				@search="handleSearch"
				@reset="handleReset"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:showExport="false"
			>
				<!-- 类型列插槽 -->
				<template #typeSlot="{ row }">
					<el-tag :type="getTypeTag(row.vehicleType)" size="small">{{ row.vehicleType }}</el-tag>
				</template>

				<!-- 入场抓拍列插槽 -->
				<template #entryCaptureSlot="{ row }">
					<el-image
						v-if="row.entryCaptureUrl"
						:src="row.entryCaptureUrl"
						:preview-src-list="[row.entryCaptureUrl]"
						fit="cover"
						class="capture-image"
						preview-teleported
					/>
					<span v-else class="no-capture">-</span>
				</template>

				<!-- 出场抓拍列插槽 -->
				<template #exitCaptureSlot="{ row }">
					<el-image
						v-if="row.exitCaptureUrl"
						:src="row.exitCaptureUrl"
						:preview-src-list="[row.exitCaptureUrl]"
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
import { ref, reactive, computed, onMounted } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { getPassRecordPage } from '/@/api/passRecord';
import type { PassRecord } from '/@/api/passRecord/type';

// 表格数据
const tableData = ref<PassRecord[]>([]);
// 加载状态
const loading = ref(false);
// 分页信息
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0,
});

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '车牌号/归属', value: 'queryName', type: 'text', selected: true },
		{ label: '类型', value: 'vehicleType', type: 'select', selected: true },
	],
	fieldOptions: {
		vehicleType: [
			{ label: '月租', value: '月租' },
			{ label: '临时', value: '临时' },
			{ label: '访客', value: '访客' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', width: 120, align: 'center' },
	{ prop: 'vehicleType', label: '类型', width: 80, align: 'center', slot: 'typeSlot' },
	{ prop: 'belongInfo', label: '归属', width: 100, align: 'center' },
	{ prop: 'entryGate', label: '进场岗亭', width: 120, align: 'center' },
	{ prop: 'entryTime', label: '入场时间', width: 160, align: 'center' },
	{ prop: 'entryCaptureUrl', label: '入场抓拍', minWidth: 100, align: 'center', slot: 'entryCaptureSlot' },
	{ prop: 'exitGate', label: '出场岗亭', width: 120, align: 'center' },
	{ prop: 'exitTime', label: '出场时间', minWidth: 160, align: 'center' },
	{ prop: 'exitCaptureUrl', label: '出场抓拍', width: 100, align: 'center', slot: 'exitCaptureSlot' },
	{ prop: 'totalFee', label: '费用', width: 80, align: 'center' },
	{ prop: 'status', label: '状态', width: 90, align: 'center', slot: 'statusSlot' },
];

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
}));

// 表格引用
const tableRef = ref();

// 查询参数
const queryParams = reactive({
	queryName: '',
	vehicleType: '',
});

// 获取表格数据
const fetchTableData = async () => {
	loading.value = true;
	try {
		const res = await getPassRecordPage({
			current: pagination.current,
			size: pagination.size,
			queryName: queryParams.queryName,
			vehicleType: queryParams.vehicleType,
		});
		if (res.code === 0) {
			tableData.value = res.data.records || [];
			pagination.total = res.data.total || 0;
		}
	} catch (error) {
		console.error('获取通行记录失败:', error);
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

// 获取状态标签样式
const getStatusTag = (status: string) => {
	const statusMap: Record<string, string> = {
		已出场: 'success',
		在场: 'primary',
	};
	return statusMap[status] || 'info';
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
// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	pagination.current = 1;
	fetchTableData();
};

// 重置
const handleReset = () => {
	queryParams.queryName = '';
	queryParams.vehicleType = '';
	pagination.current = 1;
	fetchTableData();
};

// 初始化加载
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
