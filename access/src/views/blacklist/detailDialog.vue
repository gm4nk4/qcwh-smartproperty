<template>
	<el-dialog v-model="dialogVisible" title="黑名单详情" width="600px" custom-class="blacklist-detail-dialog">
		<div class="detail-container">
			<!-- 车辆信息卡片 -->
			<div class="vehicle-card">
				<div class="vehicle-card__icon">
					<el-icon :size="36" color="#f56c6c"><WarningFilled /></el-icon>
				</div>
				<div class="vehicle-card__info">
					<div class="vehicle-card__plate">{{ recordData?.plateNumber || '-' }}</div>
					<div class="vehicle-card__detail">{{ recordData?.vehicleDetail || '-' }}</div>
				</div>
				<div class="vehicle-card__status">
					<span class="status-tag" :class="getStatusClass(recordData?.status)">{{ recordData?.status || '-' }}</span>
				</div>
			</div>

			<!-- 详情列表 -->
			<div class="detail-list">
				<div class="detail-item">
					<span class="detail-item__label">拉黑原因</span>
					<span class="detail-item__value">{{ recordData?.reason || '-' }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-item__label">来源</span>
					<span class="detail-item__value">{{ recordData?.source || '-' }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-item__label">操作人</span>
					<span class="detail-item__value">{{ recordData?.operator || '-' }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-item__label">拉黑时间</span>
					<span class="detail-item__value">{{ recordData?.blacklistTime || '-' }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-item__label">到期时间</span>
					<span class="detail-item__value">{{ recordData?.expireDate || '-' }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-item__label">违规次数</span>
					<span class="detail-item__value">{{ recordData?.violations ? `${recordData.violations}次` : '-' }}</span>
				</div>
				<div class="detail-item">
					<span class="detail-item__label">备注</span>
					<span class="detail-item__value">{{ recordData?.remark || '—' }}</span>
				</div>
			</div>
		</div>
		<template #footer>
			<el-button @click="handleCancel">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';

const dialogVisible = ref(false);
const recordData = ref<any>(null);

const openDialog = (id: string, rowData: any) => {
	dialogVisible.value = true;
	// 使用传入的数据
	recordData.value = {
		plateNumber: rowData?.plateNumber || '-',
		vehicleDetail: rowData?.vehicleInfo || '-',
		status: rowData?.status || '-',
		reason: rowData?.reason || '-',
		source: rowData?.source || '-',
		operator: rowData?.operator || '系统自动',
		blacklistTime: rowData?.blacklistTime || '-',
		expireDate: rowData?.expireDate || '-',
		violations: rowData?.violations || 0,
		remark: rowData?.remark || '',
	};
};

const getStatusClass = (status: string) => {
	const classMap: Record<string, string> = {
		生效中: 'active',
		已过期: 'expired',
		已解除: 'resolved',
	};
	return classMap[status] || 'active';
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
	gap: 16px;
}

.vehicle-card {
	display: flex;
	align-items: center;
	background: #ffebeb;
	border-radius: 12px;
	padding: 14px 16px;
}

.vehicle-card__icon {
	flex-shrink: 0;
	margin-right: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.vehicle-card__info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.vehicle-card__plate {
	font-size: 16px;
	font-weight: 600;
	color: #333333;
	line-height: 1.3;
}

.vehicle-card__detail {
	font-size: 13px;
	color: #999999;
	margin-top: 6px;
}

.vehicle-card__status {
	flex-shrink: 0;
}

.status-tag {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 600;
	border: 1px solid;
}

.status-tag.active {
	background: #ffebeb;
	color: #f56c6c;
	border-color: #f56c6c;
}

.status-tag.expired {
	background: #f4f4f5;
	color: #909399;
	border-color: #d3d4d6;
}

.status-tag.resolved {
	background: #e6f7e6;
	color: #52c41a;
	border-color: #b7eb8f;
}

.detail-list {
	display: flex;
	flex-direction: column;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	overflow: hidden;
}

.detail-item {
	display: flex;
	align-items: flex-start;
	min-height: 44px;
	border-bottom: 1px solid #ebeef5;

	&:last-child {
		border-bottom: none;
	}
}

.detail-item__label {
	flex-shrink: 0;
	width: 100px;
	padding: 12px 16px;
	background: #f7f9fc;
	font-size: 14px;
	font-weight: 500;
	color: #5f6c83;
	border-right: 1px solid #ebeef5;
}

.detail-item__value {
	flex: 1;
	padding: 12px 16px;
	font-size: 14px;
	color: #1f2d3d;
	word-break: break-all;
}
</style>