<template>
	<div class="utility-monitor-tab-panel">
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
							<span :class="metricValueToneClass(item.valueTone)">{{ item.value }}</span>
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

			<section class="chart-grid" :class="{ 'chart-grid--balanced': Boolean(barDistribution) }">
				<article class="panel-card panel-card--trend">
					<header class="panel-card__header">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<h3>{{ trend.title }}</h3>
						</div>
					</header>
					<v-chart class="panel-chart panel-chart--trend" :option="currentTrendOption" autoresize />
				</article>

				<ComparisonBarChart
						v-if="phaseChart"
						class="phase-comparison"
						:title="phaseChart.title"
						:title-prefix-bar="true"
						:y-axis-name="phaseChart.yAxisName"
						:decimals="phaseChart.decimals ?? 0"
						:mode="phaseChart.mode"
						:single-series-name="phaseChart.singleSeriesName"
						:last-year-data="phaseChart.lastPeriodData"
						:current-year-data="phaseChart.currentData"
						:x-axis-data="phaseChart.xAxisData"
				/>

				<article v-else-if="barDistribution" class="panel-card panel-card--distribution">
					<header class="panel-card__header">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<h3>{{ barDistribution.title }}</h3>
						</div>
					</header>
					<v-chart class="panel-chart panel-chart--distribution-bar" :option="barDistributionOption" autoresize />
				</article>

				<article v-else-if="distribution" class="panel-card panel-card--distribution">
					<header class="panel-card__header">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<h3>{{ distribution.title }}</h3>
						</div>
					</header>
					<div class="distribution-panel">
						<PieChartComponent
							:data="distributionChartData"
							:title="distribution.centerLabel"
							:legend-data="distributionLegendNames"
							:unit="distribution.unit"
							:value-digits="2"
						/>
					</div>
				</article>
			</section>
		</section>

		<section v-if="diagram" class="monitor-section">
			<header class="section-anchor">
				<span class="section-anchor__icon">
					<el-icon><ArrowDownBold /></el-icon>
				</span>
				<h3>{{ diagram.title }}</h3>
			</header>

			<section class="panel-card panel-card--diagram">
				<header class="panel-card__header panel-card__header--diagram-actions">
					<div class="diagram-actions">
						<button type="button" class="diagram-action-btn" aria-label="缩小">
							<el-icon><Minus /></el-icon>
						</button>
						<span>100%</span>
						<button type="button" class="diagram-action-btn" aria-label="放大">
							<el-icon><Plus /></el-icon>
						</button>
						<button type="button" class="diagram-action-btn" aria-label="刷新">
							<el-icon><RefreshRight /></el-icon>
						</button>
					</div>
				</header>

				<div class="diagram-placeholder" :class="{ 'diagram-placeholder--water': diagram.mode === 'water' }">
					<template v-if="diagram.mode === 'water' && diagram.summary?.length">
						<div class="diagram-water-snapshot">
							<div class="diagram-water-snapshot__intro">
								<div class="diagram-placeholder__badge">{{ diagram.badge }}</div>
								<p class="diagram-placeholder__hint">{{ diagram.hint }}</p>
							</div>
							<div class="diagram-water-snapshot__summary">
								<article v-for="item in diagram.summary" :key="item.label" class="diagram-water-snapshot__card">
									<p>{{ item.label }}</p>
									<strong>{{ item.value }}</strong>
									<span>{{ item.helper }}</span>
								</article>
							</div>
						</div>
					</template>

					<template v-else>
						<div class="diagram-placeholder__badge">{{ diagram.badge }}</div>
						<p class="diagram-placeholder__hint">{{ diagram.hint }}</p>
					</template>
				</div>
			</section>
		</section>

		<section class="monitor-section">
			<header class="section-anchor section-anchor--between">
				<div class="section-anchor__title">
					<span class="section-anchor__icon">
						<el-icon><ArrowDownBold /></el-icon>
					</span>
					<h3>{{ table.title }}</h3>
				</div>
				<el-button
					v-if="table.headerAction"
					class="table-header-action"
					plain
					:loading="Boolean(table.headerAction.loading)"
					@click="handleHeaderAction"
				>
					<el-icon v-if="table.headerAction.icon === 'refresh'"><RefreshRight /></el-icon>
					<span>{{ table.headerAction.label }}</span>
				</el-button>
			</header>

			<section class="panel-card panel-card--table">
				<el-table :data="displayedMeterRows" v-loading="Boolean(table.loading)" class="meter-table" stripe>
					<el-table-column
						v-for="column in table.columns"
						:key="column.key"
						:prop="column.type ? undefined : column.key"
						:label="column.label"
						:min-width="column.minWidth"
						:width="column.width"
						:fixed="column.fixed"
						:show-overflow-tooltip="Boolean(!column.type && column.tooltip !== false)"
					>
						<template #default="scope">
							<template v-if="column.type === 'status'">
								<el-tag
									class="meter-status-tag"
									:class="getMeterStatusClass(scope.row.status as MeterStatus)"
									size="small"
									effect="light"
								>
									{{ getMeterStatusText(scope.row.status as MeterStatus) }}
								</el-tag>
							</template>
							<template v-else-if="column.type === 'actions'">
								<el-button
									v-for="action in table.actions"
									:key="action"
									type="primary"
									link
									size="small"
									@click="handleActionClick(action, scope.row as UtilityMonitorMeterRow)"
								>
									{{ action }}
								</el-button>
							</template>
							<template v-else>
								<span>{{ scope.row[column.key] }}</span>
							</template>
						</template>
					</el-table-column>
				</el-table>
				<div class="table-pagination">
					<el-pagination
						:current-page="currentPage"
						:page-size="pageSize"
						:total="total"
						:page-sizes="pageSizes"
						layout="total, sizes, prev, pager, next"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						/>
				</div>
			</section>
		</section>
	</div>
