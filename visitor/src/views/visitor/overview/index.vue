<template>
	<div class="layout-padding visitor-overview">
		<div class="layout-padding-auto layout-padding-view visitor-overview__body" v-loading="pageState.loading">
			<section class="visitor-overview__cards">
				<article
					class="visitor-overview__card"
					:class="`visitor-overview__card--${card.accent}`"
					v-for="card in dashboardCards"
					:key="card.key"
				>
					<div class="visitor-overview__card-main">
						<div class="visitor-overview__card-label">{{ card.label }}</div>
						<div class="visitor-overview__card-value">{{ card.value }}</div>
						<div class="visitor-overview__card-helper">{{ card.helper }}</div>
					</div>
					<div class="visitor-overview__card-icon">
						<SvgIcon :name="card.icon" :size="20" />
					</div>
				</article>
			</section>

			<section class="visitor-overview__insight">
				<div class="visitor-overview__insight-icon">
					<SvgIcon name="ele-TrendCharts" :size="18" />
				</div>
				<div class="visitor-overview__insight-content">
					<div class="visitor-overview__insight-title">访客数据概览</div>
					<div class="visitor-overview__insight-text">{{ insightText }}</div>
				</div>
			</section>

			<section class="visitor-overview__panel">
				<header class="visitor-overview__panel-header">
					<div>
						<div class="visitor-overview__panel-title">
							<SvgIcon name="ele-DataAnalysis" :size="16" />
							<span>访客到访趋势</span>
						</div>
						<div class="visitor-overview__panel-subtitle">按企业查看最近 15 天的到访波动</div>
					</div>

					<div class="visitor-overview__toolbar">
						<div class="visitor-overview__toolbar-item" v-for="item in trendToolbarConfig" :key="item.key">
							<component
								:is="item.component"
								v-bind="item.props"
								:model-value="trendFormData[item.field]"
								@update:modelValue="(value: unknown) => handleTrendFieldChange(item.field, value)"
							/>
						</div>
					</div>
				</header>

				<div class="visitor-overview__chart-wrap" v-if="filteredTrendRecords.length">
					<v-chart ref="trendChartRef" :option="trendChartOption" autoresize class="visitor-overview__chart" />
				</div>
				<el-empty v-else description="暂无趋势数据" />
			</section>

			<section class="visitor-overview__panel">
				<header class="visitor-overview__panel-header">
					<div>
						<div class="visitor-overview__panel-title">
							<SvgIcon name="ele-Document" :size="16" />
							<span>各企业到访明细（最近5天）</span>
						</div>
						<div class="visitor-overview__panel-subtitle">展示最近 5 天访客与车辆到访情况</div>
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

	</div>
</template>

<script setup lang="ts" name="visitorOverview">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
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
	return row.color || '#cbd5e1';
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
.visitor-overview {
	height: auto;

	&__body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		background:
			radial-gradient(circle at top left, rgba(236, 72, 153, 0.06), transparent 28%),
			radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 28%),
			#f8fafc;
		border-radius: 22px;
		border: 1px solid #eef2f7;
		overflow: auto;
	}

	&__cards {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 14px;
	}

	&__card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 18px 16px;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(226, 232, 240, 0.9);
		box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
	}

	&__card-main {
		min-width: 0;
	}

	&__card-label {
		font-size: 13px;
		color: #64748b;
		margin-bottom: 6px;
	}

	&__card-value {
		font-size: 24px;
		line-height: 1.1;
		font-weight: 700;
		color: #0f172a;
	}

	&__card-helper {
		margin-top: 4px;
		font-size: 12px;
		color: #94a3b8;
	}

	&__card-icon {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	&__card--pink .visitor-overview__card-icon {
		color: #ec4899;
		background: rgba(244, 114, 182, 0.14);
	}

	&__card--blue .visitor-overview__card-icon {
		color: #3b82f6;
		background: rgba(96, 165, 250, 0.15);
	}

	&__card--green .visitor-overview__card-icon {
		color: #65a30d;
		background: rgba(132, 204, 22, 0.14);
	}

	&__card--violet .visitor-overview__card-icon {
		color: #8b5cf6;
		background: rgba(167, 139, 250, 0.14);
	}

	&__card--amber .visitor-overview__card-icon {
		color: #f59e0b;
		background: rgba(251, 191, 36, 0.14);
	}

	&__insight {
		width: 100%;
		padding: 18px 20px;
		border-radius: 18px;
		display: flex;
		align-items: center;
		gap: 16px;
		text-align: left;
		background: linear-gradient(135deg, rgba(244, 114, 182, 0.1), rgba(124, 58, 237, 0.08));
		border: 1px solid rgba(255, 255, 255, 0.7);
	}

	&__insight-icon {
		width: 42px;
		height: 42px;
		border-radius: 14px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #ec4899;
		background: rgba(255, 255, 255, 0.72);
	}

	&__insight-content {
		flex: 1;
		min-width: 0;
	}

	&__insight-title {
		font-size: 15px;
		font-weight: 700;
		color: #1e293b;
		margin-bottom: 4px;
	}

	&__insight-text {
		font-size: 13px;
		line-height: 1.6;
		color: #64748b;
	}

	&__panel {
		padding: 18px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(226, 232, 240, 0.9);
		box-shadow: 0 12px 34px rgba(15, 23, 42, 0.04);
	}

	&__panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 18px;
	}

	&__panel-title {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		font-weight: 700;
		color: #1e293b;
	}

	&__panel-subtitle {
		margin-top: 6px;
		font-size: 12px;
		color: #94a3b8;
	}

	&__toolbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 12px;
	}

	&__toolbar-item {
		min-width: 180px;
	}

	&__chart-wrap {
		height: 360px;
	}

	&__chart {
		width: 100%;
		height: 100%;
	}

	&__table {
		:deep(th.el-table__cell) {
			background: #f8fafc;
			color: #94a3b8;
			font-weight: 600;
		}

		:deep(.el-table__row td.el-table__cell) {
			padding-top: 14px;
			padding-bottom: 14px;
		}
	}

	&__enterprise-cell {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-weight: 600;
		color: #334155;
	}

	&__enterprise-dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		flex-shrink: 0;
	}

	&__metric-cell {
		text-align: center;
	}

	&__metric-main {
		font-size: 14px;
		font-weight: 700;
		color: #334155;
		line-height: 1.2;
	}

	&__metric-sub {
		margin-top: 4px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #94a3b8;
	}
}

@media (max-width: 1440px) {
	.visitor-overview {
		&__cards {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
}

@media (max-width: 992px) {
	.visitor-overview {
		&__body {
			padding: 16px;
		}

		&__cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		&__panel-header {
			flex-direction: column;
			align-items: flex-start;
		}

		&__toolbar {
			width: 100%;
			justify-content: flex-start;
		}

		&__chart-wrap {
			height: 300px;
		}
	}
}

@media (max-width: 640px) {
	.visitor-overview {
		&__cards {
			grid-template-columns: 1fr;
		}

		&__insight {
			flex-wrap: wrap;
		}
	}
}
</style>
