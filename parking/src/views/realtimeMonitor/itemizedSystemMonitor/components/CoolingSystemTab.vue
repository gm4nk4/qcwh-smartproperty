<template>
	<div class="cooling-system-tab">
		<section class="monitor-section">
			<header class="section-anchor">
				<span class="section-anchor__icon">
					<el-icon><ArrowDownBold /></el-icon>
				</span>
				<h3>总体监控</h3>
			</header>
			<div class="metric-grid">
				<article v-for="item in metrics" :key="item.key" class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">{{ item.label }}</p>
						<div class="metric-card__value">
							<span>{{ item.value }}</span>
							<small>{{ item.unit }}</small>
						</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="item.icon" :alt="item.label" class="metric-icon" />
						</div>
					</div>
				</article>
			</div>
			<div class="chart-grid">
				<article class="panel-card">
					<header class="panel-card__header">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<h4>供回水温度曲线</h4>
						</div>
					</header>
					<v-chart class="panel-chart" :option="temperatureChartOption" autoresize />
				</article>

				<article class="panel-card">
					<header class="panel-card__header">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<h4>COP值趋势</h4>
						</div>
					</header>
					<v-chart class="panel-chart" :option="copChartOption" autoresize />
				</article>
			</div>
		</section>

		<section class="monitor-section">
			<header class="section-anchor">
				<span class="section-anchor__icon">
					<el-icon><ArrowDownBold /></el-icon>
				</span>
				<h3>制冷系统组态</h3>
			</header>
			<div class="panel-card panel-card--diagram">
				<header class="panel-card__header panel-card__header--diagram">
					<div class="panel-card__title-block">
						<span class="panel-card__bar"></span>
						<h4>制冷系统组态占位</h4>
					</div>
					<div class="diagram-actions">
						<button type="button" class="diagram-action-btn" aria-label="缩小" @click="handleScaleChange(-10)">
							<el-icon><Minus /></el-icon>
						</button>
						<span>{{ diagramScale }}%</span>
						<button type="button" class="diagram-action-btn" aria-label="放大" @click="handleScaleChange(10)">
							<el-icon><Plus /></el-icon>
						</button>
						<button type="button" class="diagram-action-btn" aria-label="全屏" @click="handleFullscreen">
							<el-icon><FullScreen /></el-icon>
						</button>
					</div>
				</header>

				<div class="diagram-stage">
					<div class="diagram-placeholder-panel" :style="{ transform: `scale(${diagramScale / 100})` }">
						<div class="diagram-placeholder-panel__badge">scadaConfig</div>
						<h5>当前按接口文档返回组态占位数据</h5>
						<p>mock 概览接口中的 `scadaConfig` 当前固定返回 `{}`，这一区域先保留联调占位，后续拿到组态字段后可直接替换。</p>
						<div class="diagram-placeholder-panel__meta">
							<span>monitorType：{{ overviewData?.monitorType || 'cooling' }}</span>
							<span>dataTime：{{ overviewData?.dataTime || '--' }}</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="monitor-section">
			<header class="section-anchor">
				<span class="section-anchor__icon">
					<el-icon><ArrowDownBold /></el-icon>
				</span>
				<h3>设备监控-冷水机组状态</h3>
			</header>
			<div class="panel-card panel-card--table">
				<header class="panel-card__header panel-card__header--table">
					<div class="panel-card__title-block">
						<span class="panel-card__bar"></span>
						<h4>冷水机组运行清单</h4>
					</div>
					<el-button class="table-header-action" plain :loading="refreshing" @click="handleRefresh">
						<el-icon><RefreshRight /></el-icon>
						<span>刷新数据</span>
					</el-button>
				</header>

				<ConfigurableTableWithForm
					class="cooling-table-with-form"
					:table-config="tableConfig"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				>
					<template #coolingStatusTag="{ row }">
						<el-tag class="equipment-status-tag" :class="statusTagClass(row.runStatusName)" size="small" effect="light">
							{{ row.runStatusName }}
						</el-tag>
					</template>

					<template #coolingLoadRate="{ row }">
						<div class="load-rate-cell">
							<div class="load-rate-cell__track">
								<div class="load-rate-cell__fill" :style="getLoadRateFillStyle(row)"></div>
							</div>
							<el-icon class="load-rate-cell__icon" :class="{ 'is-danger': row.loadRate === 0 }">
								<CircleCloseFilled v-if="row.loadRate === 0" />
								<SuccessFilled v-else />
							</el-icon>
							<span class="load-rate-cell__text">{{ Number(row.loadRate).toFixed(2) }}%</span>
						</div>
					</template>

					<template #coolingActions="{ row }">
						<el-button type="primary" link size="small" @click="handleViewRow(row)">查看</el-button>
					</template>
				</ConfigurableTableWithForm>
			</div>
		</section>
	</div>
	<ItemizedSystemDetailDialog
		v-model="detailVisible"
		:loading="detailLoading"
		:monitor-type="'cooling'"
		:detail="detailRecord"
	/>
