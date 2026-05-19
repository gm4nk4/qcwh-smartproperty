<template>
	<el-dialog
		v-model="visible"
		:title="dialogTitle"
		width="760px"
		append-to-body
		destroy-on-close
		class="itemized-system-detail-dialog"
	>
		<div v-loading="loading" class="itemized-system-detail">
			<section class="detail-section">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>基础信息</h4>
				</div>
				<el-descriptions :column="2" border>
					<el-descriptions-item label="设备名称">{{ formatDisplay(detail?.deviceName) }}</el-descriptions-item>
					<el-descriptions-item label="监控类型">{{ monitorTypeLabel }}</el-descriptions-item>
					<el-descriptions-item label="设备类型">{{ formatDisplay(detail?.deviceType) }}</el-descriptions-item>
					<el-descriptions-item label="安装位置">{{ formatDisplay(detail?.installLoc) }}</el-descriptions-item>
					<el-descriptions-item label="运行状态">
						<el-tag class="detail-status-tag" :class="statusClass">
							{{ formatDisplay(detail?.runStatusName) }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="设备ID">{{ formatDisplay(detail?.id) }}</el-descriptions-item>
				</el-descriptions>
			</section>

			<section class="detail-section">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>监测数据</h4>
				</div>
				<el-descriptions :column="2" border>
					<el-descriptions-item v-for="item in detailFields" :key="item.key" :label="item.label">
						{{ formatValue(item.key) }}
					</el-descriptions-item>
				</el-descriptions>
			</section>
		</div>

		<template #footer>
			<el-button @click="visible = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="ItemizedSystemDetailDialog">
import { computed } from 'vue';
import type { ItemizedMonitorDetailRecord, ItemizedMonitorType } from '/@/api/energy/itemizedSystemMonitor';

type DetailFieldKey = keyof Pick<
	ItemizedMonitorDetailRecord,
	'power' | 'todayElec' | 'loadRate' | 'supplyTemp' | 'returnTemp' | 'copValue' | 'voltage' | 'current' | 'todayRunCount' | 'currentFloor' | 'efficiency'
>;

type DetailField = {
	label: string;
	key: DetailFieldKey;
	unit?: string;
	digits?: number;
};

const props = defineProps<{
	modelValue: boolean;
	loading?: boolean;
	monitorType: ItemizedMonitorType;
	detail: ItemizedMonitorDetailRecord | null;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const monitorTypeLabelMap: Record<ItemizedMonitorType, string> = {
	cooling: '制冷系统',
	lighting: '照明系统',
	elevator: '电梯系统',
	power: '动力系统',
};

const detailFieldMap: Record<ItemizedMonitorType, DetailField[]> = {
	cooling: [
		{ label: '负载率', key: 'loadRate', unit: '%', digits: 2 },
		{ label: '供水温度', key: 'supplyTemp', unit: '°C', digits: 1 },
		{ label: '回水温度', key: 'returnTemp', unit: '°C', digits: 1 },
		{ label: 'COP值', key: 'copValue', digits: 2 },
		{ label: '功率', key: 'power', unit: 'kW', digits: 1 },
		{ label: '今日用电', key: 'todayElec', unit: 'kWh', digits: 1 },
	],
	lighting: [
		{ label: '功率', key: 'power', unit: 'kW', digits: 1 },
		{ label: '电压', key: 'voltage', unit: 'V', digits: 0 },
		{ label: '电流', key: 'current', unit: 'A', digits: 1 },
		{ label: '今日用电', key: 'todayElec', unit: 'kWh', digits: 1 },
	],
	elevator: [
		{ label: '当前楼层', key: 'currentFloor' },
		{ label: '今日运行次数', key: 'todayRunCount', unit: '次', digits: 0 },
		{ label: '功率', key: 'power', unit: 'kW', digits: 1 },
		{ label: '今日用电', key: 'todayElec', unit: 'kWh', digits: 1 },
	],
	power: [
		{ label: '功率', key: 'power', unit: 'kW', digits: 1 },
		{ label: '效率', key: 'efficiency', unit: '%', digits: 2 },
		{ label: '今日用电', key: 'todayElec', unit: 'kWh', digits: 1 },
	],
};

const visible = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit('update:modelValue', value),
});