</template>

<script setup lang="ts" name="UtilityMonitorTabPanel">
import { computed, ref, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import type { EChartsOption } from 'echarts';
import VChart from 'vue-echarts';
import { ArrowDownBold, Minus, Plus, RefreshRight } from '@element-plus/icons-vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { getChartColor, getGradientChartColor } from '/@/utils/echartsUtils';
import { useChangeColor } from '/@/utils/theme';
import ComparisonBarChart from '/@/views/energyEfficiencyAnalysis/lossAnalysis/comparisonBarChart.vue';
import PieChartComponent from '/@/components/Chart/pieChart.vue';
import type {
	BarDistributionConfig,
	DiagramConfig,
	DistributionConfig,
	MeterStatus,
	MetricCardItem,
	MetricValueTone,
	PhaseChartConfig,
	TableConfig,
	UtilityMonitorMeterRow,
	TrendChartConfig,
} from './types';

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent]);

interface Props {
	metrics: MetricCardItem[];
	trend: TrendChartConfig;
	table: TableConfig;
	phaseChart?: PhaseChartConfig;
	barDistribution?: BarDistributionConfig;
	distribution?: DistributionConfig;
	diagram?: DiagramConfig;
}

const props = defineProps<Props>();

const storesThemeConfig = useThemeConfig();
const { getLightColor, hexToRgb } = useChangeColor();

const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || storesThemeConfig.themeConfig.currentTheme?.color?.primary?.normal || '#0094FF');
const trendPrimaryColor = computed(() => (storesThemeConfig.themeConfig.skin === 'light-green' ? '#4BA6A9' : primaryColor.value));
const trendSecondaryColor = computed(() => (storesThemeConfig.themeConfig.skin === 'light-green' ? '#6A7DE6' : getLightColor(primaryColor.value, 0.28)));