</template>

<script setup lang="ts" name="CoolingSystemTab">
import { computed, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import type { EChartsOption } from 'echarts';
import VChart from 'vue-echarts';
import { ArrowDownBold, CircleCloseFilled, FullScreen, Minus, Plus, RefreshRight, SuccessFilled } from '@element-plus/icons-vue';
import { ConfigurableTableWithForm, type TableColumn, type TableConfig } from '/@/components/ConfigurableComponents';
import { useMessage } from '/@/hooks/message';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';
import { getItemizedSystemMonitorDetail, type ItemizedMonitorDetailRecord } from '/@/api/energy/itemizedSystemMonitor';
import type { MetricCardItem } from './types';
import ItemizedSystemDetailDialog from './ItemizedSystemDetailDialog.vue';
import { useItemizedSystemMonitorMockData } from './useItemizedSystemMonitorMockData';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent]);

interface EquipmentRow {
	id: string;
	deviceName: string;
	runStatusName: string;
	loadRate: number;
	supplyTemp: number;
	returnTemp: number;
	copValue: number;
	power: number;
}

const tableColumns: TableColumn[] = [
	{ prop: 'deviceName', label: '机组名称', minWidth: 150, align: 'center' },
	{ prop: 'runStatusName', label: '运行状态', width: 110, align: 'center', slot: 'coolingStatusTag', showOverflowTooltip: false },
	{ prop: 'loadRate', label: '负载率', minWidth: 150, align: 'left', slot: 'coolingLoadRate', showOverflowTooltip: false },
	{ prop: 'supplyTemp', label: '供水温度(°C)', minWidth: 130, align: 'center' },
	{ prop: 'returnTemp', label: '回水温度(°C)', minWidth: 130, align: 'center' },
	{ prop: 'copValue', label: 'COP值', minWidth: 110, align: 'center' },
	{ prop: 'power', label: '功率(kW)', minWidth: 110, align: 'center' },
	{ prop: 'actions', label: '操作', width: 100, fixed: 'right', align: 'left', slot: 'coolingActions', showOverflowTooltip: false },
];

const pageSizes = [10, 20, 50];
const diagramScale = ref(100);

const runningMainUnitsImage = useThemeImage('runningMainUnits');
const coolingOutputImage = useThemeImage('coolingOutput');
const copValueImage = useThemeImage('copValue');
const cumulativeElectricityConsumptionImage = useThemeImage('cumulativeElectricityConsumption');

const message = useMessage();
const storesThemeConfig = useThemeConfig();
const { hexToRgb } = useChangeColor();
const { overviewData, pageData, overviewLoading, tableLoading, reloadAll, handlePageChange, handlePageSizeChange } =
	useItemizedSystemMonitorMockData('cooling');
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailRecord = ref<ItemizedMonitorDetailRecord | null>(null);

