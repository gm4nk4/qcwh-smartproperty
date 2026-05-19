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
				@page-change="handlePageChange"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:showExport="false"
			>
				<template #tableActions>
					<el-button type="primary" size="large" @click="handleAdd">新增企业车位包</el-button>
				</template>

				<!-- 车位配额列插槽 - 进度条 -->
				<template #quotaSlot="{ row }">
					<div class="quota-cell">
						<span class="quota-text">{{ row.usedSpaces || 0 }}/{{ row.totalSpaces || 0 }}</span>
						<el-progress :percentage="row.totalSpaces ? ((row.usedSpaces || 0) / row.totalSpaces) * 100 : 0" :stroke-width="10" :show-text="false" />
					</div>
				</template>

				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag :type="row.status === 'normal' ? 'success' : 'warning'" size="small">{{
						row.status === 'normal' ? '正常' : row.status || '待绑定车辆'
					}}</el-tag>
				</template>

				<!-- 绑定车辆列插槽 -->
				<template #vehiclesSlot="{ row }">
					<span>{{ formatVehicles(row.bindVehicles) || '-' }}</span>
				</template>

				<!-- 月费列插槽 -->
				<template #feeSlot="{ row }">
					<span>{{ row.currentMonthlyFee ? `¥${row.currentMonthlyFee}` : '¥0' }}</span>
				</template>

				<!-- 计费规则列插槽 -->
				<template #priceSlot="{ row }">
					<span>{{ row.pricingRule || formatPriceRule(row) }}</span>
				</template>
			</ConfigurableTableWithForm>

			<!-- 详情弹窗 -->
			<DetailDialog ref="detailDialogRef" />

			<!-- 新增/编辑弹窗 -->
			<AddDialog ref="addDialogRef" @refresh="handleRefresh" />
		</div>
	</div>
</template>

<script setup lang="ts" name="enterpriseSpaceIndex">
import { ref, reactive, computed, onMounted } from 'vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import DetailDialog from './detailDialog.vue';
import AddDialog from './addDialog.vue';
import { getEnterprisePackagePage, deleteEnterprisePackage } from '/@/api/enterpriseSpace';
import type { ParkingEnterprisePackageVO } from '/@/api/enterpriseSpace/type';

// 弹窗引用
const detailDialogRef = ref();
const addDialogRef = ref();

// 加载状态
const loading = ref(false);

// 表格数据
const tableData = ref<ParkingEnterprisePackageVO[]>([]);

// 分页参数
const pagination = reactive({
	current: 1,
	size: 10,
	total: 0,
});

// 查询表单配置
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '企业名称', value: 'queryName', type: 'text', selected: true },
		{ label: '车牌号', value: 'plateNumber', type: 'text', selected: true },
	],
	fieldOptions: {},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'enterpriseName', label: '企业名称', align: 'center' },
	{ prop: 'contactPerson', label: '联系人', align: 'center' },
	{ prop: 'contractNo', label: '合同编号', align: 'center' },
	{ prop: 'spaceQuota', label: '车位配额', align: 'center', slot: 'quotaSlot' },
	{ prop: 'pricingRule', label: '计费规则', align: 'center', slot: 'priceSlot' },
	{ prop: 'bindVehicles', label: '绑定车辆', align: 'center', slot: 'vehiclesSlot' },
	{ prop: 'currentMonthlyFee', label: '当前月费', align: 'center', slot: 'feeSlot' },
	{ prop: 'validPeriod', label: '有效期', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		fixed: 'right',
		align: 'center',
		operations: [
			{ label: '详情', action: 'detail', type: 'primary', link: true },
			// { label: '编辑', action: 'edit', type: 'primary', link: true },
			// { label: '删除', action: 'delete', type: 'danger', link: true },
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

// 表格引用
const tableRef = ref();

// 查询参数
const queryParams = reactive({
	queryName: '',
	plateNumber: '',
});

// 格式化绑定车辆显示
const formatVehicles = (vehicles?: ParkingEnterprisePackageVO['bindVehicles']) => {
	if (!vehicles || vehicles.length === 0) return '-';
	return vehicles.map((v) => v.plateNumber).join(', ');
};

// 格式化计费规则显示
const formatPriceRule = (row: ParkingEnterprisePackageVO) => {
	if (!row.baseSpaces || !row.basePrice) return '-';
	const baseRule = `1~${row.baseSpaces}个: ${row.basePrice}元/月`;
	const overRule = row.overPrice ? ` · 第${row.baseSpaces + 1}个起: ${row.overPrice}元/月` : '';
	return baseRule + overRule;
};

// 获取列表数据
const fetchData = async () => {
	loading.value = true;
	try {
		const res = await getEnterprisePackagePage({
			current: pagination.current,
			size: pagination.size,
			queryName: queryParams.queryName,
			plateNumber: queryParams.plateNumber,
		});
		if (res.code === 0 && res.data) {
			tableData.value = res.data.records || [];
			pagination.total = res.data.total || 0;
		} else {
			useMessage().error(res.msg || '获取数据失败');
		}
	} catch (err: any) {
		useMessage().error(err.msg || '获取数据失败');
	} finally {
		loading.value = false;
	}
};

// 页面加载时获取数据
onMounted(() => {
	fetchData();
});

// 查询
const handleSearch = (formData: Record<string, any>) => {
	Object.assign(queryParams, formData);
	pagination.current = 1;
	fetchData();
};

// 重置
const handleReset = () => {
	queryParams.queryName = '';
	queryParams.plateNumber = '';
	pagination.current = 1;
	fetchData();
};

// 分页变化
const handlePageChange = (page: { currentPage: number; pageSize: number }) => {
	pagination.current = page.currentPage;
	pagination.size = page.pageSize;
	fetchData();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
	pagination.size = size;
	pagination.current = 1;
	fetchData();
};

// 页码变化
const handleCurrentChange = (page: number) => {
	pagination.current = page;
	fetchData();
};

// 新增
const handleAdd = () => {
	addDialogRef.value?.openDialog();
};

// 刷新列表
const handleRefresh = () => {
	fetchData();
};

// 操作处理
const handleOperation = (data: any) => {
	const { action, row } = data;
	switch (action) {
		case 'detail':
			handleDetail(row);
			break;
		case 'edit':
			handleEdit(row);
			break;
		case 'delete':
			handleDelete(row);
			break;
	}
};

// 详情
const handleDetail = (row: ParkingEnterprisePackageVO) => {
	detailDialogRef.value?.openDialog(row.id, row);
};

// 编辑
const handleEdit = (row: ParkingEnterprisePackageVO) => {
	addDialogRef.value?.openDialog(row.id, row);
};

// 删除
const handleDelete = async (row: ParkingEnterprisePackageVO) => {
	try {
		await useMessageBox().confirm('确定要删除该企业车位包吗？');
		const res = await deleteEnterprisePackage([row.id!]);
		if (res.code === 0) {
			useMessage().success('删除成功');
			fetchData();
		} else {
			useMessage().error(res.msg || '删除失败');
		}
	} catch (err: any) {
		if (err !== 'cancel') {
			useMessage().error(err.msg || '删除失败');
		}
	}
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
