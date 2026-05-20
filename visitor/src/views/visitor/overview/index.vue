<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="visitor-overview-scrollbar">
				<div class="visitor-overview home-dashboard" :style="dashboardVars" v-loading="pageState.loading">
					<section class="metric-grid">
						<article class="metric-card" :class="`metric-card--accent-${(index % 5) + 1}`" v-for="(card, index) in dashboardCards" :key="card.key">
							<div class="metric-card__content">
								<p class="metric-card__label">{{ card.label }}</p>
								<div class="metric-card__value">
									<span>{{ card.value }}</span>
									<small>{{ card.helper }}</small>
								</div>
							</div>
							<div class="metric-card__visual">
								<div class="metric-card__icon-shell">
									<SvgIcon :name="card.icon" :size="32" />
								</div>
							</div>
						</article>
					</section>

					<section class="panel-card panel-card--insight">
						<div class="panel-card__title-block">
							<span class="panel-card__bar"></span>
							<div>
								<h3>访客数据概览</h3>
								<p>{{ insightText }}</p>
							</div>
						</div>
					</section>

					<section class="panel-card panel-card--trend">
						<header class="panel-card__header">
							<div class="panel-card__title-block">
								<span class="panel-card__bar"></span>
								<div>
									<h3>访客到访趋势</h3>
									<p>按企业查看最近 15 天的到访波动</p>
								</div>
							</div>

							<div class="panel-card__toolbar">
								<div class="panel-card__toolbar-item" v-for="item in trendToolbarConfig" :key="item.key">
									<component
										:is="item.component"
										v-bind="item.props"
										:model-value="trendFormData[item.field]"
										@update:modelValue="(value: unknown) => handleTrendFieldChange(item.field, value)"
									/>
								</div>
							</div>
						</header>

						<div class="panel-card__chart-wrap" v-if="filteredTrendRecords.length">
							<v-chart ref="trendChartRef" :option="trendChartOption" autoresize class="panel-card__chart" />
						</div>
						<el-empty v-else description="暂无趋势数据" />
					</section>

					<section class="panel-card panel-card--table">
						<header class="panel-card__header">
							<div class="panel-card__title-block">
								<span class="panel-card__bar"></span>
								<div>
									<h3>各企业到访明细（最近5天）</h3>
									<p>展示最近 5 天访客与车辆到访情况</p>
								</div>
							</div>
						</header>

						<el-table :data="trendTableRows" class="visitor-overview__table" row-key="enterpriseCode">
							<el-table-column
								v-for="column in trendTableColumns"
								:key="column.prop"
								:prop="column.prop"
								:label="column.label"
								:min-width="column.minWidth"
								:fixed="column.type === 'enterprise' ? 'left' : false"
							>
								<template #default="{ row }">
									<div v-if="column.type === 'enterprise'" class="visitor-overview__enterprise-cell">
										<span class="visitor-overview__enterprise-dot" :style="{ backgroundColor: getEnterpriseColor(row) }"></span>
										<span>{{ row.enterpriseName }}</span>
									</div>
									<div v-else class="visitor-overview__metric-cell">
										<div class="visitor-overview__metric-main">{{ getMetricItem(row, column.prop).visitorCount }}人</div>
										<div class="visitor-overview__metric-sub">
											<SvgIcon name="ele-Van" :size="12" />
											<span>{{ getMetricItem(row, column.prop).vehicleCount }}</span>
										</div>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</section>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="visitorOverview">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { registerChart, removeChartInstance } from '/@/utils/echartsUtils';
import { getVisitorOverviewData, type TrendMetricKey, type VisitorMetricItem, type VisitorOverviewPayload } from './api';
import { createTrendToolbarConfig, dashboardCardConfigs } from './index';
import {
	buildDashboardCards,
	buildInsightText,
	buildTrendChartOption,
	buildTrendTableColumns,
	buildTrendTableRows,
	filterTrendRecordsByRange,
} from './useBizProcess';

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const trendChartRef = ref();
const overviewData = ref<VisitorOverviewPayload>();

const pageState = reactive({
	loading: false,
});

const trendFormData = reactive<Record<string, any>>({
	metric: 'visitorCount' as TrendMetricKey,
	dateRange: [] as string[],
});

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { hexToRgb, getDarkColor, getLightColor } = useChangeColor();

const currentTheme = computed(() => themeConfig.value.currentTheme);
const primaryColor = computed(() => themeConfig.value.primary || currentTheme.value?.color?.primary?.normal || '#1677FF');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.12));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);
const chartPalette = computed(() => currentTheme.value?.color?.chart || [primaryColor.value, '#00CAE8', '#E98A1D', '#E8BB19', '#BD74E6']);