const refreshing = computed(() => overviewLoading.value || tableLoading.value);
const currentPage = computed(() => pageData.value.pageNum);
const pageSize = computed(() => pageData.value.pageSize);
const tableTotal = computed(() => pageData.value.total);
const displayedRows = computed<EquipmentRow[]>(() =>
	pageData.value.list.map((item) => ({
		id: String(item.id),
		deviceName: item.deviceName,
		runStatusName: item.runStatusName,
		loadRate: item.loadRate,
		supplyTemp: item.supplyTemp,
		returnTemp: item.returnTemp,
		copValue: item.copValue,
		power: item.power,
	}))
);

const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: displayedRows.value,
	loading: refreshing.value,
	pagination: true,
	pageSize: pageSize.value,
	currentPage: currentPage.value,
	pageSizes,
	total: tableTotal.value,
	showIndex: false,
	selectionType: 'none',
	showOperations: false,
}));

const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || storesThemeConfig.themeConfig.currentTheme?.color?.primary?.normal || '#0094FF');
const trendPrimaryColor = computed(() => (storesThemeConfig.themeConfig.skin === 'light-green' ? '#4BA6A9' : primaryColor.value));

const metrics = computed<MetricCardItem[]>(() => [
	{
		key: 'running-main-units',
		label: '运行主机',
		value: formatNumber(overviewData.value?.summary.runningHostCount ?? 0),
		unit: '台',
		icon: runningMainUnitsImage.value,
	},
	{
		key: 'cooling-output',
		label: '制冷量',
		value: formatNumber(overviewData.value?.summary.coolingCapacity ?? 0),
		unit: 'kW',
		icon: coolingOutputImage.value,
	},
	{
		key: 'cop-value',
		label: 'COP值',
		value: formatNumber(overviewData.value?.summary.copValue ?? 0, 1),
		unit: '',
		icon: copValueImage.value,
	},
	{
		key: 'cumulative-electricity',
		label: '累计耗电',
		value: formatNumber(overviewData.value?.summary.totalElec ?? 0),
		unit: 'kWh',
		icon: cumulativeElectricityConsumptionImage.value,
	},
]);

const toRgba = (color: string, alpha: number) => {
	const rgb = hexToRgb(color);
	if (Array.isArray(rgb)) return `rgba(${rgb.join(',')}, ${alpha})`;
	return `rgba(0, 148, 255, ${alpha})`;
};

const formatNumber = (value: number, maximumFractionDigits = 0) =>
	new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits,
		minimumFractionDigits: 0,
	}).format(value);

const createLineOption = (
	xAxisData: string[],
	title: string,
	yAxisName: string,
	unit: string,
	series: Array<{ name: string; data: number[]; color: string; fillArea?: boolean; areaOpacity?: number }>
): EChartsOption => ({
	tooltip: {
		trigger: 'axis',
		backgroundColor: 'rgba(15, 23, 42, 0.92)',
		borderWidth: 0,
		padding: [10, 14],
		textStyle: {
			color: '#ffffff',
		},
		formatter: (params: any) => {
			const items = Array.isArray(params) ? params : [params];
			return [items[0]?.axisValue || title, ...items.map((item: any) => `${item.marker}${item.seriesName}：${formatNumber(Number(item.data), 1)} ${unit}`)].join('<br/>');
		},
	},
	legend: {
		bottom: 0,
		left: 'center',
		itemWidth: 10,
		itemHeight: 10,
		icon: 'circle',
		textStyle: {
			color: '#6F7B90',
			fontSize: 13,
		},
	},
	grid: {
		left: 16,
		right: 16,
		top: 24,
		bottom: 48,
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: xAxisData,
		axisLine: {
			lineStyle: {
				color: toRgba(primaryColor.value, 0.18),
			},
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			color: '#7B8794',
			margin: 12,
		},
	},
	yAxis: {
		type: 'value',
		name: yAxisName,
		nameLocation: 'end',
		nameTextStyle: {
			color: '#7B8794',
			padding: [0, 0, 8, 0],
			fontSize: 12,
		},
		splitLine: {
			lineStyle: {
				color: 'rgba(206, 214, 229, 0.72)',
				type: 'dashed',
			},
		},
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			color: '#7B8794',
		},
	},
	series: series.map((item, index) => ({
		name: item.name,
		type: 'line',
		smooth: true,
		symbol: 'circle',
		symbolSize: series.length === 1 ? 8 : 6,
		data: item.data,
		lineStyle: {
			width: index === 0 ? 4 : 3,
			color: item.color,
		},
		itemStyle: {
			color: '#ffffff',
			borderColor: item.color,
			borderWidth: 2,
		},
		areaStyle:
			item.fillArea
				? {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{ offset: 0, color: toRgba(item.color, item.areaOpacity ?? 0.24) },
								{ offset: 1, color: toRgba(item.color, 0.05) },
							],
						},
					}
				: undefined,
	})),
});

