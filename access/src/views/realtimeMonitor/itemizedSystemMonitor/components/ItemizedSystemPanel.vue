<template>
	<div class="itemized-system-panel">
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

			<section class="chart-grid" :class="{ 'chart-grid--balanced': secondaryChart.type === 'bar' }">
				<article class="panel-card panel-card--trend">
					<header class="panel-card__header">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<h4>{{ trend.title }}</h4>
						</div>
					</header>
					<v-chart class="panel-chart panel-chart--trend" :option="trendChartOption" autoresize />
				</article>

				<article class="panel-card panel-card--secondary">
					<header class="panel-card__header">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<h4>{{ secondaryChart.title }}</h4>
						</div>
					</header>

					<div v-if="secondaryChart.type === 'pie'" class="distribution-panel">
						<PieChartComponent :data="distributionChartData" :title="currentPieChart?.centerLabel || ''" :legend-data="distributionLegendNames" :unit="currentPieChart?.unit || ''" />
					</div>

					<v-chart v-else class="panel-chart panel-chart--secondary" :option="secondaryBarOption" autoresize />
				</article>
			</section>
		</section>

		<section class="monitor-section">
			<header class="section-anchor section-anchor--between">
				<div class="section-anchor__title">
					<span class="section-anchor__icon">
						<el-icon><ArrowDownBold /></el-icon>
					</span>
					<h3>{{ table.sectionTitle }}</h3>
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
				<ConfigurableTableWithForm
					class="itemized-table-wrapper"
					:table-config="configurableTableConfig"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				>
					<template #itemizedStatus="{ row }">
						<el-tag class="itemized-status-tag" :class="getStatusMeta(String(row.statusText ?? '')).className" size="small" effect="light">
							{{ getStatusMeta(String(row.statusText ?? '')).label || row.statusText }}
						</el-tag>
					</template>

					<template #itemizedEfficiency="{ row }">
						<div class="efficiency-cell">
							<div class="efficiency-cell__track">
								<div class="efficiency-cell__fill" :style="getEfficiencyFillStyle(row)"></div>
							</div>
							<el-icon class="efficiency-cell__icon" :class="{ 'is-danger': getEfficiencyValue(row, String(row.efficiencyField || '')) === 0 }">
								<CircleCloseFilled v-if="getEfficiencyValue(row, String(row.efficiencyField || '')) === 0" />
								<SuccessFilled v-else />
							</el-icon>
						</div>
					</template>

					<template #itemizedActions="{ row }">
						<el-button
							v-for="action in table.actions"
							:key="action"
							type="primary"
							link
							size="small"
							class="itemized-action-link"
							@click="handleActionClick(action, row as ItemizedTableRow)"
						>
							{{ action }}
						</el-button>
					</template>
				</ConfigurableTableWithForm>
			</section>
		</section>
	</div>
</template>

<script setup lang="ts" name="ItemizedSystemPanel">
import { computed, ref, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import type { EChartsOption } from 'echarts';
import VChart from 'vue-echarts';
import { ArrowDownBold, CircleCloseFilled, RefreshRight, SuccessFilled } from '@element-plus/icons-vue';
import { ConfigurableTableWithForm, type TableConfig as ConfigurableTableConfig, type TableColumn as ConfigurableTableColumn } from '/@/components/ConfigurableComponents';
import { useThemeConfig } from '/@/stores/themeConfig';
import { getChartColor, getGradientChartColor } from '/@/utils/echartsUtils';
import { useChangeColor } from '/@/utils/theme';
import PieChartComponent from '/@/components/Chart/pieChart.vue';
import type { BarSecondaryChartConfig, ItemizedTableRow, MetricCardItem, MetricValueTone, PieSecondaryChartConfig, SecondaryChartConfig, TableColumnConfig, TableConfig, TrendChartConfig } from './types';

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent]);

interface Props {
	metrics: MetricCardItem[];
	trend: TrendChartConfig;
	secondaryChart: SecondaryChartConfig;
	table: TableConfig;
}

