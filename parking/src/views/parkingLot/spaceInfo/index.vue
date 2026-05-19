<template>
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
				<div class="table-actions-container">
					<el-button type="primary" size="large" @click="handleImport">感应器数据导入</el-button>
					<el-button type="primary" size="large" @click="handleBatchAdd">批量生成车位编号</el-button>
				</div>
			</template>

			<!-- 类型列插槽 -->
			<template #typeSlot="{ row }">
				<el-tag :type="getTypeTag(row.type)" size="small">
					{{ row.type === 'monthly' ? '月租' : row.type === 'temporary' ? '临时' : row.type }}
				</el-tag>
			</template>

			<!-- 当前忙闲列插槽 -->
			<template #busyStatusSlot="{ row }">
				<div>
					<el-tag :type="row.busyStatus === 'idle' ? 'success' : 'danger'" size="small">
						{{ row.busyStatus === 'idle' ? '空闲' : row.busyStatus === 'Occupied' ? '占用中' : row.busyStatus }}
					</el-tag>
					<div v-if="row.busyStatus === 'Occupied' && row.occupiedPlate" class="plate-text">{{ row.occupiedPlate }}</div>
				</div>
			</template>

			<!-- 绑定状态列插槽 -->
			<template #bindStatusSlot="{ row }">
				<el-tag :type="row.bindStatus === 'binding' ? 'primary' : 'info'" size="small">
					{{ row.bindStatus === 'binding' ? '已绑定' : row.bindStatus === 'unbinding' ? '未绑定' : row.bindStatus }}车辆
				</el-tag>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import ImportDialog from './importDialog.vue';
import AddDialog from './addDialog.vue';
import SetDialog from './setDialog.vue';
import { getParkingSpacePage, deleteParkingSpace } from '/@/api/parkingInfo';
import type { ParkingSpace, ParkingSpacePageData } from '/@/api/parkingInfo/type';

// 弹框引用
const importDialogRef = ref();
const addDialogRef = ref();
const setDialogRef = ref();

// 表格引用
const tableRef = ref();

// 加载状态
const loading = ref(false);

// 表格数据
const tableData = ref<ParkingSpace[]>([]);

// 分页信息
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0,
});

// 查询参数
const queryParams = reactive({
	bindStatus: '',
	occupiedPlate: '',
	bindPlate: '',
});

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '绑定状态', value: 'bindStatus', type: 'select', selected: true },
		{ label: '占用车牌号', value: 'occupiedPlate', type: 'text', selected: true },
		{ label: '绑定车牌号', value: 'bindPlate', type: 'text', selected: true },
	],
	fieldOptions: {
		bindStatus: [
			{ label: '已绑定车辆', value: 'binding' },
			{ label: '未绑定车辆', value: 'unbinding' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'parkingSpaceCode', label: '车位编号', align: 'center' },
	{ prop: 'parkingGroundName', label: '所属停车场', align: 'center' },
	{ prop: 'type', label: '类型', align: 'center', slot: 'typeSlot' },
	{ prop: 'sensorCode', label: '感应器编号', align: 'center' },
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

// 获取类型标签样式
const getTypeTag = (type: string) => {
	const typeMap: Record<string, string> = {
		monthly: 'primary',
		temporary: 'info',
	};
	return typeMap[type] || 'info';
};

// 获取列表数据
const fetchList = async () => {
	loading.value = true;
	try {
		const res = await getParkingSpacePage({
			current: pagination.current,
			size: pagination.size,
			bindStatus: queryParams.bindStatus,
			occupiedPlate: queryParams.occupiedPlate,
			bindPlate: queryParams.bindPlate,
		});
		if (res.code === 0 && res.data) {
			tableData.value = res.data.records || [];
			pagination.total = res.data.total || 0;
		} else {
			useMessage().error(res.msg || '获取数据失败');
		}
	} catch (error: any) {
		useMessage().error(error.msg || '获取数据失败');
	} finally {
		loading.value = false;
	}
};

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	pagination.current = 1;
	fetchList();
};

// 重置
const handleReset = () => {
	queryParams.bindStatus = '';
	queryParams.occupiedPlate = '';
	queryParams.bindPlate = '';
	pagination.current = 1;
	fetchList();
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
	fetchList();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
	pagination.size = size;
	pagination.current = 1;
	fetchList();
};

// 页码变化
const handleCurrentChange = (page: number) => {
	pagination.current = page;
	fetchList();
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
const handleConfig = (row: ParkingSpace) => {
	setDialogRef.value?.openDialog(row.id, row);
};

// 删除
const handleDelete = async (row: ParkingSpace) => {
	try {
		await useMessageBox().confirm('确认删除该车位吗？');
		const res = await deleteParkingSpace([row.id!]);
		if (res.code === 0) {
			useMessage().success('删除成功');
			fetchList();
		} else {
			useMessage().error(res.msg || '删除失败');
		}
	} catch {}
};

// 页面加载时获取数据
onMounted(() => {
	fetchList();
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
.table-actions-container {
	display: flex;
	justify-content: space-between;
}
.plate-text {
	font-size: 10px;
	color: #909399;
}
</style>