<template>
	<el-dialog v-model="dialogVisible" title="车辆详情" width="800px" custom-class="vehicle-detail-dialog">
		<div class="detail-container">
			<!-- 车辆信息卡片 -->
			<div class="vehicle-card">
				<div class="vehicle-card__icon">
					<el-icon :size="36" color="#1677ff"><Van /></el-icon>
				</div>
				<div class="vehicle-card__info">
					<div class="vehicle-card__plate">{{ recordData?.plateNumber || '-' }}</div>
					<div class="vehicle-card__detail">{{ recordData?.vehicleDetail || '-' }}</div>
				</div>
				<div class="vehicle-card__status">
					<span class="status-tag" :class="recordData?.statusClass || 'normal'">{{ recordData?.status || '正常' }}</span>
				</div>
			</div>

			<!-- 基本信息 -->
			<section class="detail-section">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="归属">{{ recordData?.belong || '--' }}</el-descriptions-item>
					<el-descriptions-item label="联系人">{{ recordData?.contact || '--' }}</el-descriptions-item>
					<el-descriptions-item label="车位">{{ recordData?.parkingSpace || '--' }}</el-descriptions-item>
					<el-descriptions-item label="月租费">{{ recordData?.monthlyFee || '--' }}</el-descriptions-item>
					<el-descriptions-item label="有效期">{{ recordData?.validPeriod || '--' }}</el-descriptions-item>
					<el-descriptions-item label="最近进场">{{ recordData?.lastEntry || '--' }}</el-descriptions-item>
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

const dialogVisible = ref(false);
const recordData = ref<any>(null);

const openDialog = (id: string, rowData: any) => {
	dialogVisible.value = true;
	// 使用 mock 数据
	recordData.value = {
		plateNumber: '京A·888888',
		vehicleDetail: '宝马 5系·黑色',
		status: '正常',
		statusClass: 'normal',
		belong: '企业 · 星辰传媒有限公司',
		contact: '陈总 138****5678',
		parkingSpace: 'A区 A-015',
		monthlyFee: '¥500/月',
		validPeriod: '2025-06-01 ~ 2026-05-31',
		lastEntry: '2026-03-03 08:35',
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