const props = defineProps<Props>();

const storesThemeConfig = useThemeConfig();
const { getLightColor, hexToRgb } = useChangeColor();

const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || storesThemeConfig.themeConfig.currentTheme?.color?.primary?.normal || '#0094FF');
const trendPrimaryColor = computed(() => (storesThemeConfig.themeConfig.skin === 'light-green' ? '#4BA6A9' : primaryColor.value));
const trendSecondaryColor = computed(() => (storesThemeConfig.themeConfig.skin === 'light-green' ? '#6A7DE6' : getLightColor(primaryColor.value, 0.28)));

const currentPage = ref(1);
const pageSize = ref(10);
const defaultPageSizes = [10, 20, 50];

const total = computed(() => props.table.pagination?.total ?? props.table.rows.length);
const pageSizes = computed(() => props.table.pagination?.pageSizes ?? defaultPageSizes);
const displayedRows = computed(() => {
	if (props.table.pagination) return props.table.rows;
	const start = (currentPage.value - 1) * pageSize.value;
	return props.table.rows.slice(start, start + pageSize.value);
});

type ConfigurableRow = ItemizedTableRow & {
	statusText?: string;
	efficiencyField?: string;
};

const configurableTableColumns = computed<ConfigurableTableColumn[]>(() =>
	props.table.columns.map((column) => {
		if (column.type === 'actions') {
			return {
				prop: 'itemizedActions',
				label: column.label,
				width: column.width,
				minWidth: column.minWidth,
				fixed: column.fixed,
				align: 'left',
				slot: 'itemizedActions',
				showOverflowTooltip: false,
			};
		}

		if (column.type === 'status') {
			return {
				prop: `status__${column.key}`,
				label: column.label,
				width: column.width,
				minWidth: column.minWidth,
				fixed: column.fixed,
				align: 'center',
				slot: 'itemizedStatus',
				showOverflowTooltip: false,
			};
		}

		if (column.type === 'efficiency') {
			return {
				prop: `efficiency__${column.key}`,
				label: column.label,
				width: column.width,
				minWidth: column.minWidth,
				fixed: column.fixed,
				align: 'left',
				slot: 'itemizedEfficiency',
				showOverflowTooltip: false,
			};
		}

		return {
			prop: column.key,
			label: column.label,
			width: column.width,
			minWidth: column.minWidth,
			fixed: column.fixed,
			align: 'center',
			showOverflowTooltip: column.tooltip !== false,
			formatter: (row: ConfigurableRow) => formatCellValue(column, row as ItemizedTableRow),
		};
	})
);

const configurableTableData = computed<ConfigurableRow[]>(() =>
	displayedRows.value.map((row) => {
		const typedRow = row as ConfigurableRow;
		const statusColumn = props.table.columns.find((column) => column.type === 'status');
		const efficiencyColumn = props.table.columns.find((column) => column.type === 'efficiency');
		const statusField = statusColumn?.key;
		const efficiencyField = efficiencyColumn?.key;
		return {
			...typedRow,
			statusText: statusField ? String((typedRow as any)[statusField] ?? '') : '',
			efficiencyField: efficiencyField || '',
		};
	})
);

const configurableTableConfig = computed<ConfigurableTableConfig>(() => ({
	columns: configurableTableColumns.value,
	data: configurableTableData.value,
	loading: Boolean(props.table.loading),
	pagination: true,
	pageSize: pageSize.value,
	currentPage: currentPage.value,
	pageSizes: pageSizes.value,
	total: total.value,
	showIndex: false,
	selectionType: 'none',
	showOperations: false,
}));

watch(
	() => props.table.pagination,
	(pagination) => {
		if (!pagination) return;
		currentPage.value = pagination.pageNum || 1;
		pageSize.value = pagination.pageSize || 10;
	},
	{ immediate: true, deep: true }
);

