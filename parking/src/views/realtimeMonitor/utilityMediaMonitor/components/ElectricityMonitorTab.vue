<template>
	<UtilityMonitorTabPanel :metrics="metrics" :trend="trend" :phase-chart="phaseChart" :diagram="diagram" :table="table" />
	<UtilityMeterDetailDialog v-model="detailVisible" :row="currentDetailRow" />
</template>

<script setup lang="ts" name="ElectricityMonitorTab">
import { computed, ref } from 'vue';
import { useThemeImage } from '/@/utils/themeImages';
import UtilityMonitorTabPanel from './UtilityMonitorTabPanel.vue';
import UtilityMeterDetailDialog from './UtilityMeterDetailDialog.vue';
import type { DiagramConfig, MetricCardItem, PhaseChartConfig, TableColumnConfig, TableConfig, TrendChartConfig, UtilityMonitorMeterRow } from './types';
import { formatMonitorDecimalValue, formatPercentMetricValue, mapMeterPageRecord, parseMonitorNumber, useUtilityMonitorData } from './useUtilityMonitorData';

const realTimePowerImage = useThemeImage('realTimePower');
const cumulativeElectricityConsumptionImage = useThemeImage('cumulativeElectricityConsumption');
const powerFactorImage = useThemeImage('powerFactor');
const loadRateImage = useThemeImage('loadRate');
const { overviewData, meterPageData, tableLoading, handlePageChange, handlePageSizeChange } = useUtilityMonitorData('elec');

const metrics = computed<MetricCardItem[]>(() => [
	{ key: 'real-time-power', label: '实时功率', value: formatMonitorDecimalValue(overviewData.value?.power), unit: 'kW', icon: realTimePowerImage.value },
	{ key: 'today-electricity', label: '今日用电', value: formatMonitorDecimalValue(overviewData.value?.todayElec), unit: 'kWh', icon: cumulativeElectricityConsumptionImage.value },
	{ key: 'power-factor', label: '功率因数', value: formatMonitorDecimalValue(overviewData.value?.powerFactor), unit: '', icon: powerFactorImage.value },
	{ key: 'load-rate', label: '负载率', value: formatPercentMetricValue(overviewData.value?.loadRate, 2), unit: '%', icon: loadRateImage.value },
]);

const trend = computed<TrendChartConfig>(() => ({
	title: '24小时负荷曲线',
	unit: 'kW',
	yAxisName: '电力负荷(kW)',
	xAxis: overviewData.value?.energyTrend.map((item) => item.statPeriod) ?? [],
	series: [
		{
			name: '功率值',
			data: overviewData.value?.energyTrend.map((item) => parseMonitorNumber(item.realtimePower)) ?? [],
		},
	],
	decimals: 2,
}));

const phaseChart = computed<PhaseChartConfig>(() => ({
	title: '三相平衡',
	yAxisName: '电流(A)',
	mode: 'single',
	singleSeriesName: '电流值',
	lastPeriodData: [0, 0, 0],
	currentData: [
		parseMonitorNumber(overviewData.value?.phaseACurrent),
		parseMonitorNumber(overviewData.value?.phaseBCurrent),
		parseMonitorNumber(overviewData.value?.phaseCCurrent),
	],
	xAxisData: ['A相', 'B相', 'C相'],
	decimals: 2,
}));

const diagram: DiagramConfig = {
	title: '配电系统组态',
	badge: '组态区域占位',
	hint: '配电系统组态开发中，已预留该区块布局与交互位。',
	mode: 'generic',
};

const detailVisible = ref(false);
const currentDetailRow = ref<UtilityMonitorMeterRow | null>(null);

const handleViewDetail = (_action: string, row: UtilityMonitorMeterRow) => {
	currentDetailRow.value = row;
	detailVisible.value = true;
};

const columns: TableColumnConfig[] = [
	{ key: 'name', label: '电表名称', minWidth: 150 },
	{ key: 'location', label: '安装位置', minWidth: 180 },
	{ key: 'voltage', label: '电压(V)', minWidth: 110, tooltip: false },
	{ key: 'current', label: '电流(A)', minWidth: 110, tooltip: false },
	{ key: 'power', label: '功率(kW)', minWidth: 110, tooltip: false },
	{ key: 'energy', label: '累计电量(kWh)', minWidth: 140, tooltip: false },
	{ key: 'status', label: '状态', width: 90, type: 'status', tooltip: false },
	{ key: 'actions', label: '操作', width: 100, fixed: 'right', type: 'actions', tooltip: false },
];

const table = computed<TableConfig>(() => ({
	title: '表具监控-电表监控',
	columns,
	actions: ['查看'],
	rows: meterPageData.value.list.map((item) => mapMeterPageRecord(item)),
	loading: tableLoading.value,
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
