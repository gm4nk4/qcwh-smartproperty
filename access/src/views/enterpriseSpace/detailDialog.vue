<template>
	<el-dialog :close-on-click-modal="false" v-model="dialogVisible" title="企业车位包详情" width="800px" draggable>
		<div class="detail-container">
			<!-- 企业信息卡片 -->
			<div class="enterprise-card">
				<div class="enterprise-card__icon">
					<el-icon :size="36" color="#1677ff"><OfficeBuilding /></el-icon>
				</div>
				<div class="enterprise-card__info">
					<div class="enterprise-card__name">{{ recordData?.companyName || '-' }}</div>
					<div class="enterprise-card__contract">合同编号：{{ recordData?.contract || '-' }}</div>
				</div>
				<div class="enterprise-card__status">
					<span class="status-tag" :class="recordData?.status === '正常' ? 'normal' : 'pending'">{{ recordData?.status || '正常' }}</span>
				</div>
			</div>

			<!-- 基本信息 -->
			<section class="detail-section">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>基本信息</h4>
				</div>
				<el-descriptions :column="2" border>
					<el-descriptions-item label="联系人">{{ recordData?.contact || '--' }}</el-descriptions-item>
					<el-descriptions-item label="有效期">{{ recordData?.validPeriod || '--' }}</el-descriptions-item>
					<el-descriptions-item label="车位配额">{{ recordData?.usedQuota || 0 }}/{{ recordData?.totalQuota || 0 }}</el-descriptions-item>
					<el-descriptions-item label="当前月费">{{ recordData?.monthlyFee || '--' }}</el-descriptions-item>
					<el-descriptions-item label="计费规则" :span="2">{{ recordData?.priceRule || '--' }}</el-descriptions-item>
				</el-descriptions>
			</section>

			<!-- 详细数据 -->
			<section class="detail-section" style="height: 400px; overflow: auto">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>详细数据</h4>
				</div>
				<ConfigurableTableWithForm
					ref="tableRef"
					:table-config="tableConfig"
					:showColumnSettings="false"
					:showSearchToggle="false"
					:showExport="false"
					:showRefresh="false"
				/>
			</section>
		</div>
		<template #footer>
			<el-button @click="handleCancel">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { OfficeBuilding } from '@element-plus/icons-vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';

const dialogVisible = ref(false);
const recordData = ref<any>(null);
const tableRef = ref();

// 查询表单配置 - 无筛选项
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [],
	fieldOptions: {},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', align: 'center' },
	{ prop: 'priceTier', label: '所属计费档', align: 'center' },
	{ prop: 'monthlyFee', label: '月费', align: 'center' },
];

// 表格数据
const tableData = ref([
	{
		id: 1,
		plateNumber: '京A-88888',
		priceTier: '第1档 (1~5个车位)',
		monthlyFee: '¥400',
	},
	{
		id: 2,
		plateNumber: '京B-66666',
		priceTier: '第1档 (1~5个车位)',
		monthlyFee: '¥400',
	},
	{
		id: 3,
		plateNumber: '京G-33333',
		priceTier: '第1档 (1~5个车位)',
		monthlyFee: '¥400',
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

const openDialog = (id: string, rowData: any) => {
	dialogVisible.value = true;
	// 使用传入的数据
	recordData.value = {
		companyName: rowData?.companyName || '星辰传媒有限公司',
		contract: rowData?.contract || 'CT-2025-008',
		status: rowData?.status || '正常',
		contact: rowData?.contact || '陈总 138****5678',
		validPeriod: rowData?.validPeriod || '2025-01-01~2025-12-31',
		usedQuota: rowData?.usedQuota || 3,
		totalQuota: rowData?.totalQuota || 8,
		monthlyFee: rowData?.monthlyFee || '¥3800',
		priceRule: rowData?.priceRule || '1~5个: 400元/月 · 第6个起: 600元/月',
	};
};

const handleCancel = () => {
	dialogVisible.value = false;
};

defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.detail-container {
	display: flex;
	flex-direction: column;
	gap: 18px;
	max-height: 68vh;
	padding-right: 4px;
	overflow-y: auto;
}

.enterprise-card {
	display: flex;
	align-items: center;
	background: #eaf4ff;
	border-radius: 16px;
	padding: 16px 24px;
	min-height: 80px;
}

.enterprise-card__icon {
	flex-shrink: 0;
	margin-right: 16px;
}

.enterprise-card__info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.enterprise-card__name {
	font-size: 18px;
	font-weight: 600;
	color: #333333;
	line-height: 1.2;
}

.enterprise-card__contract {
	font-size: 14px;
	color: #999999;
	margin-top: 6px;
}

.enterprise-card__status {
	flex-shrink: 0;
}

.status-tag {
	display: inline-block;
	padding: 8px 16px;
	border-radius: 8px;
	font-size: 14px;
	background: #e6f7e6;
	color: #52c41a;
}

.status-tag.pending {
	background: #fff7e6;
	color: #faad14;
}

.detail-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.detail-section__header {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.detail-section__bar {
	width: 4px;
	height: 18px;
	border-radius: 999px;
	background: #1677ff;
}

.detail-section__header h4 {
	margin: 0;
	font-size: 15px;
	font-weight: 700;
	color: var(--theme-text-system);
}

:deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
	width: 100px;
	font-weight: 600;
	color: #5f6c83;
	background: #f7f9fc;
}

:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
	color: #1f2d3d;
}

:deep(.mb20) {
	margin-bottom: 0 !important;
}
</style>
