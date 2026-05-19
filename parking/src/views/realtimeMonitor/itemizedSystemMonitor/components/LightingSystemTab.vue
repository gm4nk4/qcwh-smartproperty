<template>
	<ItemizedSystemPanel :metrics="metrics" :trend="trend" :secondary-chart="secondaryChart" :table="table" />
	<ItemizedSystemDetailDialog
		v-model="detailVisible"
		:loading="detailLoading"
		:monitor-type="'lighting'"
		:detail="detailRecord"
	/>
</template>

<script setup lang="ts" name="LightingSystemTab">
import { computed, ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useThemeImage } from '/@/utils/themeImages';
import { getItemizedSystemMonitorDetail, type ItemizedMonitorDetailRecord } from '/@/api/energy/itemizedSystemMonitor';
import ItemizedSystemPanel from './ItemizedSystemPanel.vue';
import ItemizedSystemDetailDialog from './ItemizedSystemDetailDialog.vue';
import type { ItemizedTableRow, MetricCardItem, PieSecondaryChartConfig, TableConfig, TableColumnConfig, TrendChartConfig } from './types';
import { useItemizedSystemMonitorMockData } from './useItemizedSystemMonitorMockData';

const onlineCircuitsImage = useThemeImage('onlineCircuits');
const lightingRealTimePowerImage = useThemeImage('lightingRealTimePower');
const cumulativeElectricityConsumptionImage = useThemeImage('cumulativeElectricityConsumption');
const energySavingRateImage = useThemeImage('energySavingRate');

const message = useMessage();
const { overviewData, pageData, overviewLoading, tableLoading, reloadAll, handlePageChange, handlePageSizeChange } =
	useItemizedSystemMonitorMockData('lighting');
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailRecord = ref<ItemizedMonitorDetailRecord | null>(null);

const refreshing = computed(() => overviewLoading.value || tableLoading.value);

const distributionPalette = ['#1DC8F5', '#FF9F1C', '#F3C84C', '#2D7AF8', '#B46AF3'];

const formatNumber = (value: number, digits = 0) =>
	new Intl.NumberFormat('zh-CN', {
		minimumFractionDigits: 0,
		maximumFractionDigits: digits,
	}).format(value);

const tableRows = computed<ItemizedTableRow[]>(() =>
	pageData.value.list.map((item) => ({
		id: String(item.id),
		circuitName: item.circuitName,
		location: item.location,
		runStatusName: item.runStatusName,
		power: item.power,
		voltage: item.voltage,
		current: item.current,
		todayElec: item.todayElec,
	}))
);

const columns: TableColumnConfig[] = [
	{ key: 'circuitName', label: '回路名称', minWidth: 170 },
	{ key: 'location', label: '位置', minWidth: 170 },
	{ key: 'runStatusName', label: '运行状态', width: 100, type: 'status', tooltip: false },
	{ key: 'power', label: '功率(kW)', minWidth: 110, tooltip: false, formatter: (row) => formatNumber(Number(row.power), 1) },
	{ key: 'voltage', label: '电压(V)', minWidth: 110, tooltip: false, formatter: (row) => formatNumber(Number(row.voltage), 0) },
	{ key: 'current', label: '电流(A)', minWidth: 110, tooltip: false, formatter: (row) => formatNumber(Number(row.current), 1) },
	{ key: 'todayElec', label: '今日用电(kWh)', minWidth: 130, tooltip: false, formatter: (row) => formatNumber(Number(row.todayElec), 0) },
	{ key: 'actions', label: '操作', width: 100, fixed: 'right', type: 'actions', tooltip: false },
];

const metrics = computed<MetricCardItem[]>(() => [
	{
		key: 'online-circuits',
		label: '在线回路',
		value: formatNumber(overviewData.value?.summary.onlineCircuitCount ?? 0),
		unit: '个',
		icon: onlineCircuitsImage.value,
	},
	{
		key: 'lighting-power',
		label: '实时功率',
		value: formatNumber(overviewData.value?.summary.realtimePower ?? 0),
		unit: 'kW',
		icon: lightingRealTimePowerImage.value,
	},
	{
		key: 'today-electricity',
		label: '今日用电',
		value: formatNumber(overviewData.value?.summary.todayElec ?? 0),
		unit: 'kWh',
		icon: cumulativeElectricityConsumptionImage.value,
	},
	{
		key: 'energy-saving-rate',
		label: '节能率',
		value: formatNumber(overviewData.value?.summary.savingRate ?? 0),
		unit: '%',
		icon: energySavingRateImage.value,
	},
]);

const trend = computed<TrendChartConfig>(() => ({
	title: '照明功率曲线',
	unit: 'kW',
	yAxisName: '功率(kW)',
	xAxis: overviewData.value?.chartData.powerTrend.map((item) => item.statPeriod) ?? [],
	series: [
		{
			name: '功率值',
			data: overviewData.value?.chartData.powerTrend.map((item) => item.power) ?? [],
		},
	],
	decimals: 0,
}));

const secondaryChart = computed<PieSecondaryChartConfig>(() => ({
	type: 'pie',
	title: '分区照明占比',
	centerLabel: '照明占比',
	unit: '%',
	items:
		overviewData.value?.chartData.zoneLightingRatio.map((item, index) => ({
			name: item.zoneName,
			value: item.ratio,
			color: distributionPalette[index % distributionPalette.length],
		})) ?? [],
}));

const handleRefresh = async () => {
	if (refreshing.value) return;
	await reloadAll();
	message.success(`照明系统监控数据已刷新，数据时间 ${overviewData.value?.dataTime || '--'}。`);
};

const handleActionClick = async (_action: string, row: ItemizedTableRow) => {
	if (detailLoading.value) return;
	detailVisible.value = true;
	detailLoading.value = true;

	try {
		const response = await getItemizedSystemMonitorDetail({
			monitorType: 'lighting',
			id: row.id,
		});
		detailRecord.value = response.data;
	} catch (error: any) {
		detailVisible.value = false;
		message.error(error?.message || error?.msg || `${row.circuitName}详情加载失败`);
	} finally {
		detailLoading.value = false;
	}
};

const table = computed<TableConfig>(() => ({
	sectionTitle: '照明回路监控',
	columns,
	rows: tableRows.value,
	actions: ['查看'],
	loading: refreshing.value,
	headerAction: {
		label: '刷新数据',
		icon: 'refresh',
		loading: refreshing.value,
		onClick: handleRefresh,
	},
	pagination: {
		total: pageData.value.total,
		pageNum: pageData.value.pageNum,
		pageSize: pageData.value.pageSize,
	},
	statusMap: {
		开启: { className: 'itemized-status-tag--on' },
		关闭: { className: 'itemized-status-tag--off' },
		待机: { className: 'itemized-status-tag--standby' },
		故障: { className: 'itemized-status-tag--danger' },
	},
	onPageChange: handlePageChange,
	onPageSizeChange: handlePageSizeChange,
	onActionClick: handleActionClick,
}));
</script>