const temperatureChartOption = computed(() => {
	const temperatureTrend = overviewData.value?.chartData.temperatureTrend ?? [];
	return createLineOption(
		temperatureTrend.map((item) => item.statPeriod),
		'供回水温度曲线',
		'温度(°C)',
		'°C',
		[
			{ name: '供水温度', data: temperatureTrend.map((item) => item.supplyTemp), color: '#3A8DFF', fillArea: true, areaOpacity: 0.22 },
			{ name: '回水温度', data: temperatureTrend.map((item) => item.returnTemp), color: '#FFB228', fillArea: true, areaOpacity: 0.18 },
		]
	);
});

const copChartOption = computed(() => {
	const copTrend = overviewData.value?.chartData.copTrend ?? [];
	return createLineOption(
		copTrend.map((item) => item.statPeriod),
		'COP值趋势',
		'COP值',
		'',
		[{ name: 'COP值', data: copTrend.map((item) => item.copValue), color: trendPrimaryColor.value, fillArea: true, areaOpacity: 0.2 }]
	);
});

const statusTagClass = (status: string) => {
	if (status === '运行') return 'equipment-status-tag--running';
	if (status === '待机') return 'equipment-status-tag--standby';
	if (status === '故障') return 'equipment-status-tag--fault';
	return 'equipment-status-tag--stop';
};

const getLoadRateFillStyle = (row: EquipmentRow) => ({
	width: `${row.loadRate}%`,
	background: trendPrimaryColor.value,
});

const handleCurrentChange = (page: number) => {
	void handlePageChange(page);
};

const handleSizeChange = (size: number) => {
	void handlePageSizeChange(size);
};

const handleScaleChange = (offset: number) => {
	diagramScale.value = Math.min(140, Math.max(80, diagramScale.value + offset));
};

const handleFullscreen = () => {
	message.info('制冷系统组态全屏能力暂未接入，当前先保留交互位。');
};

