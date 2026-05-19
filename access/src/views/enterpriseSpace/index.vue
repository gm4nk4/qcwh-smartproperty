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
					<el-button type="primary" size="large" @click="handleAdd">新增企业车位包</el-button>
				</template>

				<!-- 车位配额列插槽 - 进度条 -->
				<template #quotaSlot="{ row }">
					<div class="quota-cell">
						<span class="quota-text">{{ row.usedQuota }}/{{ row.totalQuota }}</span>
						<el-progress :percentage="(row.usedQuota / row.totalQuota) * 100" :stroke-width="10" :show-text="false" />
					</div>
				</template>

				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="row.status === '正常' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
				</template>
			</ConfigurableTableWithForm>

			<!-- 详情弹窗 -->
			<DetailDialog ref="detailDialogRef" />

			<!-- 新增弹窗 -->
			<AddDialog ref="addDialogRef" @refresh="handleRefresh" />
		</div>
	</div>
</template>

<script setup lang="ts" name="enterpriseSpaceIndex">
import { ref, reactive, computed } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage } from '/@/hooks/message';
import DetailDialog from './detailDialog.vue';
import AddDialog from './addDialog.vue';

// 弹窗引用
const detailDialogRef = ref();
const addDialogRef = ref();

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '企业名称', value: 'companyName', type: 'text', selected: true },
		{ label: '车牌号', value: 'plateNumber', type: 'text', selected: true },
	],
	fieldOptions: {},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'companyName', label: '企业名称', minWidth: 160, align: 'center' },
	{ prop: 'contact', label: '联系人', width: 140, align: 'center' },
	{ prop: 'contract', label: '合同编号', width: 120, align: 'center' },
	{ prop: 'quota', label: '车位配额', width: 150, align: 'center', slot: 'quotaSlot' },
	{ prop: 'priceRule', label: '计费规则', minWidth: 180, align: 'center' },
	{ prop: 'vehicles', label: '绑定车辆', minWidth: 140, align: 'center' },
	{ prop: 'monthlyFee', label: '当前月费', width: 100, align: 'center' },
	{ prop: 'validPeriod', label: '有效期', width: 120, align: 'center' },
	{ prop: 'status', label: '状态', width: 100, align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 80,
		fixed: 'right',
		align: 'center',
		operations: [{ label: '详情', action: 'detail', type: 'primary', link: true }],
	},
];

// 表格数据
const tableData = ref([
	{
		id: 1,
		companyName: '星辰传媒有限公司',
		contact: '陈总 138****5678',
		contract: 'CT-2025-008',
		usedQuota: 3,
		totalQuota: 8,
		priceRule: '1~5个: 400元/月 · 第6个起: 600元/月',
		vehicles: '京A-88888, 京B-66666, 京G-33333',
		monthlyFee: '¥3800',
		validPeriod: '2025-01-01~2025-12-31',
		status: '正常',
	},
	{
		id: 2,
		companyName: '云帆网络科技有限公司',
		contact: '张经理 136****7890',
		contract: 'CT-2025-012',
		usedQuota: 2,
		totalQuota: 6,
		priceRule: '1~3个: 350元/月 · 第4个起: 500元/月',
		vehicles: '京D-99999, 京E-55555',
		monthlyFee: '¥2050',
		validPeriod: '2025-02-01~2026-01-31',
		status: '正常',
	},
	{
		id: 3,
		companyName: '鼎信会计师事务所',
		contact: '孙所长 186****3344',
		contract: 'CT-2025-015',
		usedQuota: 1,
		totalQuota: 3,
		priceRule: '1~2个: 400元/月 · 第3个起: 550元/月',
		vehicles: '京H-22222',
		monthlyFee: '¥1350',
		validPeriod: '2025-03-01~2026-02-28',
		status: '正常',
	},
	{
		id: 4,
		companyName: '博雅律师事务所',
		contact: '何律师 188****5566',
		contract: 'CT-2025-018',
		usedQuota: 1,
		totalQuota: 2,
		priceRule: '1~2个: 350元/月',
		vehicles: '京K-44444',
		monthlyFee: '¥700',
		validPeriod: '2025-04-01~2026-03-31',
		status: '正常',
	},
	{
		id: 5,
		companyName: '鑫源贸易有限公司',
		contact: '吴总 199****7788',
		contract: 'CT-2025-020',
		usedQuota: 0,
		totalQuota: 4,
		priceRule: '1~2个: 350元/月 · 第3个起: 480元/月',
		vehicles: '-',
		monthlyFee: '¥0',
		validPeriod: '2025-05-01~2026-04-30',
		status: '待绑定车辆',
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
	companyName: '',
	plateNumber: '',
});

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	console.log('查询', queryParams);
};

// 重置
const handleReset = () => {
	queryParams.companyName = '';
	queryParams.plateNumber = '';
	console.log('重置');
};

// 新增
const handleAdd = () => {
	addDialogRef.value?.openDialog();
};

// 刷新列表
const handleRefresh = () => {
	console.log('刷新列表');
};

// 操作处理
const handleOperation = (data: any) => {
	const { action, row } = data;
	switch (action) {
		case 'detail':
			handleDetail(row);
			break;
	}
};

// 详情
const handleDetail = (row: any) => {
	detailDialogRef.value?.openDialog(row.id, row);
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

.quota-cell {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;

	.el-progress {
		flex: 1;
	}

	.quota-text {
		font-size: 12px;
		color: #606266;
		white-space: nowrap;
	}

	:deep(.el-progress-bar__outer) {
		height: 10px !important;
		border-radius: 999px;
		background: #eef2f7;
	}

	:deep(.el-progress-bar__inner) {
		border-radius: 999px;
	}
}
</style>
