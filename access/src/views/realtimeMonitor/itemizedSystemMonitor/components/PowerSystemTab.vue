<template>
	<ItemizedSystemPanel :metrics="metrics" :trend="trend" :secondary-chart="secondaryChart" :table="table" />
	<ItemizedSystemDetailDialog
		v-model="detailVisible"
		:loading="detailLoading"
		:monitor-type="'power'"
		:detail="detailRecord"
	/>
</template>

<script setup lang="ts" name="PowerSystemTab">
import { computed, ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useThemeImage } from '/@/utils/themeImages';
import { getItemizedSystemMonitorDetail, type ItemizedMonitorDetailRecord } from '/@/api/energy/itemizedSystemMonitor';
import ItemizedSystemPanel from './ItemizedSystemPanel.vue';
import ItemizedSystemDetailDialog from './ItemizedSystemDetailDialog.vue';
import type { ItemizedTableRow, MetricCardItem, PieSecondaryChartConfig, TableConfig, TableColumnConfig, TrendChartConfig } from './types';
import { useItemizedSystemMonitorMockData } from './useItemizedSystemMonitorMockData';

const activeDevicesImage = useThemeImage('activeDevices');
const realTimePowerImage = useThemeImage('realTimePower');
const cumulativeElectricityConsumptionImage = useThemeImage('cumulativeElectricityConsumption');
const averageEfficiencyImage = useThemeImage('averageEfficiency');

const message = useMessage();
const { overviewData, pageData, overviewLoading, tableLoading, reloadAll, handlePageChange, handlePageSizeChange } =
	useItemizedSystemMonitorMockData('power');
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
		deviceName: item.deviceName,
		deviceType: item.deviceType,
		location: item.location,
		runStatusName: item.runStatusName,
		power: item.power,
		efficiency: item.efficiency,
		todayElec: item.todayElec,
	}))
);

const columns: TableColumnConfig[] = [
	{ key: 'deviceName', label: '设备名称', minWidth: 170 },
	{ key: 'deviceType', label: '设备类型', minWidth: 120 },
	{ key: 'location', label: '位置', minWidth: 160 },
	{ key: 'runStatusName', label: '运行状态', width: 100, type: 'status', tooltip: false },
	{ key: 'power', label: '功率(kW)', minWidth: 110, tooltip: false, formatter: (row) => formatNumber(Number(row.power), 0) },
	{ key: 'efficiency', label: '效率', minWidth: 110, type: 'efficiency', tooltip: false },
	{ key: 'todayElec', label: '今日用电(kWh)', minWidth: 130, tooltip: false, formatter: (row) => formatNumber(Number(row.todayElec), 0) },
	{ key: 'actions', label: '操作', width: 100, fixed: 'right', type: 'actions', tooltip: false },
];

const metrics = computed<MetricCardItem[]>(() => [
	{
		key: 'running-devices',
		label: '运行设备',
		value: formatNumber(overviewData.value?.summary.runningDeviceCount ?? 0),
		unit: '台',
		icon: activeDevicesImage.value,
	},
	{
		key: 'real-time-power',
		label: '实时功率',
		value: formatNumber(overviewData.value?.summary.realtimePower ?? 0),
		unit: 'kW',
		icon: realTimePowerImage.value,
	},
	{
		key: 'today-electricity',
		label: '今日用电',
		value: formatNumber(overviewData.value?.summary.todayElec ?? 0),
		unit: 'kWh',
		icon: cumulativeElectricityConsumptionImage.value,
	},
	{
		key: 'average-efficiency',
		label: '平均效率',
		value: formatNumber(overviewData.value?.summary.avgEfficiency ?? 0),
		unit: '%',
		icon: averageEfficiencyImage.value,
	},
]);

const trend = computed<TrendChartConfig>(() => ({
	title: '动力系统功率曲线',
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
	title: '设备类型分布',
	centerLabel: '设备类型分布',
	unit: '%',
	items:
		overviewData.value?.chartData.deviceTypeDistribution.map((item, index) => ({
			name: item.deviceTypeName,
			value: item.ratio,
			color: distributionPalette[index % distributionPalette.length],
		})) ?? [],
}));

const handleRefresh = async () => {
	if (refreshing.value) return;
	await reloadAll();
	message.success(`动力系统监控数据已刷新，数据时间 ${overviewData.value?.dataTime || '--'}。`);
};

const handleActionClick = async (_action: string, row: ItemizedTableRow) => {
	if (detailLoading.value) return;
	detailVisible.value = true;
	detailLoading.value = true;

	try {
		const response = await getItemizedSystemMonitorDetail({
			monitorType: 'power',
			id: row.id,
		});
		detailRecord.value = response.data;
	} catch (error: any) {
		detailVisible.value = false;
		message.error(error?.message || error?.msg || `${row.deviceName}详情加载失败`);
	} finally {
		detailLoading.value = false;
	}
};

const table = computed<TableConfig>(() => ({
	sectionTitle: '动力设备监控',
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
		运行: { className: 'itemized-status-tag--running' },
		待机: { className: 'itemized-status-tag--standby' },
		关闭: { className: 'itemized-status-tag--off' },
		故障: { className: 'itemized-status-tag--danger' },
	},
	onPageChange: handlePageChange,
	onPageSizeChange: handlePageSizeChange,
	onActionClick: handleActionClick,
}));
</script>