const handleViewRow = async (row: EquipmentRow) => {
	if (detailLoading.value) return;
	detailVisible.value = true;
	detailLoading.value = true;

	try {
		const response = await getItemizedSystemMonitorDetail({
			monitorType: 'cooling',
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

const handleRefresh = async () => {
	if (refreshing.value) return;
	await reloadAll();
	message.success(`制冷系统监控数据已刷新，数据时间 ${overviewData.value?.dataTime || '--'}。`);
};
</script>

<style scoped lang="scss">
.cooling-system-tab {
	display: flex;
	flex-direction: column;
	gap: 18px;
}

.monitor-section {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.section-anchor {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	margin: 0;
}

.section-anchor h3 {
	margin: 0;
	font-size: 16px;
	font-weight: 700;
	color: var(--theme-text-system);
}

.section-anchor__icon {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: #27313f;
	color: #ffffff;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
}

.panel-card {
	position: relative;
	padding: 20px;
	border-radius: 24px;
	background: #ffffff;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
	overflow: hidden;
}

.panel-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	margin-bottom: 14px;
}

.panel-card__header--diagram {
	margin-bottom: 18px;
}

.panel-card__header--table {
	margin-bottom: 10px;
}

.panel-card__title-block {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
}

.panel-card__bar {
	width: 4px;
	height: 20px;
	border-radius: 999px;
	background: var(--dashboard-primary);
	box-shadow: 0 4px 10px rgba(var(--dashboard-primary-rgb), 0.22);
}

.panel-card__title-block h4 {
	margin: 0;
	font-size: 17px;
	font-weight: 700;
	color: var(--theme-text-system);
}

.metric-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	align-items: stretch;
	gap: clamp(12px, 0.83333vw, 16px);
}

.metric-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 90px;
	align-items: center;
	height: 110px;
	padding: clamp(14px, 0.83333vw, 16px) clamp(16px, 1.04167vw, 20px);
	border-radius: clamp(16px, 1.04167vw, 20px);
	background-color: #ffffff;
	background-image: var(--dashboard-metric-card-image);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	overflow: hidden;
}

.metric-card__content {
	display: flex;
	flex-direction: column;
	gap: clamp(4px, 0.3125vw, 6px);
}

.metric-card__label {
	margin: 0;
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-primaryTitle);
	line-height: 1.2;
}

.metric-card__value {
	display: flex;
	align-items: flex-end;
	gap: 6px;
	line-height: 1;
}

.metric-card__value span {
	font-size: 24px;
	font-weight: 800;
	letter-spacing: -0.03em;
	color: var(--theme-text-system);
}

.metric-card__value small {
	margin-bottom: 3px;
	font-size: clamp(14px, 0.83333vw, 16px);
	font-weight: 700;
	color: var(--theme-text-dataAssist);
}

.metric-card__visual {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
}

.metric-card__icon-shell {
	width: 90px;
	height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.metric-icon {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.chart-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14px;
}

.panel-chart {
	width: 100%;
	height: 340px;
}

.diagram-actions {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	height: 40px;
	padding: 0 10px;
	border-radius: 18px;
	background: #f3f7fd;
	color: #6a7588;
	font-size: 13px;
	font-weight: 600;
}

.diagram-action-btn {
	width: 28px;
	height: 28px;
	padding: 0;
	border: none;
	border-radius: 8px;
	background: #ffffff;
	color: #768297;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.diagram-action-btn:hover {
	color: var(--dashboard-primary);
}

.diagram-stage {
	position: relative;
	overflow: auto;
	padding: 12px;
	border-radius: 20px;
	background:
		linear-gradient(180deg, rgba(243, 249, 255, 0.98) 0%, rgba(236, 245, 255, 0.92) 100%),
		linear-gradient(to right, rgba(22, 119, 255, 0.06) 1px, transparent 1px),
		linear-gradient(to bottom, rgba(22, 119, 255, 0.06) 1px, transparent 1px);
	background-size: auto, 56px 56px, 56px 56px;
}

.diagram-placeholder-panel {
	min-height: 360px;
	padding: 36px;
	border-radius: 24px;
	border: 2px dashed rgba(var(--dashboard-primary-rgb), 0.3);
	background: rgba(255, 255, 255, 0.88);
	box-shadow: 0 18px 36px rgba(var(--dashboard-primary-rgb), 0.08);
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 16px;
	transform-origin: top center;
	transition: transform 0.2s ease;
}

.diagram-placeholder-panel__badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: fit-content;
	height: 36px;
	padding: 0 18px;
	border-radius: 12px;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
	font-size: 14px;
	font-weight: 700;
	box-shadow: 0 10px 24px rgba(var(--dashboard-primary-rgb), 0.18);
}

.diagram-placeholder-panel h5 {
	margin: 0;
	font-size: 22px;
	font-weight: 700;
	color: #1f2d3d;
}

.diagram-placeholder-panel p {
	margin: 0;
	max-width: 720px;
	font-size: 14px;
	line-height: 1.8;
	color: #6b7a90;
}

.diagram-placeholder-panel__meta {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.diagram-placeholder-panel__meta span {
	padding: 8px 14px;
	border-radius: 999px;
	background: rgba(var(--dashboard-primary-rgb), 0.08);
	color: #4d5a70;
	font-size: 13px;
	font-weight: 600;
}

.diagram-canvas {
	min-width: 1180px;
	min-height: 620px;
	display: grid;
	grid-template-columns: 1.1fr 88px 1fr;
	gap: 20px;
	transform-origin: top center;
	transition: transform 0.2s ease;
}

.diagram-zone {
	min-height: 100%;
	padding: 28px 24px;
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.82);
	backdrop-filter: blur(10px);
	box-shadow: 0 18px 36px rgba(var(--dashboard-primary-rgb), 0.08);
}

.diagram-zone--left {
	border: 2px dashed rgba(var(--dashboard-primary-rgb), 0.48);
}

.diagram-zone--right {
	border: 2px dashed rgba(27, 199, 177, 0.45);
}

.diagram-zone__head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 20px;
}

