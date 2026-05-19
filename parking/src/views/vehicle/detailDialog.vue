<template>
	<el-dialog v-model="dialogVisible" title="车辆详情" width="800px" custom-class="vehicle-detail-dialog" v-loading="loading">
		<div class="detail-container">
			<!-- 车辆信息卡片 -->
			<div class="vehicle-card">
				<div class="vehicle-card__icon">
					<el-icon :size="36" color="#1677ff"><Van /></el-icon>
				</div>
				<div class="vehicle-card__info">
					<div class="vehicle-card__plate">{{ detailData?.plateNumber || '-' }}</div>
					<div class="vehicle-card__detail">{{ detailData?.vehicleBrand || '-' }} {{ detailData?.color ? '·' + detailData?.color : '' }}</div>
				</div>
				<div class="vehicle-card__status">
					<span class="status-tag" :class="getStatusClass(detailData?.status)">{{ getStatusText(detailData?.status) }}</span>
				</div>
			</div>

			<!-- 基本信息 -->
			<section class="detail-section">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="归属">{{ getBelongTypeText(detailData?.belongType) }}</el-descriptions-item>
					<el-descriptions-item label="联系人">{{ detailData?.contactPerson || '--' }} {{ detailData?.contactPhone ? ' ' + detailData?.contactPhone : '' }}</el-descriptions-item>
					<el-descriptions-item label="车位">{{ detailData?.parkingSpaceCode || '--' }}</el-descriptions-item>
					<el-descriptions-item label="月租费">{{ detailData?.monthlyFee ? '¥' + detailData?.monthlyFee + '/月' : '--' }}</el-descriptions-item>
					<el-descriptions-item label="起始日期">{{ detailData?.startDate || '--' }}</el-descriptions-item>
					<el-descriptions-item label="到期日期">{{ detailData?.expireDate || '--' }}</el-descriptions-item>
					<el-descriptions-item label="类型">{{ getTypeText(detailData?.type) }}</el-descriptions-item>
					<el-descriptions-item label="所属企业">{{ detailData?.enterpriseName || '--' }}</el-descriptions-item>
					<el-descriptions-item label="创建时间">{{ detailData?.createTime || '--' }}</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ detailData?.updateTime || '--' }}</el-descriptions-item>
				</el-descriptions>
			</section>
		</div>
		<template #footer>
			<el-button @click="handleCancel">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { Van } from '@element-plus/icons-vue';
import { getVehicleDetails } from '/@/api/vehicle';
import type { Vehicle } from '/@/api/vehicle/type';

const dialogVisible = ref(false);
const loading = ref(false);
const detailData = ref<Vehicle | null>(null);

// 类型映射
const typeMap: Record<string, string> = {
	'monthly': '月租',
	'temporary': '临时',
};

// 归属映射
const belongTypeMap: Record<string, string> = {
	'enterprise': '企业',
	'owner': '业主',
};

// 状态映射
const statusMap: Record<string, { text: string; class: string }> = {
	'normal': { text: '正常', class: 'normal' },
	'soon': { text: '即将到期', class: 'warning' },
	'expired': { text: '已过期', class: 'danger' },
};

// 获取类型文字
const getTypeText = (type: string | undefined) => {
	return typeMap[type || ''] || type || '--';
};

// 获取归属文字
const getBelongTypeText = (belongType: string | undefined) => {
	return belongTypeMap[belongType || ''] || belongType || '--';
};

// 获取状态文字
const getStatusText = (status: string | undefined) => {
	return statusMap[status || '']?.text || status || '--';
};

// 获取状态样式类
const getStatusClass = (status: string | undefined) => {
	return statusMap[status || '']?.class || 'normal';
};

const openDialog = async (id: number, rowData: Vehicle) => {
	dialogVisible.value = true;
	loading.value = true;

	try {
		const res = await getVehicleDetails(id);
		if (res.code === 0 && res.data) {
			detailData.value = res.data;
		} else {
			// 如果接口失败，使用传入的数据
			detailData.value = rowData;
		}
	} catch (err) {
		console.error('获取车辆详情失败', err);
		// 使用传入的数据
		detailData.value = rowData;
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

.vehicle-card {
	display: flex;
	align-items: center;
	background: #eaf4ff;
	border-radius: 16px;
	padding: 10px;
	min-height: 60px;
}

.vehicle-card__icon {
	flex-shrink: 0;
	margin-right: 16px;
}

.vehicle-card__info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.vehicle-card__plate {
	font-size: 14px;
	font-weight: 600;
	color: #333333;
	line-height: 1.2;
}

.vehicle-card__detail {
	font-size: 14px;
	color: #999999;
	margin-top: 8px;
}

.vehicle-card__status {
	flex-shrink: 0;
}

.status-tag {
	display: inline-block;
	height: 20;
	border-radius: 8px;
	font-size: 12px;
	padding: 4px 12px;
	background: #e6f7e6;
	color: #52c41a;
}

.status-tag.warning {
	background: #fff7e6;
	color: #faad14;
}

.status-tag.danger {
	background: #fff2f0;
	color: #ff4d4f;
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
</style>