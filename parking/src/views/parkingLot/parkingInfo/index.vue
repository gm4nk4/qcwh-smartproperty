<template>
	<div class="layout-padding-auto layout-padding-view">
		<ConfigurableTableWithForm
			ref="tableRef"
			:table-config="tableConfig"
			@search="handleSearch"
			@reset="handleReset"
			@operation="handleOperation"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:showColumnSettings="false"
			:showSearchToggle="false"
			:showExport="false"
			:showRefresh="false"
		>
			<template #tableActions>
				<el-button type="primary" size="large" @click="handleAdd">新增停车场</el-button>
			</template>

			<!-- 类型列插槽 -->
			<template #typeSlot="{ row }">
				<el-tag :type="row.type === 'under' ? 'primary' : 'success'" size="small">
					{{ row.type === 'under' ? '地下' : row.type === 'ground' ? '地面' : row.type }}
				</el-tag>
			</template>

			<!-- 状态列插槽 -->
			<template #statusSlot="{ row }">
				<el-tag :type="row.status === 'running' ? 'success' : 'danger'" size="small">
					{{ row.status === 'running' ? '运营中' : row.status === 'stop' ? '已停用' : row.status }}
				</el-tag>
			</template>

			<!-- 负责人列插槽 -->
			<template #personSlot="{ row }">
				<span>{{ row.personInCharge }} {{ row.contactPhone }}</span>
			</template>
		</ConfigurableTableWithForm>

		<!-- 新增/编辑弹窗 -->
		<AddDialog ref="addDialogRef" @refresh="handleRefresh" />
	</div>
</template>

<script setup lang="ts" name="parkingInfoIndex">
import { ref, reactive, computed, onMounted } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import AddDialog from './addDialog.vue';
import { getParkingGroundPage, deleteParkingGround } from '/@/api/parkingInfo';
import type { ParkingGround, ParkingGroundPageData } from '/@/api/parkingInfo/type';

// 弹窗引用
const addDialogRef = ref();

// 表格引用
const tableRef = ref();

// 加载状态
const loading = ref(false);

// 表格数据
const tableData = ref<ParkingGround[]>([]);

// 分页信息
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0,
});

// 查询参数
const queryParams = reactive({
	queryName: '',
	type: '',
	status: '',
});

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '名称', value: 'queryName', type: 'text', selected: true },
		{ label: '类型', value: 'type', type: 'select', selected: true },
		{ label: '状态', value: 'status', type: 'select', selected: true },
	],
	fieldOptions: {
		type: [
			{ label: '地下', value: 'under' },
			{ label: '地面', value: 'ground' },
		],
		status: [
			{ label: '运营中', value: 'running' },
			{ label: '已停用', value: 'stop' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'parkingGroundCode', label: '编号', align: 'center' },
	{ prop: 'parkingGroundName', label: '名称', align: 'center' },
	{ prop: 'location', label: '位置', align: 'center' },
	{ prop: 'type', label: '类型', align: 'center', slot: 'typeSlot' },
	{ prop: 'totalSpaces', label: '总车位', align: 'center' },
	{ prop: 'operationTime', label: '运营时间', align: 'center' },
	{ prop: 'personInCharge', label: '负责人', align: 'center', slot: 'personSlot' },
	{ prop: 'status', label: '状态', align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 120,
		fixed: 'right',
		align: 'center',
		operations: [
			{ label: '编辑', action: 'edit', type: 'primary', link: true },
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

// 获取列表数据
const fetchList = async () => {
	loading.value = true;
	try {
		const res = await getParkingGroundPage({
			current: pagination.current,
			size: pagination.size,
			queryName: queryParams.queryName,
			type: queryParams.type,
			status: queryParams.status,
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
	queryParams.queryName = '';
	queryParams.type = '';
	queryParams.status = '';
	pagination.current = 1;
	fetchList();
};

// 新增
const handleAdd = () => {
	addDialogRef.value.openDialog();
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
		case 'edit':
			handleEdit(row);
			break;
		case 'delete':
			handleDelete(row);
			break;
	}
};

// 编辑
const handleEdit = (row: ParkingGround) => {
	addDialogRef.value.openDialog(row.id, row);
};

// 删除
const handleDelete = async (row: ParkingGround) => {
	try {
		await useMessageBox().confirm('确认删除该停车场吗？');
		const res = await deleteParkingGround([row.id!]);
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
</style>