.diagram-zone__badge {
	height: 36px;
	padding: 0 18px;
	border-radius: 12px;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
	font-size: 14px;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
	box-shadow: 0 10px 24px rgba(var(--dashboard-primary-rgb), 0.18);
}

.diagram-zone__badge--secondary {
	margin-top: 12px;
}

.diagram-zone__badge--green {
	background: linear-gradient(135deg, #24d0d8, #4b9fff);
}

.diagram-zone__hint {
	margin: 0;
	max-width: 360px;
	font-size: 13px;
	line-height: 1.6;
	color: #7d8aa2;
}

.diagram-main-units {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 16px;
}

.diagram-card {
	padding: 18px;
	border-radius: 20px;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.96) 100%);
	border: 2px solid rgba(36, 208, 216, 0.42);
	box-shadow: 0 12px 30px rgba(var(--dashboard-primary-rgb), 0.08);
}

.diagram-card.is-stop {
	border-color: rgba(148, 163, 184, 0.42);
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 247, 249, 0.92) 100%);
}

.diagram-card__title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.diagram-card__title-row strong {
	font-size: 18px;
	color: #1f2d3d;
}

.diagram-status-pill {
	height: 24px;
	padding: 0 10px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
}

.diagram-status-pill.is-running {
	background: rgba(70, 181, 56, 0.12);
	color: #46b538;
}

.diagram-status-pill.is-standby {
	background: rgba(100, 116, 139, 0.12);
	color: #64748b;
}

.diagram-status-pill.is-stop {
	background: rgba(148, 163, 184, 0.16);
	color: #94a3b8;
}

.diagram-card__metrics {
	margin-top: 16px;
	padding: 14px 16px;
	border-radius: 16px;
	background: linear-gradient(135deg, rgba(33, 196, 206, 0.92), rgba(27, 119, 255, 0.92));
	color: #ffffff;
}

.diagram-card__metrics p,
.diagram-summary-card p,
.air-system-card__stats p,
.diagram-tower p {
	margin: 0;
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 12px;
	font-size: 14px;
	line-height: 1.9;
}

.diagram-card__metrics span,
.diagram-summary-card span,
.air-system-card__stats span,
.diagram-tower span {
	font-size: 22px;
	font-weight: 800;
}

.diagram-card__action {
	width: 100%;
	height: 40px;
	margin-top: 14px;
	border: none;
	border-radius: 14px;
	background: rgba(248, 250, 252, 0.96);
	color: #6b7a90;
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
}

.diagram-pipeline {
	position: relative;
}

.diagram-pipeline--vertical {
	width: 6px;
	height: 92px;
	margin: 16px 0 16px 64px;
	border-radius: 999px;
	background: linear-gradient(180deg, rgba(245, 120, 120, 0.92), rgba(99, 210, 242, 0.92));
}

.diagram-tower {
	width: 180px;
	padding: 18px;
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.96);
	border: 2px solid rgba(var(--dashboard-primary-rgb), 0.22);
	box-shadow: 0 14px 30px rgba(var(--dashboard-primary-rgb), 0.08);
}