watch(
	() => [props.table.rows.length, pageSize.value, Boolean(props.table.pagination)],
	([rowsLength, size, hasRemotePagination]) => {
		if (hasRemotePagination) return;
		const totalPages = Math.max(1, Math.ceil(Number(rowsLength || 0) / Number(size || 10)));
		if (currentPage.value > totalPages) currentPage.value = totalPages;
	},
	{ immediate: true }
);

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

const metricValueToneClass = (tone?: MetricValueTone) => {
	if (!tone || tone === 'default') return '';
	return `is-${tone}`;
};

const currentPieChart = computed<PieSecondaryChartConfig | null>(() => (props.secondaryChart.type === 'pie' ? props.secondaryChart : null));
const currentBarChart = computed<BarSecondaryChartConfig | null>(() => (props.secondaryChart.type === 'bar' ? props.secondaryChart : null));

const distributionChartData = computed(() =>
	currentPieChart.value?.items.map((item) => ({
		value: item.value,
		name: item.name,
		itemStyle: {
			color: item.color,
		},
	})) ?? []
);

const distributionLegendNames = computed(() => currentPieChart.value?.items.map((item) => item.name) ?? []);

const createTrendGradientStops = (color: string, alpha = 0.28) => [
	{ offset: 0, color: toRgba(color, alpha) },
	{ offset: 1, color: toRgba(color, 0.05) },
];

const trendLineShadowLayers = [
	{ shadowBlur: 3, shadowOffsetY: 3 },
	{ shadowBlur: 9, shadowOffsetY: 6 },
	{ shadowBlur: 18, shadowOffsetY: 9 },
];

const trendChartOption = computed<EChartsOption>(() => {
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

const createBarDistributionItemStyle = (item: BarSecondaryChartConfig['items'][number]) => {
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
		borderWidth: 8,
	};
};

const secondaryBarOption = computed<EChartsOption>(() => {
	const chart = currentBarChart.value;
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
			left: 16,
			right: 16,
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
				barWidth: 24,
				data: chart.items.map((item) => ({
					value: item.value,
					itemStyle: createBarDistributionItemStyle(item),
				})),
				label: {
					show: true,
					position: 'top',
					color: '#5B667C',
					fontSize: 14,
					fontWeight: 700,
					formatter: ({ value }: { value: number }) => formatNumber(Number(value), decimals),
				},
			},
		],
	};
});

const formatCellValue = (column: TableColumnConfig, row: ItemizedTableRow) => {
	const value = column.formatter ? column.formatter(row) : row[column.key];
	if (value === null || value === undefined || value === '') return '--';
	return String(value);
};

const resolveCellClass = (column: TableColumnConfig, row: ItemizedTableRow) => {
	if (!column.cellClass) return '';
	if (typeof column.cellClass === 'function') return column.cellClass(row) || '';
	return column.cellClass;
};

const getStatusMeta = (status: string) => props.table.statusMap?.[status] ?? { label: status, className: 'itemized-status-tag--default' };

const getEfficiencyValue = (row: ItemizedTableRow, key: string) => {
	const value = row[key];
	if (typeof value === 'number') return Math.min(100, Math.max(0, value));

	const text = String(value ?? '').trim();
	const parsed = Number(text.replace(/[^0-9.-]/g, ''));
	if (!Number.isFinite(parsed)) return 0;
	return Math.min(100, Math.max(0, parsed));
};

const getEfficiencyFillStyle = (row: ConfigurableRow) => ({
	width: `${getEfficiencyValue(row, String(row.efficiencyField || ''))}%`,
	background: trendPrimaryColor.value,
});

const handleHeaderAction = () => {
	if (!props.table.headerAction?.onClick) return;
	void props.table.headerAction.onClick();
};

const handleActionClick = (action: string, row: ItemizedTableRow) => {
	if (!props.table.onActionClick) return;
	void props.table.onActionClick(action, row);
};

const handleCurrentChange = (page: number) => {
	if (props.table.onPageChange) {
		void props.table.onPageChange(page);
		return;
	}
	currentPage.value = page;
};