const dashboardVars = computed(() => {
	const primary = primaryColor.value;
	const isGreenSkin = themeConfig.value.skin === 'light-green';
	const primaryRgbArr = hexToRgb(primary);
	return {
		'--dashboard-primary': primary,
		'--dashboard-primary-deep': getDarkColor(primary, 0.12),
		'--dashboard-primary-soft': getLightColor(primary, 0.84),
		'--dashboard-primary-softer': getLightColor(primary, 0.92),
		'--dashboard-primary-rgb': Array.isArray(primaryRgbArr) ? primaryRgbArr.join(',') : '22, 119, 255',
		'--dashboard-gradient-start': gradientStart.value,
		'--dashboard-gradient-end': gradientEnd.value,
		'--dashboard-chart-0': chartPalette.value[0],
		'--dashboard-chart-1': chartPalette.value[1],
		'--dashboard-chart-2': chartPalette.value[2],
		'--dashboard-chart-3': chartPalette.value[3],
		'--dashboard-chart-4': chartPalette.value[4],
		'--dashboard-title-bar-color': isGreenSkin ? '#4BA6A9' : '#1677FF',
		'--dashboard-title-bar-shadow': isGreenSkin ? '0px 4px 10px 0px rgba(75,166,169,0.2)' : '0px 4px 10px 0px rgba(0, 148, 255, 0.2)',
	};
});

const trendToolbarConfig = computed(() => createTrendToolbarConfig());

const dashboardCards = computed(() => {
	if (!overviewData.value) return [];
	return buildDashboardCards(overviewData.value.summary, dashboardCardConfigs);
});

const filteredTrendRecords = computed(() => {
	if (!overviewData.value) return [];
	return filterTrendRecordsByRange(overviewData.value.trendRecords, trendFormData.dateRange);
});

const insightText = computed(() => {
	if (!overviewData.value) return '';
	return buildInsightText(overviewData.value.summary, overviewData.value.enterprises.length);
});

const trendChartOption = computed(() => {
	if (!overviewData.value) return {};
	return buildTrendChartOption(filteredTrendRecords.value, overviewData.value.enterprises, trendFormData.metric);
});

const trendTableColumns = computed(() => buildTrendTableColumns(filteredTrendRecords.value.slice(-5)));

const trendTableRows = computed(() => {
	if (!overviewData.value) return [];
	return buildTrendTableRows(filteredTrendRecords.value.slice(-5), overviewData.value.enterprises);
});

const handleTrendFieldChange = (field: string, value: unknown) => {
	trendFormData[field] = value;
};

const getMetricItem = (row: Record<string, any>, prop: string): VisitorMetricItem => {
	return row[prop] || { visitorCount: 0, vehicleCount: 0 };
};

const getEnterpriseColor = (row: Record<string, any>) => {
	return row.color || 'var(--dashboard-primary)';
};

const registerTrendChart = async () => {
	await nextTick();
	if (trendChartRef.value?.chart) {
		registerChart(trendChartRef.value.chart);
	}
};

const loadOverviewData = async () => {
	pageState.loading = true;
	try {
		const res = await getVisitorOverviewData();
		overviewData.value = res.data;
		trendFormData.metric = res.data.defaultMetric;
		trendFormData.dateRange = [...res.data.defaultDateRange];
		await registerTrendChart();
	} finally {
		pageState.loading = false;
	}
};

onMounted(() => {
	loadOverviewData();
});

onUnmounted(() => {
	if (trendChartRef.value?.chart) {
		removeChartInstance(trendChartRef.value.chart);
	}
});
</script>

<style scoped lang="scss">
.visitor-overview-scrollbar {
	height: 100%;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.visitor-overview.home-dashboard {
	min-height: 100%;
	padding: 8px 0 10px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	background: transparent;
}

.metric-grid {
	display: grid;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	width: 100%;
	align-items: stretch;
	gap: clamp(12px, 0.83333vw, 16px);
}

.metric-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 72px;
	align-items: center;
	height: 110px;
	padding: clamp(14px, 0.83333vw, 16px) clamp(16px, 1.04167vw, 20px);
	border-radius: clamp(16px, 1.04167vw, 20px);
	background: #ffffff;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
	box-shadow: 0 10px 24px rgba(var(--dashboard-primary-rgb), 0.06);
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(var(--metric-card-accent-rgb), 0.08), rgba(var(--metric-card-accent-rgb), 0.02));
		pointer-events: none;
	}
}

.metric-card__content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: clamp(4px, 0.3125vw, 6px);
	min-width: 0;
}