.diagram-tower__icon {
	width: 76px;
	height: 94px;
	margin: 0 auto 10px;
	border-radius: 38px 38px 22px 22px;
	background:
		radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.24) 42%, transparent 43%),
		linear-gradient(180deg, rgba(120, 180, 255, 0.96) 0%, rgba(21, 120, 255, 0.28) 100%);
	box-shadow: inset 0 -12px 20px rgba(17, 24, 39, 0.08);
}

.diagram-pump-group {
	position: relative;
	margin-top: 18px;
}

.diagram-pipeline--horizontal {
	position: absolute;
	left: -12px;
	top: 50%;
	width: 120px;
	height: 6px;
	border-radius: 999px;
	transform: translateY(-50%);
}

.diagram-pipeline--red {
	background: linear-gradient(90deg, rgba(245, 120, 120, 0.92), rgba(245, 120, 120, 0.12));
}

.diagram-pipeline--cyan {
	background: linear-gradient(90deg, rgba(98, 224, 233, 0.92), rgba(98, 224, 233, 0.12));
}

.diagram-group-box {
	margin-left: 72px;
	padding: 16px 18px;
	border-radius: 20px;
	border: 2px dashed rgba(148, 163, 184, 0.35);
	background: rgba(255, 255, 255, 0.94);
}

.diagram-group-box__title {
	margin-bottom: 12px;
	font-size: 15px;
	font-weight: 700;
	color: #1f2d3d;
}

.diagram-pill-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.diagram-pill {
	min-width: 144px;
	padding: 12px 14px;
	border-radius: 16px;
	background: rgba(249, 250, 251, 0.96);
	border: 2px solid rgba(70, 181, 56, 0.4);
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.diagram-pill.is-idle {
	border-color: rgba(148, 163, 184, 0.4);
}

.diagram-pill strong {
	font-size: 15px;
	color: #1f2d3d;
}

.diagram-pill span {
	font-size: 13px;
	font-weight: 700;
	color: #46b538;
}

.diagram-pill.is-idle span {
	color: #94a3b8;
}

.diagram-connector {
	display: flex;
	align-items: center;
	justify-content: center;
}

.diagram-pipeline--center {
	width: 100%;
	height: 8px;
	border-radius: 999px;
	background: linear-gradient(90deg, rgba(56, 189, 248, 0.95), rgba(59, 130, 246, 0.95));
	box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.12);
}

.diagram-summary-card {
	min-width: 220px;
	padding: 16px 18px;
	border-radius: 18px;
	background: linear-gradient(180deg, rgba(247, 147, 26, 0.96) 0%, rgba(222, 115, 16, 0.92) 100%);
	color: #ffffff;
	box-shadow: 0 16px 30px rgba(222, 115, 16, 0.2);
}

.air-system-list {
	display: grid;
	grid-template-columns: 1fr;
	gap: 18px;
}

.air-system-card {
	padding: 18px 20px;
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.98);
	border: 2px solid rgba(36, 208, 216, 0.52);
	box-shadow: 0 12px 28px rgba(var(--dashboard-primary-rgb), 0.08);
}

.air-system-card__title {
	margin-bottom: 12px;
	font-size: 19px;
	font-weight: 700;
	color: #1f2d3d;
}

.air-system-card__content {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	gap: 18px;
	padding: 16px 18px;
	border-radius: 18px;
	background: linear-gradient(135deg, rgba(33, 196, 206, 0.92), rgba(27, 119, 255, 0.9));
	color: #ffffff;
}

.air-system-card__stats {
	flex: 1;
}

.air-system-card__stats--right p {
	justify-content: flex-end;
}

.table-header-action {
	height: 36px;
	padding: 0 14px;
	border-radius: 12px;
	border-color: rgba(var(--dashboard-primary-rgb), 0.22);
	color: #627084;
	font-weight: 600;
}

.panel-card--table {
	overflow: visible;
}

.table-header-action :deep(.el-icon) {
	margin-right: 6px;
}

