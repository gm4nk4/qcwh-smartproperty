<template>
	<UtilityMonitorTabPanel :metrics="metrics" :trend="trend" :distribution="distribution" :table="table" />
	<UtilityMeterDetailDialog v-model="detailVisible" :row="currentDetailRow" />
</template>

<script setup lang="ts" name="GasMonitorTab">
import { computed, ref } from 'vue';
import { useThemeImage } from '/@/utils/themeImages';
import UtilityMonitorTabPanel from './UtilityMonitorTabPanel.vue';
import UtilityMeterDetailDialog from './UtilityMeterDetailDialog.vue';
import type { DistributionConfig, MetricCardItem, TableColumnConfig, TableConfig, TrendChartConfig, UtilityMonitorMeterRow } from './types';
import { formatMonitorDecimalValue, formatMonitorValue, mapMeterPageRecord, parseMonitorNumber, useUtilityMonitorData } from './useUtilityMonitorData';

const gasRealTimeFlowImage = useThemeImage('gasRealTimeFlow');
const gasUsageImage = useThemeImage('gasUsage');
const pipelinePressureImage = useThemeImage('pipelinePressure');
const safetyStatusImage = useThemeImage('safetyStatus');
const { overviewData, meterPageData, tableLoading, reloadAll, handlePageChange, handlePageSizeChange } = useUtilityMonitorData('gas');

const distributionPalette = ['#1DC8F5', '#FF9F1C', '#F3C84C', '#2D7AF8', '#B46AF3'];

const metrics = computed<MetricCardItem[]>(() => [
	{ key: 'gas-flow', label: '实时流量', value: formatMonitorDecimalValue(overviewData.value?.realtimeFlow), unit: 'm³/h', icon: gasRealTimeFlowImage.value },
	{ key: 'today-gas', label: '今日用气', value: formatMonitorDecimalValue(overviewData.value?.todayGas), unit: 'm³', icon: gasUsageImage.value },
	{ key: 'pipe-pressure', label: '管道压力', value: formatMonitorDecimalValue(overviewData.value?.pipePressure), unit: 'MPa', icon: pipelinePressureImage.value },
	{
		key: 'safety-status',
		label: '安全状态',
		value: formatMonitorValue(overviewData.value?.safetyStatus),
		unit: '',
		icon: safetyStatusImage.value,
		valueTone: overviewData.value?.safetyStatus?.includes('正常') ? 'success' : 'warning',
	},
]);

const trend = computed<TrendChartConfig>(() => ({
	title: '24小时用气曲线',
	unit: 'm³',
	yAxisName: '用气量(m³)',
	xAxis: overviewData.value?.energyTrend.map((item) => item.statPeriod) ?? [],
	series: [
		{
			name: '用气量',
			data: overviewData.value?.energyTrend.map((item) => parseMonitorNumber(item.gasCons)) ?? [],
		},
	],
	decimals: 2,
}));

const distribution = computed<DistributionConfig>(() => ({
	title: '分区用气分布',
	centerLabel: '用气分布',
	unit: 'm³',
	items:
		overviewData.value?.spaceRankList.map((item, index) => ({
			name: item.spaceCode,
			value: parseMonitorNumber(item.zoneGas),
			color: distributionPalette[index % distributionPalette.length],
	})) ?? [],
}));

const detailVisible = ref(false);
const currentDetailRow = ref<UtilityMonitorMeterRow | null>(null);

const handleViewDetail = (_action: string, row: UtilityMonitorMeterRow) => {
	currentDetailRow.value = row;
	detailVisible.value = true;
};

const columns: TableColumnConfig[] = [
	{ key: 'name', label: '燃气表名称', minWidth: 170 },
	{ key: 'location', label: '安装位置', minWidth: 180 },
	{ key: 'instantFlow', label: '瞬时流量(m³/h)', minWidth: 130, tooltip: false },
	{ key: 'pressure', label: '压力(MPa)', minWidth: 110, tooltip: false },
	{ key: 'cumulativeReading', label: '累计读数(m³)', minWidth: 140, tooltip: false },
	{ key: 'status', label: '状态', width: 90, type: 'status', tooltip: false },
	{ key: 'actions', label: '操作', width: 100, fixed: 'right', type: 'actions', tooltip: false },
];

const table = computed<TableConfig>(() => ({
	title: '表具监控-燃气表监控',
	columns,
	actions: ['查看'],
	rows: meterPageData.value.list.map((item) => mapMeterPageRecord(item)),
	loading: tableLoading.value,
	headerAction: { label: '刷新数据', icon: 'refresh', loading: tableLoading.value, onClick: reloadAll },
	pagination: {
		total: meterPageData.value.total,
		pageNum: meterPageData.value.pageNum,
		pageSize: meterPageData.value.pageSize,
	},
	onActionClick: handleViewDetail,
	onPageChange: handlePageChange,
	onPageSizeChange: handlePageSizeChange,
}));
</script>
