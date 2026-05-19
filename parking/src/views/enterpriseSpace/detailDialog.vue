<template>
	<el-dialog :close-on-click-modal="false" v-model="dialogVisible" title="企业车位包详情" width="800px" draggable>
		<div class="detail-container" v-loading="loading">
			<!-- 企业信息卡片 -->
			<div class="enterprise-card">
				<div class="enterprise-card__icon">
					<el-icon :size="36" color="#1677ff"><OfficeBuilding /></el-icon>
				</div>
				<div class="enterprise-card__info">
					<div class="enterprise-card__name">{{ recordData?.enterpriseName || '-' }}</div>
					<div class="enterprise-card__contract">
						{{ recordData?.contactPerson ? `${recordData.contactPerson} ${recordData.contactPhone || ''}` : '--' }}
					</div>
				</div>
				<div class="enterprise-card__status">
					<span class="status-tag" :class="recordData?.status === 'normal' ? 'normal' : 'pending'">{{
						recordData?.status === 'normal' ? '正常' : recordData?.status || '待绑定车辆'
					}}</span>
				</div>
			</div>

			<!-- 基本信息 -->
			<section class="detail-section">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>基本信息</h4>
				</div>
				<el-descriptions :column="2" border>
					<el-descriptions-item label="合同编号">
						{{ recordData?.contractNo || '--' }}
					</el-descriptions-item>
					<el-descriptions-item label="车位配额" :span="2">{{ recordData?.spaceQuota || 0 }}</el-descriptions-item>
					<el-descriptions-item label="计费规则" :span="2">{{ recordData?.pricingRule || formatPriceRule() }}</el-descriptions-item>
					<el-descriptions-item label="当前月费" :span="2">
						{{ recordData?.currentMonthlyFee ? `¥${recordData.currentMonthlyFee}` : '¥0' }}
					</el-descriptions-item>
					<el-descriptions-item label="有效期" :span="2">{{ recordData?.validPeriod || '--' }}</el-descriptions-item>
				</el-descriptions>
			</section>

			<!-- 详细数据 -->
			<section class="detail-section" style="height: 400px; overflow: auto">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>绑定车辆列表</h4>
				</div>
				<ConfigurableTableWithForm
					ref="tableRef"
					:table-config="tableConfig"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:showColumnSettings="false"
					:showSearchToggle="false"
					:showExport="false"
					:showRefresh="false"
				>
					<!-- 车辆类型列插槽 -->
					<template #typeSlot="{ row }">
						<el-tag :type="row.type === 'monthly' ? 'primary' : 'info'" size="small">
							{{ row.type === 'monthly' ? '月租' : row.type === 'temporary' ? '临时' : row.type }}
						</el-tag>
					</template>

					<!-- 归属列插槽 -->
					<template #belongTypeSlot="{ row }">
						<el-tag :type="row.belongType === 'enterprise' ? 'warning' : 'success'" size="small">
							{{ row.belongType === 'enterprise' ? '企业' : row.belongType === 'owner' ? '业主' : row.belongType }}
						</el-tag>
					</template>
				</ConfigurableTableWithForm>
			</section>
		</div>
		<template #footer>
			<el-button @click="handleCancel">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { OfficeBuilding } from '@element-plus/icons-vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { getEnterprisePackageDetails } from '/@/api/enterpriseSpace';
import { getVehicleListByEnterpriseId } from '/@/api/vehicle';
import type { ParkingEnterprisePackageVO } from '/@/api/enterpriseSpace/type';
import type { EnterpriseVehicleDetail } from '/@/api/vehicle/type';
import { useMessage } from '/@/hooks/message';

const dialogVisible = ref(false);
const loading = ref(false);
const vehicleLoading = ref(false);
const recordData = ref<ParkingEnterprisePackageVO | null>(null);
const tableRef = ref();

// 绑定车辆列表数据
const vehicleList = ref<EnterpriseVehicleDetail[]>([]);
const vehicleTotal = ref(0);
const vehicleCurrent = ref(1);
const vehicleSize = ref(10);

// 查询表单配置 - 无筛选项
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [],
	fieldOptions: {},
}));

// 表格列配置
const tableColumns: TableColumn[] = [
	{ prop: 'seqNo', label: '序号', align: 'center', width: 80 },
	{ prop: 'plateNumber', label: '车牌号', align: 'center' },
	{ prop: 'pricingTier', label: '所属计费档', align: 'center' },
	{ prop: 'monthlyFee', label: '月费', align: 'center' },
];

// 表格配置
const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: vehicleList.value,
	selectionType: 'none',
	showIndex: false,
	loading: vehicleLoading.value,
	pagination: true,
	pageSize: vehicleSize.value,
	currentPage: vehicleCurrent.value,
	total: vehicleTotal.value,
	showOperations: false,
}));

// 格式化计费规则
const formatPriceRule = () => {
	if (!recordData.value) return '--';
	const { baseSpaces, basePrice, overPrice } = recordData.value;
	if (!baseSpaces || !basePrice) return '--';
	const baseRule = `1~${baseSpaces}个: ${basePrice}元/月`;
	const overRule = overPrice ? ` . 第${baseSpaces + 1}个起: ${overPrice}元/月` : '';
	return baseRule + overRule;
};

// 分页大小变化
const handleSizeChange = (size: number) => {
	vehicleSize.value = size;
	vehicleCurrent.value = 1;
	fetchVehicleList(recordData.value?.id || 0);
};

// 页码变化
const handleCurrentChange = (page: number) => {
	vehicleCurrent.value = page;
	fetchVehicleList(recordData.value?.id || 0);
};

// 获取绑定车辆列表
const fetchVehicleList = async (enterpriseId: number) => {
	vehicleLoading.value = true;
	try {
		const res = await getVehicleListByEnterpriseId(enterpriseId, {
			current: vehicleCurrent.value,
			size: vehicleSize.value,
		});
		if (res.code === 0 && res.data) {
			vehicleList.value = res.data.records || [];
			vehicleTotal.value = res.data.total || 0;
		}
	} catch (err) {
		console.error('获取车辆列表失败', err);
	} finally {
		vehicleLoading.value = false;
	}
};

// 打开弹窗并获取详情数据
const openDialog = async (id: number, rowData?: ParkingEnterprisePackageVO) => {
	dialogVisible.value = true;
	loading.value = true;
	vehicleCurrent.value = 1;

	// 先用传入的数据展示
	if (rowData) {
		recordData.value = rowData;
	}

	try {
		// 调用API获取详情数据
		const res = await getEnterprisePackageDetails(id);
		if (res.code === 0 && res.data) {
			recordData.value = res.data;
			// 获取绑定车辆列表
			if (res.data.id) {
				await fetchVehicleList(res.data.id);
			}
		} else {
			useMessage().error(res.msg || '获取详情失败');
		}
	} catch (err: any) {
		useMessage().error(err.msg || '获取详情失败');
	} finally {
		loading.value = false;
	}
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