:deep(.cooling-table-with-form .form-container),
:deep(.cooling-table-with-form .query-form),
:deep(.cooling-table-with-form .table-actions-container) {
	display: none;
}

:deep(.cooling-table-with-form),
:deep(.cooling-table-with-form .configurable-table-with-form),
:deep(.cooling-table-with-form .table-container),
:deep(.cooling-table-with-form .configurable-table-container),
:deep(.cooling-table-with-form .table-content) {
	height: auto;
	min-height: 0;
	overflow: visible;
}

:deep(.cooling-table-with-form .el-table) {
	height: auto !important;
}

:deep(.cooling-table-with-form .pagination-container) {
	display: flex;
	justify-content: flex-end;
	margin-top: 14px;
}

.load-rate-cell {
	display: flex;
	align-items: center;
	gap: 10px;
}

.load-rate-cell__track {
	flex: 1;
	height: 10px;
	border-radius: 999px;
	background: #eef2f7;
	overflow: hidden;
}

.load-rate-cell__fill {
	height: 100%;
	border-radius: inherit;
	background: var(--dashboard-primary, #0094ff);
}

.load-rate-cell__icon {
	font-size: 16px;
	color: #39b54a;
}

.load-rate-cell__icon.is-danger {
	color: #f85a5a;
}

.load-rate-cell__text {
	min-width: 58px;
	font-weight: 700;
	color: #5f6c83;
}

:deep(.cooling-table-with-form .el-table__header th.el-table__cell) {
	background: #f6f9fd !important;
	color: #5f6c83 !important;
	font-weight: 700;
}

:deep(.cooling-table-with-form .el-table__row td.el-table__cell) {
	padding: 9px 0;
}

:deep(.equipment-status-tag) {
	--el-tag-border-width: 1px;
	height: 24px;
	padding: 0 8px;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 500;
	line-height: 22px;
	justify-content: center;
	box-sizing: border-box;
}

:deep(.equipment-status-tag.equipment-status-tag--running) {
	--el-tag-text-color: #46b538;
	--el-tag-border-color: #46b538;
	--el-tag-bg-color: rgba(70, 181, 56, 0.05);
}

:deep(.equipment-status-tag.equipment-status-tag--standby) {
	--el-tag-text-color: #7b8794;
	--el-tag-border-color: #cbd5e1;
	--el-tag-bg-color: #f8fafc;
}

:deep(.equipment-status-tag.equipment-status-tag--stop) {
	--el-tag-text-color: #f59e0b;
	--el-tag-border-color: #f59e0b;
	--el-tag-bg-color: rgba(245, 158, 11, 0.05);
}

:deep(.equipment-status-tag.equipment-status-tag--fault) {
	--el-tag-text-color: #f04438;
	--el-tag-border-color: #f04438;
	--el-tag-bg-color: rgba(240, 68, 56, 0.08);
}

@media screen and (max-width: 1680px) {
	.metric-grid,
	.diagram-main-units {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.chart-grid,
	.diagram-canvas {
		grid-template-columns: 1fr;
	}

	.diagram-connector {
		min-height: 48px;
	}

	.diagram-pipeline--center {
		width: 72%;
	}
}

@media screen and (max-width: 1280px) {
	.diagram-main-units {
		grid-template-columns: 1fr;
	}

	.diagram-zone__head,
	.air-system-card__content {
		flex-direction: column;
	}
}

@media screen and (max-width: 768px) {
	.panel-card {
		padding: 16px;
		border-radius: 20px;
	}

	.metric-grid {
		grid-template-columns: 1fr;
	}

	.metric-card {
		height: auto;
	}

	.panel-chart {
		height: 280px;
	}

	.diagram-actions {
		width: 100%;
		justify-content: center;
	}

	.diagram-placeholder-panel {
		padding: 24px;
		min-height: 300px;
	}

	:deep(.cooling-table-with-form .pagination-container) {
		justify-content: flex-start;
	}
}
</style>
