<template>
	<div class="layout-padding">
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
						<el-button type="primary" size="large" @click="handleAutoBlacklist">自动拉黑规则</el-button>
						<el-button type="primary" size="large" @click="handleManualBlacklist">手动拉黑</el-button>
					</div>
				</template>

				<!-- 来源列插槽 -->
				<template #sourceSlot="{ row }">
					<el-tag :type="getSourceTag(row.source)" size="small">{{ row.source }}</el-tag>
				</template>

				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="getStatusTag(row.status)" size="small">{{ row.status }}</el-tag>
				</template>
			</ConfigurableTableWithForm>

			<!-- 自动拉黑规则弹窗 -->
			<AutoBlacklistDialog ref="autoBlacklistDialogRef" />
			<!-- 手动拉黑弹窗 -->
			<ManualBlacklistDialog ref="manualBlacklistDialogRef" />
			<!-- 详情弹窗 -->
			<DetailDialog ref="detailDialogRef" />
		</div>
	</div>
</template>

<script setup lang="ts" name="blacklistIndex">
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import AutoBlacklistDialog from './autoBlacklistDialog.vue';
import ManualBlacklistDialog from './manualBlacklistDialog.vue';
import DetailDialog from './detailDialog.vue';

// 表格引用
const tableRef = ref();
// 弹窗引用
const autoBlacklistDialogRef = ref();
const manualBlacklistDialogRef = ref();
const detailDialogRef = ref();

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '车牌号', value: 'plateNumber', type: 'text', selected: true },
		{ label: '拉黑原因', value: 'reason', type: 'text', selected: true },
		{ label: '来源', value: 'source', type: 'select', selected: true },
		{ label: '状态', value: 'status', type: 'select', selected: true },
	],
	fieldOptions: {
		source: [
			{ label: '规则', value: '规则' },
			{ label: '手动', value: '手动' },
		],
		status: [
			{ label: '生效中', value: '生效中' },
			{ label: '已过期', value: '已过期' },
			{ label: '已解除', value: '已解除' },
		],
	},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', align: 'center' },
	{ prop: 'vehicleInfo', label: '车辆信息', align: 'center' },
	{ prop: 'reason', label: '拉黑原因', align: 'center' },
	{ prop: 'source', label: '来源', align: 'center', slot: 'sourceSlot' },
	{ prop: 'violations', label: '违规', align: 'center' },
	{ prop: 'interceptPoints', label: '入场拦截', align: 'center' },
	{ prop: 'blacklistTime', label: '拉黑时间', align: 'center' },
	{ prop: 'expireDate', label: '到期', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 120,
		fixed: 'right',
		align: 'center',
		operations: [
			{ label: '详情', action: 'detail', type: 'primary', link: true },
			{ label: '解除', action: 'unban', type: 'primary', link: true },
		],
	},
];

// 表格数据
const tableData = ref([
	{
		id: 1,
		plateNumber: '京X12345',
		vehicleInfo: '大众 帕萨特 白色',
		reason: '逃费',
		source: '手动',
		violations: 3,
		interceptPoints: '大门入口',
		blacklistTime: '2025-04-15 10:30:00',
		expireDate: '2025-07-15',
		status: '生效中',
	},
	{
		id: 2,
		plateNumber: '京Y67890',
		vehicleInfo: '奔驰 E300L 黑色',
		reason: '恶意占位',
		source: '规则·闯杆检测',
		violations: 5,
		interceptPoints: '大门入口, 地下车库入口',
		blacklistTime: '2025-04-10 14:00:00',
		expireDate: '2025-05-10',
		status: '已过期',
	},
	{
		id: 3,
		plateNumber: '京Z11111',
		vehicleInfo: '丰田 凯美瑞 银色',
		reason: '违章车辆',
		source: '手动',
		violations: 2,
		interceptPoints: '所有入口',
		blacklistTime: '2025-03-20 09:15:00',
		expireDate: '永久',
		status: '生效中',
	},
	{
		id: 4,
		plateNumber: '京A22222',
		vehicleInfo: '本田 雅阁 蓝色',
		reason: '逃费',
		source: '规则·闯杆检测',
		violations: 1,
		interceptPoints: '大门入口',
		blacklistTime: '2025-02-10 16:20:00',
		expireDate: '2025-04-10',
		status: '已解除',
	},
	{
		id: 5,
		plateNumber: '京B33333',
		vehicleInfo: '宝马 5系 红色',
		reason: '拒绝配合管理',
		source: '手动',
		violations: 4,
		interceptPoints: '地下车库入口',
		blacklistTime: '2025-01-25 08:00:00',
		expireDate: '2025-03-25',
		status: '已解除',
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

// 查询参数
const queryParams = reactive({
	plateNumber: '',
	reason: '',
	source: '',
	status: '',
});

// 获取来源标签样式
const getSourceTag = (source: string) => {
	if (source.startsWith('规则')) {
		return 'primary';
	}
	return 'info';
};

// 获取状态标签样式
const getStatusTag = (status: string) => {
	const statusMap: Record<string, string> = {
		生效中: 'danger',
		已过期: 'info',
		已解除: 'success',
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
	queryParams.reason = '';
	queryParams.source = '';
	queryParams.status = '';
	console.log('重置');
};

// 自动拉黑规则
const handleAutoBlacklist = () => {
	autoBlacklistDialogRef.value?.openDialog();
};

// 手动拉黑
const handleManualBlacklist = () => {
	manualBlacklistDialogRef.value?.openDialog();
};

// 操作处理
const handleOperation = (data: any) => {
	const { action, row } = data;
	switch (action) {
		case 'detail':
			handleDetail(row);
			break;
		case 'unban':
			handleUnban(row);
			break;
	}
};

// 详情
const handleDetail = (row: any) => {
	detailDialogRef.value?.openDialog(row.id, row);
};

// 解除
const handleUnban = async (row: any) => {
	try {
		await useMessageBox().confirm(`确认解除车牌 ${row.plateNumber} 的黑名单吗？`);
		useMessage().success('解除成功');
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
</style>