.metric-card__label {
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-primaryTitle, #333333);
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
	color: var(--theme-text-system, #000f2c);
}

.metric-card__value small {
	margin-bottom: 3px;
	font-size: clamp(12px, 0.72917vw, 14px);
	font-weight: 600;
	color: var(--theme-text-dataAssist, #566073);
}

.metric-card__visual {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
}

.metric-card__icon-shell {
	width: 56px;
	height: 56px;
	border-radius: 16px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: var(--metric-card-accent, var(--dashboard-primary));
	background: rgba(var(--metric-card-accent-rgb), 0.14);
}

.metric-card--accent-1 {
	--metric-card-accent: var(--dashboard-primary);
	--metric-card-accent-rgb: var(--dashboard-primary-rgb);
}

.metric-card--accent-2 {
	--metric-card-accent: var(--dashboard-chart-1, #00cae8);
	--metric-card-accent-rgb: 0, 202, 232;
}

.metric-card--accent-3 {
	--metric-card-accent: var(--dashboard-chart-2, #e98a1d);
	--metric-card-accent-rgb: 233, 138, 29;
}

.metric-card--accent-4 {
	--metric-card-accent: var(--dashboard-chart-4, #bd74e6);
	--metric-card-accent-rgb: 189, 116, 230;
}

.metric-card--accent-5 {
	--metric-card-accent: var(--dashboard-chart-3, #e8bb19);
	--metric-card-accent-rgb: 232, 187, 25;
}

.panel-card {
	position: relative;
	padding: 24px;
	border-radius: 20px;
	background: #ffffff;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
	box-shadow: 0 12px 28px rgba(var(--dashboard-primary-rgb), 0.04);
	overflow: hidden;
}

.panel-card--insight {
	background: linear-gradient(135deg, rgba(var(--dashboard-primary-rgb), 0.08), rgba(var(--dashboard-primary-rgb), 0.02));
	border-color: rgba(var(--dashboard-primary-rgb), 0.14);
}

.panel-card--insight .panel-card__title-block p {
	max-width: none;
	white-space: normal;
}

.panel-card__header {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 20px;
}

.panel-card__title-block {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	min-width: 0;
}

.panel-card__bar {
	flex: none;
	width: 4px;
	height: 22px;
	margin-top: 4px;
	border-radius: 999px;
	background: var(--dashboard-title-bar-color, #1677ff);
	box-shadow: var(--dashboard-title-bar-shadow, 0px 4px 10px 0px rgba(0, 148, 255, 0.2));
}

.panel-card__title-block h3 {
	font-size: 18px;
	line-height: 1.2;
	font-weight: 700;
	color: var(--theme-text-system, #000f2c);
	margin: 0;
}

.panel-card__title-block p {
	margin-top: 6px;
	font-size: 13px;
	color: var(--theme-text-dataAssist, #566073);
}

.panel-card__toolbar {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 12px;
}

.panel-card__toolbar-item {
	min-width: 180px;

	:deep(.el-segmented) {
		--el-segmented-item-selected-bg-color: var(--dashboard-primary);
		--el-segmented-item-selected-color: #ffffff;
		background: rgba(var(--dashboard-primary-rgb), 0.06);
		border-radius: 12px;
		padding: 4px;
	}

	:deep(.el-date-editor.el-input__wrapper),
	:deep(.el-date-editor .el-input__wrapper) {
		border-radius: 12px;
		box-shadow: 0 0 0 1px rgba(var(--dashboard-primary-rgb), 0.14) inset;
	}
}

.panel-card__chart-wrap {
	height: 360px;
}

.panel-card__chart {
	width: 100%;
	height: 100%;
}

.visitor-overview__table {
	:deep(th.el-table__cell) {
		background: rgba(var(--dashboard-primary-rgb), 0.04);
		color: var(--theme-text-dataAssist, #566073);
		font-weight: 600;
	}

	:deep(.el-table__row td.el-table__cell) {
		padding-top: 14px;
		padding-bottom: 14px;
	}
}

.visitor-overview__enterprise-cell {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	font-weight: 600;
	color: var(--theme-text-system, #000f2c);
}

.visitor-overview__enterprise-dot {
	width: 10px;
	height: 10px;
	border-radius: 999px;
	flex-shrink: 0;
}

.visitor-overview__metric-cell {
	text-align: center;
}

.visitor-overview__metric-main {
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-system, #000f2c);
	line-height: 1.2;
}

.visitor-overview__metric-sub {
	margin-top: 4px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: var(--theme-text-dataAssist, #566073);
}

@media (max-width: 1440px) {
	.metric-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (max-width: 992px) {
	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.panel-card__header {
		flex-direction: column;
		align-items: flex-start;
	}

	.panel-card__toolbar {
		width: 100%;
		justify-content: flex-start;
	}

	.panel-card__chart-wrap {
		height: 300px;
	}
}

@media (max-width: 640px) {
	.metric-grid {
		grid-template-columns: 1fr;
	}
}
</style>
