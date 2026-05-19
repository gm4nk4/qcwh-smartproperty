<template>
	<div class="layout-padding device-maintain-page">
		<ConfigurableTableWithForm
			ref="tableWithFormRef"
			:queryFormConfig="queryFormConfig"
			:tableConfig="tableConfig"
			@search="handleSearch"
			@reset="handleReset"
			@operation="handleOperation"
			:showExport="false"
		>
			<template #tableActions>
				<el-button type="primary" @click="handleAdd">新增岗亭</el-button>
			</template>

			<!-- 绑定摄像头列自定义渲染 -->
			<template #camerasSlot="{ row }">
				<el-tag v-for="camera in row.cameras" :key="camera.id" size="small" class="camera-tag">
					{{ camera.name }}
				</el-tag>
			</template>
		</ConfigurableTableWithForm>

		<!-- 编辑弹窗 -->
		<EditDialog ref="editDialogRef" @refresh="refreshData" />
	</div>
</template>

<script lang="ts" setup name="deviceMaintainIndex">
import { ref, reactive } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage } from '/@/hooks/message';
import EditDialog from './EditDialog.vue';

const tableWithFormRef = ref();
const editDialogRef = ref();

// 查询表单配置
const queryFormConfig: QueryFormConfig = {
	fields: [
		{ label: '岗亭名称', value: 'gateName', selected: true },
		{ label: '状态', value: 'status', selected: true, type: 'select' },
	],
	fieldOptions: {
		status: [
			{ label: '全部', value: '' },
			{ label: '正常', value: 1 },
			{ label: '故障', value: 0 },
		],
	},
};

// 模拟表格数据
const mockData = ref([
	{
		id: 1,
		code: 'GT001',
		gateName: '东门入口岗亭',
		cameras: [
			{ id: 1, name: '入口摄像头-主摄' },
			{ id: 2, name: '入口摄像头-辅摄' },
		],
		tempCarIn: 'allow',
		visitorCarIn: 'allow',
		hasFee: 'yes',
		direction: '可进场',
		barrierDevice: '入口道闸-1号',
		serviceInterface: '科拓停车系统',
		status: 1,
	},
	{
		id: 2,
		code: 'GT002',
		gateName: '东门出口岗亭',
		cameras: [{ id: 3, name: '出口摄像头-主摄' }],
		tempCarIn: 'allow',
		visitorCarIn: 'forbidden',
		hasFee: 'yes',
		direction: '可出场',
		barrierDevice: '出口道闸-1号',
		serviceInterface: '科拓停车系统',
		status: 1,
	},
	{
		id: 3,
		code: 'GT003',
		gateName: '西门入口岗亭',
		cameras: [
			{ id: 4, name: '西门入口摄像头' },
			{ id: 5, name: '西门入口辅摄' },
		],
		tempCarIn: 'forbidden',
		visitorCarIn: 'allow',
		hasFee: 'no',
		direction: '可进场',
		barrierDevice: '西门入口道闸',
		serviceInterface: '捷顺停车系统',
		status: 0,
	},
	{
		id: 4,
		code: 'GT004',
		gateName: '地下车库入口',
		cameras: [{ id: 6, name: '地下车库入口摄像头' }],
		tempCarIn: 'allow',
		visitorCarIn: 'allow',
		hasFee: 'yes',
		direction: '可进出',
		barrierDevice: '地下车库道闸',
		serviceInterface: '科拓停车系统',
		status: 1,
	},
]);

// 表格配置
const tableConfig = reactive<TableConfig>({
	data: mockData.value,
	columns: [
		{ prop: 'code', label: '编号', width: 100 },
		{ prop: 'gateName', label: '岗亭名称', minWidth: 140 },
		{
			prop: 'cameras',
			label: '绑定摄像头',
			minWidth: 200,
			slot: 'camerasSlot',
		},
		{
			prop: 'tempCarIn',
			label: '临时车进场',
			width: 100,
			type: 'tag',
			tagConfig: {
				map: {
					allow: { text: '允许', class: 'tag-success' },
					forbidden: { text: '禁止', class: 'tag-danger' },
				},
				default: { text: '未知', class: 'tag-info' },
			},
		},
		{
			prop: 'visitorCarIn',
			label: '访客车进场',
			width: 100,
			type: 'tag',
			tagConfig: {
				map: {
					allow: { text: '允许', class: 'tag-success' },
					forbidden: { text: '禁止', class: 'tag-danger' },
				},
				default: { text: '未知', class: 'tag-info' },
			},
		},
		{
			prop: 'hasFee',
			label: '收费',
			width: 80,
			type: 'tag',
			tagConfig: {
				map: {
					yes: { text: '是', class: 'tag-success' },
					no: { text: '否', class: 'tag-info' },
				},
				default: { text: '未知', class: 'tag-warning' },
			},
		},
		{ prop: 'direction', label: '通行方向', width: 100 },
		{ prop: 'barrierDevice', label: '绑定道闸设备', minWidth: 140 },
		{ prop: 'serviceInterface', label: '服务接口', minWidth: 120 },
		{
			prop: 'status',
			label: '状态',
			width: 100,
			type: 'tag',
			tagConfig: {
				map: {
					1: { text: '正常', class: 'tag-success' },
					0: { text: '故障', class: 'tag-danger' },
				},
				default: { text: '未知', class: 'tag-warning' },
			},
		},
		{
			type: 'operation',
			label: '操作',
			width: 80,
			fixed: 'right',
			operations: [{ label: '编辑', action: 'edit', type: 'primary', link: true }],
		},
	],
	pagination: true,
	pageSize: 10,
	total: mockData.value.length,
	showRightToolbar: true,
	rightToolbar: {
		showSearch: true,
		export: false,
	},
});

// 搜索处理
const handleSearch = (searchData: Record<string, any>) => {
	console.log('搜索条件:', searchData);
	// TODO: 调用API获取数据
};

// 重置处理
const handleReset = () => {
	console.log('重置查询');
	// TODO: 重置并刷新数据
};

// 操作处理
const handleOperation = (data: any) => {
	if (data.action === 'edit') {
		editDialogRef.value?.openDialog(data.row);
	}
};

// 新增
const handleAdd = () => {
	editDialogRef.value?.openDialog();
};

// 刷新数据
const refreshData = () => {
	tableWithFormRef.value?.getDataList();
	useMessage().success('操作成功');
};
</script>

<style scoped lang="scss">
.device-maintain-page {
	height: 100%;

	.camera-tag {
		margin-right: 6px;
		margin-bottom: 4px;
	}

	// tag 基础样式
	:deep(.tag-success),
	:deep(.tag-danger),
	:deep(.tag-info),
	:deep(.tag-warning) {
		border-radius: 4px;
		padding: 0px 7px;
		line-height: 12px;
		height: 20px;
	}

	:deep(.tag-success) {
		background-color: #e1f3d8;
		color: #67c23a;
		border-color: #c2e7b0;
	}

	:deep(.tag-danger) {
		background-color: #fde2e2;
		color: #f56c6c;
		border-color: #fbc4c4;
	}

	:deep(.tag-info) {
		background-color: #e9e9eb;
		color: #909399;
		border-color: #d3d4d6;
	}

	:deep(.tag-warning) {
		background-color: #fdf6ec;
		color: #e6a23c;
		border-color: #faecd8;
	}
}
</style>
