<template>
	<div class="layout-padding-auto layout-padding-view">
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
			<template #tableActions>
				<el-button type="primary" size="large" @click="handleAdd">新增停车场</el-button>
			</template>

			<!-- 类型列插槽 -->
			<template #typeSlot="{ row }">
				<el-tag :type="row.type === '地下' ? 'primary' : 'success'" size="small">{{ row.type }}</el-tag>
			</template>

			<!-- 状态列插槽 -->
			<template #statusSlot="{ row }">
				<el-tag :type="row.status === '运营中' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag>
			</template>
		</ConfigurableTableWithForm>

		<!-- 新增/编辑弹窗 -->
		<AddDialog ref="addDialogRef" @refresh="handleRefresh" />
	</div>
</template>

<script setup lang="ts" name="parkingInfoIndex">
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import AddDialog from './addDialog.vue';

// 弹窗引用
const addDialogRef = ref();

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '名称', value: 'name', type: 'text', selected: true },
		{ label: '类型', value: 'type', type: 'select', selected: true },
		{ label: '状态', value: 'status', type: 'select', selected: true },
	],
	fieldOptions: {
		type: [
			{ label: '地下', value: '地下' },
			{ label: '地面', value: '地面' },
		],
		status: [
			{ label: '运营中', value: '运营中' },
			{ label: '停运', value: '停运' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'code', label: '编号', width: 100, align: 'center' },
	{ prop: 'name', label: '名称', minWidth: 140, align: 'center' },
	{ prop: 'location', label: '位置', minWidth: 160, align: 'center' },
	{ prop: 'type', label: '类型', width: 80, align: 'center', slot: 'typeSlot' },
	{ prop: 'totalSpaces', label: '总车位', width: 80, align: 'center' },
	{ prop: 'operationTime', label: '运营时间', width: 180, align: 'center' },
	{ prop: 'manager', label: '负责人', width: 100, align: 'center' },
	{ prop: 'status', label: '状态', width: 80, align: 'center', slot: 'statusSlot' },
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

// 表格数据
const tableData = ref([
	{
		id: 1,
		code: 'P001',
		name: '阳光花园地下停车场',
		location: '阳光花园小区A栋地下',
		type: '地下',
		totalSpaces: 200,
		operationTime: '06:00 - 24:00',
		manager: '张经理',
		status: '运营中',
	},
	{
		id: 2,
		code: 'P002',
		name: '翠苑小区地面停车场',
		location: '翠苑小区东门入口',
		type: '地面',
		totalSpaces: 80,
		operationTime: '全天',
		manager: '李经理',
		status: '运营中',
	},
	{
		id: 3,
		code: 'P003',
		name: '商业中心停车场',
		location: '商业中心大厦B1-B3层',
		type: '地下',
		totalSpaces: 500,
		operationTime: '07:00 - 23:00',
		manager: '王经理',
		status: '运营中',
	},
	{
		id: 4,
		code: 'P004',
		name: '星光大道停车场',
		location: '星光大道南侧',
		type: '地面',
		totalSpaces: 60,
		operationTime: '08:00 - 22:00',
		manager: '赵经理',
		status: '停运',
	},
	{
		id: 5,
		code: 'P005',
		name: '市民广场地下停车场',
		location: '市民广场地下负一负二层',
		type: '地下',
		totalSpaces: 350,
		operationTime: '全天',
		manager: '钱经理',
		status: '运营中',
	},
	{
		id: 6,
		code: 'P006',
		name: '老城区停车场',
		location: '老城区中心街',
		type: '地面',
		totalSpaces: 45,
		operationTime: '08:00 - 20:00',
		manager: '孙经理',
		status: '停运',
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
	name: '',
	type: '',
	status: '',
});

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	console.log('查询', queryParams);
};

// 重置
const handleReset = () => {
	queryParams.name = '';
	queryParams.type = '';
	queryParams.status = '';
	console.log('重置');
};

// 新增
const handleAdd = () => {
	addDialogRef.value.openDialog();
};

// 刷新列表
const handleRefresh = () => {
	console.log('刷新列表');
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
const handleEdit = (row: any) => {
	addDialogRef.value.openDialog(row.id, row);
};

// 删除
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm('确认删除该停车场吗？');
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
</style>
