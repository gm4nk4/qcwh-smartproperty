<template>
	<UtilityMonitorTabPanel :metrics="metrics" :trend="trend" :distribution="distribution" :diagram="diagram" :table="table" />
	<UtilityMeterDetailDialog v-model="detailVisible" :row="currentDetailRow" />
</template>

<script setup lang="ts" name="WaterMonitorTab">
import { computed, ref } from 'vue';
import { useThemeImage } from '/@/utils/themeImages';
import UtilityMonitorTabPanel from './UtilityMonitorTabPanel.vue';
import UtilityMeterDetailDialog from './UtilityMeterDetailDialog.vue';
import type { DiagramConfig, DistributionConfig, MetricCardItem, TableColumnConfig, TableConfig, TrendChartConfig, UtilityMonitorMeterRow } from './types';
import { formatMonitorDecimalValue, mapMeterPageRecord, parseMonitorNumber, useUtilityMonitorData } from './useUtilityMonitorData';

const waterRealTimeFlowImage = useThemeImage('waterRealTimeFlow');
const waterConsumptionImage = useThemeImage('waterConsumption');
const waterTankLevelImage = useThemeImage('waterTankLevel');
const leakageRateImage = useThemeImage('leakageRate');
const { overviewData, meterPageData, tableLoading, reloadAll, handlePageChange, handlePageSizeChange } = useUtilityMonitorData('water');

const distributionPalette = ['#1DC8F5', '#FF9F1C', '#F3C84C', '#2D7AF8', '#B46AF3'];

const metrics = computed<MetricCardItem[]>(() => [
	{ key: 'water-flow', label: '实时流量', value: formatMonitorDecimalValue(overviewData.value?.realtimeFlow), unit: 'm³/h', icon: waterRealTimeFlowImage.value },
	{ key: 'today-water', label: '今日用水', value: formatMonitorDecimalValue(overviewData.value?.todayWater), unit: 'm³', icon: waterConsumptionImage.value },
	{ key: 'pool-level', label: '水池液位', value: formatMonitorDecimalValue(overviewData.value?.poolLevel), unit: '%', icon: waterTankLevelImage.value },
	{ key: 'leakage-rate', label: '漏损率', value: formatMonitorDecimalValue(overviewData.value?.leakageRate), unit: '%', icon: leakageRateImage.value },
]);

const trend = computed<TrendChartConfig>(() => ({
	title: '24小时用水曲线',
	unit: 'm³',
	yAxisName: '用水量(m³)',
	xAxis: overviewData.value?.energyTrend.map((item) => item.statPeriod) ?? [],
	series: [
		{
			name: '用水量',
			data: overviewData.value?.energyTrend.map((item) => parseMonitorNumber(item.waterCons)) ?? [],
		},
	],
	decimals: 2,
}));

const distribution = computed<DistributionConfig>(() => ({
	title: '分区用水分布',
	centerLabel: '用水分布',
	unit: 'm³',
	items:
		overviewData.value?.spaceRankList.map((item, index) => ({
			name: item.spaceCode,
			value: parseMonitorNumber(item.zoneWater),
			color: distributionPalette[index % distributionPalette.length],
		})) ?? [],
}));

const diagram = computed<DiagramConfig>(() => {
	const scadaConfig = overviewData.value?.scadaConfig ?? {};
	return {
		title: '供水系统组态',
		badge: '供水系统组态占位',
		hint: '先预留泵房组态区域，后续接入供水线路、设备状态与缩放交互。',
		mode: 'water',
		summary: [
			{ label: '市政进水压力', value: formatMonitorDecimalValue(scadaConfig.municipalPressure as string), helper: '主管网运行稳定' },
			{
				label: '蓄水池液位',
				value: formatMonitorDecimalValue(scadaConfig.reservoirLevel as string, 2, formatMonitorDecimalValue(overviewData.value?.poolLevel)),
				helper: `当前蓄水量 ${formatMonitorDecimalValue(scadaConfig.reservoirStorage as string)}`,
			},
			{
				label: '高位水箱液位',
				value: formatMonitorDecimalValue(scadaConfig.tankLevel as string),
				helper: `当前蓄水量 ${formatMonitorDecimalValue(scadaConfig.tankStorage as string)}`,
			},
		],
	};
});

const detailVisible = ref(false);
const currentDetailRow = ref<UtilityMonitorMeterRow | null>(null);

const handleViewDetail = (_action: string, row: UtilityMonitorMeterRow) => {
	currentDetailRow.value = row;
	detailVisible.value = true;
};

const columns: TableColumnConfig[] = [
	{ key: 'name', label: '水表名称', minWidth: 150 },
	{ key: 'location', label: '安装位置', minWidth: 180 },
	{ key: 'instantFlow', label: '瞬时流量(m³/h)', minWidth: 130, tooltip: false },
	{ key: 'pressure', label: '压力(MPa)', minWidth: 110, tooltip: false },
	{ key: 'cumulativeReading', label: '累计读数(m³)', minWidth: 140, tooltip: false },
	{ key: 'status', label: '状态', width: 90, type: 'status', tooltip: false },
	{ key: 'actions', label: '操作', width: 100, fixed: 'right', type: 'actions', tooltip: false },
];

const table = computed<TableConfig>(() => ({
	title: '表具监控-水表监控',
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