const toRgba = (color: string, alpha: number) => {
	const rgb = hexToRgb(color);
	if (Array.isArray(rgb)) return `rgba(${rgb.join(',')}, ${alpha})`;
	return `rgba(0, 148, 255, ${alpha})`;
};

const formatNumber = (value: number, fractionDigits = 0) =>
	new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: fractionDigits,
		minimumFractionDigits: fractionDigits,
	}).format(value);

const distributionChartData = computed(() =>
	props.distribution?.items.map((item) => ({
		value: item.value,
		name: item.name,
		itemStyle: {
			color: item.color,
		},
	})) ?? []
);

const distributionLegendNames = computed(() => props.distribution?.items.map((item) => item.name) ?? []);

const createBarDistributionItemStyle = (item: BarDistributionConfig['items'][number]) => {
	const paletteIndex = item.paletteIndex ?? 0;
	const barStartColor = item.color || getChartColor(paletteIndex) || primaryColor.value;
	const barEndColor = item.gradientColor || getGradientChartColor(paletteIndex) || getLightColor(barStartColor, 0.72);

	return {
		color: {
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [
				{ offset: 0, color: barStartColor },
				{ offset: 1, color: barEndColor },
			],
		},
		borderRadius: [15, 15, 0, 0],
		borderColor: {
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [
				{ offset: 0, color: `${barStartColor}50` },
				{ offset: 1, color: `${barEndColor}50` },
			],
		},
		borderWidth: 12,
	};
};

const barDistributionOption = computed<EChartsOption>(() => {
	const chart = props.barDistribution;
	if (!chart) return {};

	const decimals = chart.decimals ?? 0;

	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
				shadowStyle: {
					color: toRgba(primaryColor.value, 0.06),
				},
			},
			backgroundColor: 'rgba(15, 23, 42, 0.92)',
			borderWidth: 0,
			padding: [10, 14],
			textStyle: {
				color: '#ffffff',
			},
			formatter: (params: any) => {
				const item = Array.isArray(params) ? params[0] : params;
				return `${item?.axisValue || ''}<br/>${item?.marker || ''}${chart.legendLabel}：${formatNumber(Number(item?.data || 0), decimals)} ${chart.unit}`;
			},
		},
		legend: {
			data: [chart.legendLabel],
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
			left: 12,
			right: 12,
			top: 18,
			bottom: 52,
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: chart.items.map((item) => item.name),
			axisTick: {
				show: false,
			},
			axisLine: {
				lineStyle: {
					color: toRgba(primaryColor.value, 0.18),
				},
			},
			axisLabel: {
				color: '#68768D',
				margin: 12,
				fontWeight: 600,
			},
		},
		yAxis: {
			type: 'value',
			name: chart.yAxisName,
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
			axisTick: {
				show: false,
			},
			axisLine: {
				show: false,
			},
			axisLabel: {
				color: '#7B8794',
				formatter: (value: number) => formatNumber(value, decimals),
			},
		},
		series: [
			{
				name: chart.legendLabel,
				type: 'bar',
				barWidth: 38,
				data: chart.items.map((item) => ({
					value: item.value,
					itemStyle: createBarDistributionItemStyle(item),
				})),
				label: {
					show: true,
					position: 'top',
					color: '#5B667C',
					fontSize: 15,
					fontWeight: 700,
					formatter: ({ value }: { value: number }) => formatNumber(Number(value), decimals),
				},
			},
		],
	};
});

const createTrendGradientStops = (color: string, alpha = 0.28) => [
	{ offset: 0, color: toRgba(color, alpha) },
	{ offset: 1, color: toRgba(color, 0.05) },
];

const trendLineShadowLayers = [
	{ shadowBlur: 3, shadowOffsetY: 3 },
	{ shadowBlur: 9, shadowOffsetY: 6 },
	{ shadowBlur: 18, shadowOffsetY: 9 },
];

