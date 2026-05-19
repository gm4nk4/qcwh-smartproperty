<template>
	<ItemizedSystemPanel :metrics="metrics" :trend="trend" :secondary-chart="secondaryChart" :table="table" />
	<ItemizedSystemDetailDialog
		v-model="detailVisible"
		:loading="detailLoading"
		:monitor-type="'elevator'"
		:detail="detailRecord"
	/>
</template>

<script setup lang="ts" name="ElevatorSystemTab">
import { computed, ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useThemeImage } from '/@/utils/themeImages';
import { getItemizedSystemMonitorDetail, type ItemizedMonitorDetailRecord } from '/@/api/energy/itemizedSystemMonitor';
import ItemizedSystemPanel from './ItemizedSystemPanel.vue';
import ItemizedSystemDetailDialog from './ItemizedSystemDetailDialog.vue';
import type { BarSecondaryChartConfig, ItemizedTableRow, MetricCardItem, TableConfig, TableColumnConfig, TrendChartConfig } from './types';
import { useItemizedSystemMonitorMockData } from './useItemizedSystemMonitorMockData';

const elevatorTotalImage = useThemeImage('elevatorTotal');
const activeElevatorsImage = useThemeImage('activeElevators');
const realTimePowerImage = useThemeImage('realTimePower');
const cumulativeElectricityConsumptionImage = useThemeImage('cumulativeElectricityConsumption');

const message = useMessage();
const { overviewData, pageData, overviewLoading, tableLoading, reloadAll, handlePageChange, handlePageSizeChange } =
	useItemizedSystemMonitorMockData('elevator');
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailRecord = ref<ItemizedMonitorDetailRecord | null>(null);

const refreshing = computed(() => overviewLoading.value || tableLoading.value);

const formatNumber = (value: number, digits = 0) =>
	new Intl.NumberFormat('zh-CN', {
		minimumFractionDigits: 0,
		maximumFractionDigits: digits,
	}).format(value);

const tableRows = computed<ItemizedTableRow[]>(() =>
	pageData.value.list.map((item) => ({
		id: String(item.id),
		elevatorCode: item.elevatorCode,
		elevatorType: item.elevatorType,
		location: item.location,
		runStatusName: item.runStatusName,
		currentFloor: item.currentFloor,
		todayRunCount: item.todayRunCount,
		power: item.power,
		todayElec: item.todayElec,
	}))
);

const columns: TableColumnConfig[] = [
	{ key: 'elevatorCode', label: '电梯编号', minWidth: 150 },
	{ key: 'elevatorType', label: '类型', minWidth: 110 },
	{ key: 'location', label: '位置', minWidth: 110 },
	{ key: 'runStatusName', label: '运行状态', width: 100, type: 'status', tooltip: false },
	{ key: 'currentFloor', label: '当前楼层', minWidth: 110, tooltip: false },
	{ key: 'todayRunCount', label: '今日次数', minWidth: 110, tooltip: false, formatter: (row) => formatNumber(Number(row.todayRunCount), 0) },
	{ key: 'power', label: '功率(kW)', minWidth: 110, tooltip: false, formatter: (row) => formatNumber(Number(row.power), 1) },
	{ key: 'todayElec', label: '今日用电(kWh)', minWidth: 130, tooltip: false, formatter: (row) => formatNumber(Number(row.todayElec), 0) },
	{ key: 'actions', label: '操作', width: 100, fixed: 'right', type: 'actions', tooltip: false },
];

const metrics = computed<MetricCardItem[]>(() => [
	{
		key: 'elevator-total',
		label: '电梯总数',
		value: formatNumber(overviewData.value?.summary.elevatorTotalCount ?? 0),
		unit: '台',
		icon: elevatorTotalImage.value,
	},
	{
		key: 'elevator-running',
		label: '运行中',
		value: formatNumber(overviewData.value?.summary.runningCount ?? 0),
		unit: '台',
		icon: activeElevatorsImage.value,
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
]);

const trend = computed<TrendChartConfig>(() => ({
	title: '电梯功率曲线',
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

const secondaryChart = computed<BarSecondaryChartConfig>(() => ({
	type: 'bar',
	title: '运行次数统计',
	unit: '次',
	yAxisName: '次数',
	legendLabel: '次数',
	items:
		overviewData.value?.chartData.runTimesStats.map((item) => ({
			name: item.elevatorName,
			value: item.runTimes,
			paletteIndex: 0,
		})) ?? [],
	decimals: 0,
}));

const handleRefresh = async () => {
	if (refreshing.value) return;
	await reloadAll();
	message.success(`电梯系统监控数据已刷新，数据时间 ${overviewData.value?.dataTime || '--'}。`);
};

const handleActionClick = async (_action: string, row: ItemizedTableRow) => {
	if (detailLoading.value) return;
	detailVisible.value = true;
	detailLoading.value = true;

	try {
		const response = await getItemizedSystemMonitorDetail({
			monitorType: 'elevator',
			id: row.id,
		});
		detailRecord.value = response.data;
	} catch (error: any) {
		detailVisible.value = false;
		message.error(error?.message || error?.msg || `${row.elevatorCode}详情加载失败`);
	} finally {
		detailLoading.value = false;
	}
};

const table = computed<TableConfig>(() => ({
	sectionTitle: '电梯监控-电梯运行状态',
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
