<template>
	<el-dialog
		v-model="visible"
		:title="dialogTitle"
		width="760px"
		append-to-body
		destroy-on-close
		class="utility-meter-detail-dialog"
	>
		<div v-if="row" class="utility-meter-detail">
			<section class="detail-section">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>基础信息</h4>
				</div>
				<el-descriptions :column="2" border>
					<el-descriptions-item label="表具名称">{{ formatDisplay(row.name) }}</el-descriptions-item>
					<el-descriptions-item label="表具类型">{{ monitorTypeLabel }}</el-descriptions-item>
					<el-descriptions-item label="安装位置">{{ formatDisplay(row.location) }}</el-descriptions-item>
					<el-descriptions-item label="当前状态">
						<el-tag class="meter-status-tag" :class="getMeterStatusClass(row.status)">
							{{ getMeterStatusText(row.status) }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ formatDisplay(row.updateTime) }}</el-descriptions-item>
					<el-descriptions-item label="更新人">{{ formatDisplay(row.updateBy) }}</el-descriptions-item>
				</el-descriptions>
			</section>

			<section class="detail-section">
				<div class="detail-section__header">
					<span class="detail-section__bar"></span>
					<h4>监测数据</h4>
				</div>
				<el-descriptions :column="2" border>
					<el-descriptions-item v-for="item in currentMetricFields" :key="item.key" :label="item.label">
						{{ formatDisplay(row[item.key] as string) }}
					</el-descriptions-item>
				</el-descriptions>
			</section>

		</div>

		<template #footer>
			<el-button @click="visible = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="UtilityMeterDetailDialog">
import { computed } from 'vue';
import type { MeterStatus, UtilityMonitorMeterRow } from './types';

type DetailField = {
	label: string;
	key: keyof UtilityMonitorMeterRow;
};

const props = defineProps<{
	modelValue: boolean;
	row: UtilityMonitorMeterRow | null;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const monitorTypeLabelMap: Record<UtilityMonitorMeterRow['monitorType'], string> = {
	elec: '电表',
	water: '水表',
	gas: '燃气表',
	heat: '热量表',
};

const metricFieldMap: Record<UtilityMonitorMeterRow['monitorType'], DetailField[]> = {
	elec: [
		{ label: '电压(V)', key: 'voltage' },
		{ label: '电流(A)', key: 'current' },
		{ label: '功率(kW)', key: 'power' },
		{ label: '累计电量(kWh)', key: 'energy' },
		{ label: '今日用电(kWh)', key: 'todayElec' },
		{ label: 'A相电流(A)', key: 'phaseACurrent' },
		{ label: 'B相电流(A)', key: 'phaseBCurrent' },
		{ label: 'C相电流(A)', key: 'phaseCCurrent' },
	],
	water: [
		{ label: '瞬时流量(m³/h)', key: 'instantFlow' },
		{ label: '压力(MPa)', key: 'pressure' },
		{ label: '累计读数(m³)', key: 'cumulativeReading' },
		{ label: '用水量(m³)', key: 'waterConsum' },
	],
	gas: [
		{ label: '瞬时流量(m³/h)', key: 'instantFlow' },
		{ label: '压力(MPa)', key: 'pressure' },
		{ label: '累计读数(m³)', key: 'cumulativeReading' },
		{ label: '用气量(m³)', key: 'gasConsum' },
	],
	heat: [
		{ label: '瞬时流量(m³/h)', key: 'instantFlow' },
		{ label: '压力(MPa)', key: 'pressure' },
		{ label: '供水温度(°C)', key: 'supplyWaterTemp' },
		{ label: '回水温度(°C)', key: 'returnWaterTemp' },
		{ label: '累计热量(GJ)', key: 'cumulativeHeat' },
	],
};

const visible = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit('update:modelValue', value),
});

const dialogTitle = computed(() => `${props.row ? monitorTypeLabelMap[props.row.monitorType] : '表具'}详情`);
const monitorTypeLabel = computed(() => (props.row ? monitorTypeLabelMap[props.row.monitorType] : '--'));
const currentMetricFields = computed(() => (props.row ? metricFieldMap[props.row.monitorType] : []));

const formatDisplay = (value?: string) => {
	const text = String(value ?? '').trim();
	return text || '--';
};

const getMeterStatusClass = (status: MeterStatus) => `meter-status-tag--${status}`;

const getMeterStatusText = (status: MeterStatus) => {
	if (status === 'normal') return '正常';
	if (status === 'notice') return '提醒';
	if (status === 'warning') return '警告';
	return '严重';
};
</script>

<style scoped lang="scss">
.utility-meter-detail {
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

:deep(.utility-meter-detail-dialog .el-dialog__body) {
	padding-top: 6px;
}

:deep(.utility-meter-detail .el-descriptions__label.el-descriptions__cell.is-bordered-label) {
	width: 120px;
	font-weight: 600;
	color: #5f6c83;
	background: #f7f9fc;
}

:deep(.utility-meter-detail .el-descriptions__content.el-descriptions__cell.is-bordered-content) {
	color: #1f2d3d;
}

:deep(.meter-status-tag) {
	--el-tag-border-width: 1px;
	height: 24px;
	padding: 0 8px;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 500;
	line-height: 22px;
	box-sizing: border-box;
}

:deep(.meter-status-tag.meter-status-tag--notice) {
	--el-tag-text-color: #1677ff;
	--el-tag-border-color: #1677ff;
	--el-tag-bg-color: rgba(22, 119, 255, 0.05);
}

:deep(.meter-status-tag.meter-status-tag--warning) {
	--el-tag-text-color: #f59e0b;
	--el-tag-border-color: #f59e0b;
	--el-tag-bg-color: rgba(245, 158, 11, 0.05);
}

:deep(.meter-status-tag.meter-status-tag--critical) {
	--el-tag-text-color: #ef4444;
	--el-tag-border-color: #ef4444;
	--el-tag-bg-color: rgba(239, 68, 68, 0.05);
}

:deep(.meter-status-tag.meter-status-tag--normal) {
	--el-tag-text-color: #46b538;
	--el-tag-border-color: #46b538;
	--el-tag-bg-color: rgba(70, 181, 56, 0.05);
}

@media screen and (max-width: 768px) {
	:deep(.utility-meter-detail-dialog) {
		width: calc(100vw - 24px) !important;
		margin-top: 6vh;
	}

	:deep(.utility-meter-detail .el-descriptions) {
		display: block;
	}
}
</style>