const currentTrendOption = computed<EChartsOption>(() => {
	const trend = props.trend;
	const decimals = trend.decimals ?? 0;
	const isSingleSeries = trend.series.length === 1;
	const trendColors = [trendPrimaryColor.value, trendSecondaryColor.value, '#37C9A7'];

	const mainSeries = trend.series.map((seriesItem, index) => {
		const color = seriesItem.color || trendColors[index] || trendColors[0];
		const shouldFillArea = seriesItem.fillArea ?? (isSingleSeries && index === 0);
		return {
			name: seriesItem.name,
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: isSingleSeries ? 8 : 6,
			z: 10 + index,
			data: seriesItem.data,
			lineStyle: {
				width: index === 0 ? 4 : 3,
				color,
				type: seriesItem.lineType || 'solid',
			},
			itemStyle: {
				color: '#ffffff',
				borderColor: color,
				borderWidth: 2,
			},
			areaStyle:
				shouldFillArea
					? {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: createTrendGradientStops(color, seriesItem.areaOpacity),
							},
						}
					: undefined,
		};
	});

	const shadowSeries = isSingleSeries
		? trendLineShadowLayers.map((shadow, index) => ({
				type: 'line',
				name: `阴影-${index + 1}`,
				smooth: true,
				symbol: 'none',
				silent: true,
				animation: false,
				z: index + 1,
				data: trend.series[0].data,
				lineStyle: {
					width: 4,
					color: toRgba(trendPrimaryColor.value, 0.01),
					shadowBlur: shadow.shadowBlur,
					shadowColor: toRgba(trendPrimaryColor.value, 0.38),
					shadowOffsetX: 0,
					shadowOffsetY: shadow.shadowOffsetY,
				},
				tooltip: {
					show: false,
				},
			}))
		: [];
	const legendData = trend.series.map((seriesItem) => seriesItem.name);

	return {
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'rgba(15, 23, 42, 0.92)',
			borderWidth: 0,
			padding: [10, 14],
			textStyle: {
				color: '#ffffff',
			},
			formatter: (params: any) => {
				const items = Array.isArray(params) ? params.filter((item: any) => !String(item.seriesName).startsWith('阴影-')) : [params];
				return [items[0]?.axisValue || '', ...items.map((item: any) => `${item.marker}${item.seriesName}：${formatNumber(Number(item.data), decimals)} ${trend.unit}`)].join('<br/>');
			},
		},
		legend: {
			data: legendData,
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
			data: trend.xAxis,
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
			name: trend.yAxisName,
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
				formatter: (value: number) => formatNumber(value, decimals),
			},
		},
		series: [...shadowSeries, ...mainSeries],
	};
});

const localPagination = ref({
	current: 1,
	size: 10,
});

const currentPage = computed(() => props.table.pagination?.pageNum ?? localPagination.value.current);
const pageSize = computed(() => props.table.pagination?.pageSize ?? localPagination.value.size);
const total = computed(() => props.table.pagination?.total ?? props.table.rows.length);
const pageSizes = computed(() => props.table.pagination?.pageSizes ?? [10, 20, 50, 100]);

const displayedMeterRows = computed(() => {
	if (props.table.pagination) return props.table.rows;

	const start = (localPagination.value.current - 1) * localPagination.value.size;
	return props.table.rows.slice(start, start + localPagination.value.size);
});

watch(
	() => [props.table.rows.length, total.value, pageSize.value],
	([rowsLength, currentTotal, currentSize]) => {
		if (props.table.pagination) return;
		const totalPages = Math.max(1, Math.ceil(Number(currentTotal || rowsLength) / Number(currentSize || 10)));
		if (localPagination.value.current > totalPages) localPagination.value.current = totalPages;
	},
	{ immediate: true }
);

const handleCurrentChange = (page: number) => {
	if (props.table.onPageChange) {
		void props.table.onPageChange(page);
		return;
	}
	localPagination.value.current = page;
};

