<template>
	<UtilityMonitorTabPanel :metrics="metrics" :trend="trend" :bar-distribution="barDistribution" :table="table" />
	<UtilityMeterDetailDialog v-model="detailVisible" :row="currentDetailRow" />
</template>

<script setup lang="ts" name="HeatMonitorTab">
import { computed, ref } from 'vue';
import { useThemeImage } from '/@/utils/themeImages';
import UtilityMonitorTabPanel from './UtilityMonitorTabPanel.vue';
import UtilityMeterDetailDialog from './UtilityMeterDetailDialog.vue';
import type { BarDistributionConfig, MetricCardItem, TableColumnConfig, TableConfig, TrendChartConfig, UtilityMonitorMeterRow } from './types';
import { formatMonitorDecimalValue, mapMeterPageRecord, parseMonitorNumber, useUtilityMonitorData } from './useUtilityMonitorData';

const heatSupplyImage = useThemeImage('heatSupply');
const todayHeatImage = useThemeImage('todayHeat');
const supplyWaterTemperatureImage = useThemeImage('supplyWaterTemperature');
const returnWaterTemperatureImage = useThemeImage('returnWaterTemperature');
const { overviewData, meterPageData, tableLoading, reloadAll, handlePageChange, handlePageSizeChange } = useUtilityMonitorData('heat');

const metrics = computed<MetricCardItem[]>(() => [
	{ key: 'heat-supply', label: '供热量', value: formatMonitorDecimalValue(overviewData.value?.heatSupply), unit: 'GJ', icon: heatSupplyImage.value },
	{ key: 'today-heat', label: '今日热量', value: formatMonitorDecimalValue(overviewData.value?.todayHeat), unit: 'GJ', icon: todayHeatImage.value },
	{ key: 'supply-temp', label: '供水温度', value: formatMonitorDecimalValue(overviewData.value?.supplyTemp), unit: '°C', icon: supplyWaterTemperatureImage.value },
	{ key: 'return-temp', label: '回水温度', value: formatMonitorDecimalValue(overviewData.value?.returnTemp), unit: '°C', icon: returnWaterTemperatureImage.value },
]);

const trend = computed<TrendChartConfig>(() => ({
	title: '供回水温度曲线',
	unit: '°C',
	yAxisName: '温度(°C)',
	xAxis: overviewData.value?.energyTrend.map((item) => item.statPeriod) ?? [],
	series: [
		{
			name: '供水温度',
			color: '#3A8DFF',
			fillArea: true,
			areaOpacity: 0.22,
			data: overviewData.value?.energyTrend.map((item) => parseMonitorNumber(item.supplyTemp)) ?? [],
		},
		{
			name: '回水温度',
			color: '#FFB228',
			fillArea: true,
			areaOpacity: 0.18,
			data: overviewData.value?.energyTrend.map((item) => parseMonitorNumber(item.returnTemp)) ?? [],
		},
	],
	decimals: 2,
}));

const barDistribution = computed<BarDistributionConfig>(() => ({
	title: '分区供热分布',
	unit: 'GJ',
	yAxisName: '热量(GJ)',
	legendLabel: '热量值',
	items:
		overviewData.value?.spaceRankList.map((item) => ({
			name: item.spaceCode,
			value: parseMonitorNumber(item.zoneHeat),
			paletteIndex: 0,
	})) ?? [],
	decimals: 2,
}));

const detailVisible = ref(false);
const currentDetailRow = ref<UtilityMonitorMeterRow | null>(null);

const handleViewDetail = (_action: string, row: UtilityMonitorMeterRow) => {
	currentDetailRow.value = row;
	detailVisible.value = true;
};

const columns: TableColumnConfig[] = [
	{ key: 'name', label: '热量表名称', minWidth: 160 },
	{ key: 'location', label: '安装位置', minWidth: 180 },
	{ key: 'instantFlow', label: '瞬时流量(m³/h)', minWidth: 130, tooltip: false },
	{ key: 'supplyWaterTemp', label: '供水温度(°C)', minWidth: 130, tooltip: false },
	{ key: 'returnWaterTemp', label: '回水温度(°C)', minWidth: 130, tooltip: false },
	{ key: 'cumulativeHeat', label: '累计热量(GJ)', minWidth: 130, tooltip: false },
	{ key: 'status', label: '状态', width: 90, type: 'status', tooltip: false },
	{ key: 'actions', label: '操作', width: 100, fixed: 'right', type: 'actions', tooltip: false },
];

const table = computed<TableConfig>(() => ({
	title: '表具监控-热量表监控',
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