const monitorTypeLabel = computed(() => monitorTypeLabelMap[props.monitorType] || '--');
const dialogTitle = computed(() => `${monitorTypeLabel.value}设备详情`);
const detailFields = computed(() => detailFieldMap[props.monitorType] || []);

const statusClass = computed(() => {
	const statusName = String(props.detail?.runStatusName || '');
	if (statusName === '运行' || statusName === '开启') return 'detail-status-tag--running';
	if (statusName === '待机') return 'detail-status-tag--standby';
	if (statusName === '故障') return 'detail-status-tag--danger';
	return 'detail-status-tag--off';
});

const formatDisplay = (value: unknown) => {
	const text = String(value ?? '').trim();
	return text || '--';
};

const formatNumber = (value: number, digits = 0) =>
	new Intl.NumberFormat('zh-CN', {
		minimumFractionDigits: 0,
		maximumFractionDigits: digits,
	}).format(value);

const formatValue = (key: DetailFieldKey) => {
	const field = detailFields.value.find((item) => item.key === key);
	const value = props.detail?.[key];
	if (value === null || value === undefined || value === '') return '--';

	if (typeof value === 'number') {
		const text = formatNumber(value, field?.digits ?? 0);
		return field?.unit ? `${text} ${field.unit}` : text;
	}

	const text = String(value).trim();
	if (!text) return '--';
	return field?.unit ? `${text} ${field.unit}` : text;
};
</script>

<style scoped lang="scss">
.itemized-system-detail {
	display: flex;
	flex-direction: column;
	gap: 18px;
	max-height: 68vh;
	padding-right: 4px;
	overflow-y: auto;
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

:deep(.itemized-system-detail-dialog .el-dialog__body) {
	padding-top: 6px;
}

:deep(.itemized-system-detail .el-descriptions__label.el-descriptions__cell.is-bordered-label) {
	width: 120px;
	font-weight: 600;
	color: #5f6c83;
	background: #f7f9fc;
}

:deep(.itemized-system-detail .el-descriptions__content.el-descriptions__cell.is-bordered-content) {
	color: #1f2d3d;
}

:deep(.detail-status-tag) {
	--el-tag-border-width: 1px;
	height: 24px;
	padding: 0 8px;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 500;
	line-height: 22px;
	box-sizing: border-box;
}

:deep(.detail-status-tag.detail-status-tag--running) {
	--el-tag-text-color: #46b538;
	--el-tag-border-color: #46b538;
	--el-tag-bg-color: rgba(70, 181, 56, 0.05);
}

:deep(.detail-status-tag.detail-status-tag--standby) {
	--el-tag-text-color: #1677ff;
	--el-tag-border-color: #1677ff;
	--el-tag-bg-color: rgba(22, 119, 255, 0.05);
}

:deep(.detail-status-tag.detail-status-tag--danger) {
	--el-tag-text-color: #ef4444;
	--el-tag-border-color: #ef4444;
	--el-tag-bg-color: rgba(239, 68, 68, 0.05);
}

:deep(.detail-status-tag.detail-status-tag--off) {
	--el-tag-text-color: #6b7280;
	--el-tag-border-color: #6b7280;
	--el-tag-bg-color: rgba(107, 114, 128, 0.08);
}

@media screen and (max-width: 768px) {
	:deep(.itemized-system-detail-dialog) {
		width: calc(100vw - 24px) !important;
		margin-top: 6vh;
	}

	:deep(.itemized-system-detail .el-descriptions__label.el-descriptions__cell.is-bordered-label) {
		width: 98px;
	}
}
</style>