const handleSizeChange = (size: number) => {
	if (props.table.onPageSizeChange) {
		void props.table.onPageSizeChange(size);
		return;
	}
	localPagination.value.size = size;
	localPagination.value.current = 1;
};

const handleHeaderAction = () => {
	if (!props.table.headerAction?.onClick) return;
	void props.table.headerAction.onClick();
};

const handleActionClick = (action: string, row: UtilityMonitorMeterRow) => {
	if (!props.table.onActionClick) return;
	void props.table.onActionClick(action, row);
};

const getMeterStatusClass = (status: MeterStatus) => `meter-status-tag--${status}`;

const getMeterStatusText = (status: MeterStatus) => {
	if (status === 'normal') return '正常';
	if (status === 'notice') return '提醒';
	if (status === 'warning') return '警告';
	return '严重';
};

const metricValueToneClass = (tone?: MetricValueTone) => {
	if (!tone || tone === 'default') return '';
	return `is-${tone}`;
};
</script>

<style scoped lang="scss">
.utility-monitor-tab-panel {
	display: flex;
	flex-direction: column;
	gap: 14px;
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

.section-anchor--between {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
}

.section-anchor__title {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
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
	flex-shrink: 0;
}

.section-anchor h3 {
	margin: 0;
	font-size: 16px;
	font-weight: 700;
	color: var(--theme-text-system);
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

.panel-card__title-block h3 {
	margin: 0;
	font-size: 17px;
	font-weight: 700;
	color: var(--theme-text-system);
}

.metric-grid {
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	width: 100%;
	align-items: stretch;
	gap: clamp(12px, 0.83333vw, 16px);
	margin: 0;
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
	border: none;
	box-shadow: none;
	overflow: hidden;
}

.metric-card__content {
	position: relative;
	z-index: 1;
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

.metric-card__value span.is-success {
	color: #46b538;
}

.metric-card__value span.is-warning {
	color: #e98a1d;
}

.metric-card__value span.is-danger {
	color: #f85a5a;
}

.metric-card__value small {
	margin-bottom: 3px;
	font-size: clamp(14px, 0.83333vw, 16px);
	font-weight: 700;
	color: var(--theme-text-dataAssist);
}

.metric-card__visual {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
	min-height: 0;
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
	grid-template-columns: 1.4fr 1fr;
	gap: 14px;
}

.chart-grid--balanced {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.panel-chart {
	width: 100%;
}

.panel-chart--trend,
.panel-chart--phase,
.panel-chart--distribution-bar {
	height: 340px;
}

.phase-comparison {
	height: 100%;
}

.phase-comparison :deep(.chart-container) {
	height: 100%;
	min-height: 0;
	border-radius: 24px;
}

.phase-comparison :deep(.chart) {
	min-height: 340px;
}

.panel-card--distribution {
	display: flex;
	flex-direction: column;
}

.distribution-panel {
	position: relative;
	z-index: 1;
	min-height: 320px;
}

.distribution-panel :deep(.chart) {
	min-height: 320px;
}

.panel-card--diagram {
	padding-bottom: 18px;
}

.panel-card__header--diagram-actions {
	justify-content: flex-end;
	margin-bottom: 18px;
}

.diagram-actions {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	height: 34px;
	padding: 0 10px;
	border-radius: 17px;
	background: #f3f7fd;
	color: #6a7588;
	font-size: 13px;
	font-weight: 600;
}

.diagram-action-btn {
	width: 24px;
	height: 24px;
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

.diagram-placeholder {
	position: relative;
	height: 380px;
	border-radius: 18px;
	border: 1px dashed rgba(var(--dashboard-primary-rgb), 0.24);
	background-color: #f7fbff;
	background-image:
		linear-gradient(to right, rgba(22, 119, 255, 0.08) 1px, transparent 1px),
		linear-gradient(to bottom, rgba(22, 119, 255, 0.08) 1px, transparent 1px);
	background-size: 24px 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	text-align: center;
}

.diagram-placeholder--water {
	padding: 28px;
	align-items: stretch;
	justify-content: center;
}

.diagram-placeholder__badge {
	height: 36px;
	padding: 0 16px;
	border-radius: 999px;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
	font-size: 14px;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
}

.diagram-placeholder__hint {
	margin: 0;
	font-size: 14px;
	font-weight: 500;
	color: #738096;
}

.diagram-water-snapshot {
	display: flex;
	flex-direction: column;
	gap: 28px;
}

.diagram-water-snapshot__intro {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 18px 20px;
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.76);
	backdrop-filter: blur(8px);
	box-shadow: 0 12px 30px rgba(var(--dashboard-primary-rgb), 0.08);
}

.diagram-water-snapshot__summary {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
}

.diagram-water-snapshot__card {
	position: relative;
	padding: 22px 20px;
	border-radius: 22px;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 248, 255, 0.96) 100%);
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.12);
	box-shadow: 0 14px 30px rgba(var(--dashboard-primary-rgb), 0.06);
	text-align: left;
}

.diagram-water-snapshot__card::after {
	content: '';
	position: absolute;
	inset: auto 20px 16px;
	height: 4px;
	border-radius: 999px;
	background: linear-gradient(90deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	opacity: 0.45;
}

.diagram-water-snapshot__card p,
.diagram-water-snapshot__card span {
	margin: 0;
}

.diagram-water-snapshot__card p {
	font-size: 14px;
	font-weight: 700;
	color: #52627a;
}

.diagram-water-snapshot__card strong {
	display: block;
	margin: 10px 0 8px;
	font-size: 30px;
	font-weight: 800;
	line-height: 1.1;
	color: #1f2d3d;
}

.diagram-water-snapshot__card span {
	font-size: 13px;
	color: #7d8aa2;
}

.panel-card--table {
	padding-top: 18px;
	padding-bottom: 16px;
}

.table-header-action {
	height: 36px;
	padding: 0 14px;
	border-radius: 12px;
	border-color: rgba(var(--dashboard-primary-rgb), 0.22);
	color: #627084;
	font-weight: 600;
}

.table-header-action :deep(.el-icon) {
	margin-right: 6px;
}

.meter-table {
	width: 100%;
}

.table-pagination {
	display: flex;
	justify-content: flex-end;
	margin-top: 14px;
}

:deep(.meter-table .el-table__header th.el-table__cell) {
	background: #f6f9fd;
	color: #5f6c83;
	font-weight: 700;
}

:deep(.meter-table .el-table__row td.el-table__cell) {
	padding: 9px 0;
}

:deep(.meter-table .el-button + .el-button) {
	margin-left: 6px;
}

:deep(.meter-status-tag) {
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

@media screen and (max-width: 1680px) {
	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.chart-grid {
		grid-template-columns: 1fr;
	}
}

@media screen and (max-width: 1280px) {
	.diagram-water-snapshot__summary {
		grid-template-columns: 1fr;
	}
}

@media screen and (max-width: 768px) {
	.panel-card {
		padding: 16px;
		border-radius: 20px;
	}

	.section-anchor--between {
		flex-direction: column;
		align-items: flex-start;
	}

	.metric-grid {
		grid-template-columns: 1fr;
	}

	.metric-card {
		height: auto;
	}

	.panel-chart--trend,
	.diagram-placeholder {
		height: 280px;
	}

	.phase-comparison :deep(.chart) {
		min-height: 280px;
	}

	.distribution-panel,
	.distribution-panel :deep(.chart) {
		min-height: 280px;
	}

	.diagram-placeholder--water {
		height: auto;
		min-height: 280px;
	}

	.diagram-water-snapshot__intro {
		flex-direction: column;
		align-items: flex-start;
	}

	.diagram-water-snapshot__card strong {
		font-size: 24px;
	}

	.table-pagination {
		justify-content: flex-start;
	}
}
</style>