const handleSizeChange = (size: number) => {
	if (props.table.onPageSizeChange) {
		void props.table.onPageSizeChange(size);
		return;
	}
	pageSize.value = size;
	currentPage.value = 1;
};
</script>

<style scoped lang="scss">
.itemized-system-panel {
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

.panel-card__title-block h4 {
	margin: 0;
	font-size: 17px;
	font-weight: 700;
	color: var(--theme-text-system);
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
.panel-chart--secondary {
	height: 340px;
}

.panel-card--secondary {
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

.panel-card--table {
	padding-top: 18px;
	padding-bottom: 16px;
	overflow: visible;
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

.efficiency-cell {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.efficiency-cell__track {
	width: 36px;
	height: 10px;
	border-radius: 999px;
	background: #eef2f7;
	overflow: hidden;
}

.efficiency-cell__fill {
	height: 100%;
	border-radius: inherit;
	background: var(--dashboard-primary, #0094ff);
}

.efficiency-cell__icon {
	font-size: 16px;
	color: #39b54a;
}

.efficiency-cell__icon.is-danger {
	color: #f85a5a;
}

.cell-text--success {
	color: #46b538;
	font-weight: 700;
}

.cell-text--warning {
	color: #e98a1d;
	font-weight: 700;
}

.cell-text--danger {
	color: #f85a5a;
	font-weight: 700;
}

:deep(.itemized-table-wrapper .form-container),
:deep(.itemized-table-wrapper .query-form),
:deep(.itemized-table-wrapper .table-actions-container) {
	display: none;
}

:deep(.itemized-table-wrapper),
:deep(.itemized-table-wrapper .configurable-table-with-form),
:deep(.itemized-table-wrapper .table-container),
:deep(.itemized-table-wrapper .configurable-table-container),
:deep(.itemized-table-wrapper .table-content) {
	height: auto;
	min-height: 0;
	overflow: visible;
}

:deep(.itemized-table-wrapper .el-table) {
	height: auto !important;
}

:deep(.itemized-table-wrapper .el-table__header th.el-table__cell) {
	background: #f6f9fd !important;
	color: #5f6c83 !important;
	font-weight: 700;
}

:deep(.itemized-table-wrapper .el-table__row td.el-table__cell) {
	padding: 9px 0;
}

:deep(.itemized-table-wrapper .pagination-container) {
	display: flex;
	justify-content: flex-end;
	margin-top: 14px;
}

:deep(.itemized-table-wrapper .el-button + .el-button) {
	margin-left: 6px;
}

:deep(.itemized-status-tag) {
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

:deep(.itemized-status-tag.itemized-status-tag--running),
:deep(.itemized-status-tag.itemized-status-tag--on) {
	--el-tag-text-color: #46b538;
	--el-tag-border-color: #46b538;
	--el-tag-bg-color: rgba(70, 181, 56, 0.05);
}

:deep(.itemized-status-tag.itemized-status-tag--standby),
:deep(.itemized-status-tag.itemized-status-tag--off),
:deep(.itemized-status-tag.itemized-status-tag--default) {
	--el-tag-text-color: #7b8794;
	--el-tag-border-color: #cbd5e1;
	--el-tag-bg-color: #f8fafc;
}

:deep(.itemized-status-tag.itemized-status-tag--stop) {
	--el-tag-text-color: #f59e0b;
	--el-tag-border-color: #f59e0b;
	--el-tag-bg-color: rgba(245, 158, 11, 0.05);
}

:deep(.itemized-status-tag.itemized-status-tag--danger) {
	--el-tag-text-color: #f04438;
	--el-tag-border-color: #f04438;
	--el-tag-bg-color: rgba(240, 68, 56, 0.08);
}

@media screen and (max-width: 1680px) {
	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.chart-grid {
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
	.panel-chart--secondary {
		height: 280px;
	}

	.distribution-panel,
	.distribution-panel :deep(.chart) {
		min-height: 280px;
	}

	:deep(.itemized-table-wrapper .pagination-container) {
		justify-content: flex-start;
	}
}
</style>
