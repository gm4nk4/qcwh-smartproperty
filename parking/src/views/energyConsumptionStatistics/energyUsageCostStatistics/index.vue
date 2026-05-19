<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="cost-dashboard-scrollbar">
				<div class="cost-dashboard" :style="dashboardVars">
					<section class="cost-toolbar">
						<div class="cost-toolbar__tabs">
							<button
								v-for="item in primaryTabOptions"
								:key="item.value"
								type="button"
								class="cost-toolbar__tab"
								:class="{ 'is-active': activePrimaryTab === item.value }"
								@click="activePrimaryTab = item.value"
							>
								{{ item.label }}
							</button>
						</div>

						<div v-if="isOverviewTab" class="cost-toolbar__filters">
							<div class="filter-pill-group">
								<button
									v-for="item in overviewDateTypeOptions"
									:key="item.value"
									type="button"
									class="filter-pill"
									:class="{ 'is-active': overviewDateType === item.value }"
									@click="overviewDateType = item.value"
								>
									{{ item.label }}
								</button>
							</div>
							<el-date-picker
								v-model="overviewDateValue"
								:type="overviewPickerType"
								:value-format="overviewPickerValueFormat"
								:clearable="false"
								:editable="false"
								:placeholder="overviewPickerPlaceholder"
								class="cost-toolbar__date-picker"
							/>
						</div>

						<div v-else class="cost-toolbar__filters">
							<div class="filter-pill-group">
								<button
									v-for="item in utilityTimeRangeOptions"
									:key="item.value"
									type="button"
									class="filter-pill"
									:class="{ 'is-active': utilityTimeRange === item.value }"
									@click="utilityTimeRange = item.value"
								>
									{{ item.label }}
								</button>
							</div>
						</div>
					</section>

					<section class="metric-grid">
						<article
							v-for="metric in currentMetricCards"
							:key="metric.key"
							class="metric-card"
							:class="{
								'metric-card--overview': isOverviewTab,
								'metric-card--overview-total': metric.cardMode === 'overview-total',
								'metric-card--overview-share': metric.cardMode === 'overview-share',
								'metric-card--utility-summary': metric.cardMode === 'utility-summary',
							}"
							:style="getMetricCardStyle(metric)"
						>
							<div class="metric-card__content">
								<p class="metric-card__label">{{ metric.label }}</p>
								<div class="metric-card__value">
									<span>{{ metric.displayValue }}</span>
									<small>{{ metric.unit }}</small>
								</div>
								<div v-if="metric.cardMode === 'overview-total'" class="metric-card__compare">
									<span
										class="metric-card__compare-icon"
										:class="{ 'is-up': (metric.compareRate ?? 0) > 0, 'is-down': (metric.compareRate ?? 0) <= 0 }"
									></span>
									<span class="metric-card__compare-label">{{ metric.compareLabel }}</span>
									<span class="metric-card__compare-value" :class="getCostRateClass(metric.compareRate)">
										{{ formatSignedPercent(metric.compareRate) }}
									</span>
								</div>
								<div v-else-if="metric.cardMode === 'overview-share'" class="metric-card__share-row">
									<span class="metric-card__share-label">
										占比
										<strong>{{ metric.sharePercentText }}</strong>
									</span>
									<div class="metric-card__progress metric-card__progress--inline">
										<span :style="{ width: `${Math.round(metric.progressRatio * 100)}%` }"></span>
									</div>
								</div>
								<div v-else-if="metric.cardMode === 'utility-summary'" class="metric-card__summary-spacer"></div>
								<div v-else class="metric-card__footer">
									<template v-if="metric.compareRate !== null">
										<span class="metric-card__footer-label">{{ metric.compareLabel }}</span>
										<span class="metric-card__trend" :class="getCostRateClass(metric.compareRate)">
											<el-icon>
												<ArrowDown v-if="metric.compareRate <= 0" />
												<ArrowUp v-else />
											</el-icon>
											<span>{{ formatSignedPercent(metric.compareRate) }}</span>
										</span>
									</template>
									<span v-else class="metric-card__footnote">{{ metric.footnote }}</span>
								</div>
								<div v-if="metric.cardMode === 'default'" class="metric-card__progress">
									<span :style="{ width: `${Math.round(metric.progressRatio * 100)}%` }"></span>
								</div>
							</div>
							<div class="metric-card__visual">
								<div class="metric-card__icon-shell">
									<img :src="metric.icon" :alt="metric.label" class="metric-card__icon" />
								</div>
							</div>
						</article>
					</section>

					<template v-if="isOverviewTab">
						<section class="dashboard-grid dashboard-grid--primary">
							<article class="panel-card panel-card--trend" v-loading="overviewLoading">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>费用趋势</h3>
											<p>{{ overviewTrendSubtitle }}</p>
										</div>
									</div>
								</header>
								<v-chart class="panel-chart panel-chart--trend" :option="overviewTrendOption" autoresize />
							</article>

							<article class="panel-card panel-card--structure" v-loading="overviewLoading">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>费用结构</h3>
											<p>电 / 水 / 气费用占比</p>
										</div>
									</div>
								</header>
								<div v-if="hasOverviewStructureData" class="structure-panel structure-panel--legend-bottom">
									<PieChartComponent
										:data="overviewStructureChartData"
										title="费用占比"
										:legend-data="overviewStructureLegendNames"
										unit="元"
										legend-position="bottom"
										:center="['50%', '44%']"
										:radius="['68%', '80%']"
									/>
								</div>
								<el-empty v-else description="暂无费用结构数据" />
							</article>
						</section>

						<section class="dashboard-grid dashboard-grid--secondary">
							<article class="panel-card panel-card--peak" v-loading="overviewLoading">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>峰平谷电费统计</h3>
											<p>峰段 / 平段 / 谷段费用占比</p>
										</div>
									</div>
								</header>
								<div v-if="hasPeakStructureData" class="structure-panel">
									<PieChartComponent :data="peakStructureChartData" title="峰平谷占比" :legend-data="peakStructureLegendNames" unit="元" />
								</div>
								<el-empty v-else description="暂无峰平谷数据" />
							</article>

							<HorizontalBarChart
								v-loading="overviewLoading"
								class="panel-card panel-card--ranking"
								:yAxisData="rankingYAxisData"
								:data="rankingSeriesData"
								:title="rankingTitle"
								seriesName="费用"
								xAxisName="元"
							/>
						</section>

						<section class="dashboard-grid dashboard-grid--analysis">
							<ComparisonBarChart
								v-loading="overviewLoading"
								class="analysis-comparison"
								title="同比分析"
								y-axis-name="费用(元)"
								last-series-name="去年同期"
								current-series-name="本期"
								mode="double"
								:last-year-data="yoyReferenceSeriesData"
								:current-year-data="comparisonCurrentSeriesData"
								:x-axis-data="overviewComparisonCategories"
								:last-series-colors="['#A7BBCE', '#EDF3FA']"
								:current-series-colors="['#2C79E9', '#D6E3F8']"
								double-bar-gap="18%"
							/>

							<ComparisonBarChart
								v-loading="overviewLoading"
								class="analysis-comparison"
								title="环比分析"
								y-axis-name="费用(元)"
								last-series-name="上期"
								current-series-name="本期"
								mode="double"
								:last-year-data="momReferenceSeriesData"
								:current-year-data="comparisonCurrentSeriesData"
								:x-axis-data="overviewComparisonCategories"
								double-bar-gap="18%"
							/>
						</section>

						<section class="panel-card panel-card--table">
							<header class="panel-card__header panel-card__header--table">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
									<div>
										<h3>费用明细</h3>
									</div>
								</div>

								<div class="panel-card__actions">
									<el-button class="table-export-btn" :loading="exportLoading" @click="handleExport">
										<el-icon><Download /></el-icon>
										<span>导出Excel</span>
									</el-button>
								</div>
							</header>

							<div class="table-shell" v-loading="detailLoading">
								<el-table :data="detailRows" class="detail-table" border empty-text="暂无费用明细">
									<el-table-column prop="periodLabel" label="时间" min-width="110" />
									<el-table-column label="用能" width="88">
										<template #default="{ row }">
											<span class="energy-type-tag" :class="getEnergyTypeTagClass(row.energyTypeCode)">
												{{ row.energyTypeName }}
											</span>
										</template>
									</el-table-column>
									<el-table-column label="用量" min-width="150">
										<template #default="{ row }">
											{{ formatUsageValue(row.usageAmount, row.usageUnit) }}
										</template>
									</el-table-column>
									<el-table-column label="综合单价(元)" min-width="140">
										<template #default="{ row }">
											{{ formatPriceValue(row.avgUnitPrice, row.unitPriceUnit) }}
										</template>
									</el-table-column>
									<el-table-column label="费用(元)" min-width="130">
										<template #default="{ row }">
											<span class="cost-amount">{{ formatCurrencyNumber(row.costAmount) }}</span>
										</template>
									</el-table-column>
									<el-table-column label="同比" width="110">
										<template #default="{ row }">
											<span class="rate-tag" :class="getCostRateClass(row.yoyRate)">
												{{ formatSignedPercent(row.yoyRate) }}
											</span>
										</template>
									</el-table-column>
									<el-table-column label="环比" width="110">
										<template #default="{ row }">
											<span class="rate-tag" :class="getCostRateClass(row.momRate)">
												{{ formatSignedPercent(row.momRate) }}
											</span>
										</template>
									</el-table-column>
									<el-table-column prop="zoneName" label="分区" min-width="110" />
									<el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
								</el-table>

								<div class="table-pagination">
									<span class="table-pagination__total">共 {{ detailPageData.total }} 条</span>
									<el-pagination
										background
										layout="sizes, prev, pager, next, jumper"
										:total="detailPageData.total"
										:page-size="detailQuery.pageSize"
										:current-page="detailQuery.pageNum"
										:page-sizes="[10, 20, 50, 100]"
										@current-change="handleCurrentPageChange"
										@size-change="handlePageSizeChange"
									/>
								</div>
							</div>
						</section>
					</template>

					<template v-else>
						<section class="dashboard-grid dashboard-grid--utility">
							<article class="panel-card panel-card--trend panel-card--utility-trend" v-loading="utilityLoading">
								<header class="panel-card__header panel-card__header--utility">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>{{ utilityTrendTitle }}</h3>
										</div>
									</div>
									<div class="panel-card__actions">
										<div class="filter-pill-group filter-pill-group--compact">
											<button
												v-for="item in utilityChartTypeOptions"
												:key="item.value"
												type="button"
												class="filter-pill"
												:class="{ 'is-active': utilityChartType === item.value }"
												@click="utilityChartType = item.value"
											>
												{{ item.label }}
											</button>
										</div>
									</div>
								</header>
								<ComparisonBarChart
									v-if="utilityChartType === 'bar'"
									class="utility-phase-comparison"
									title=""
									y-axis-name="费用(万元)"
									mode="single"
									:single-series-name="currentUtilityCostLabel"
									:last-year-data="[]"
									:current-year-data="utilityBarSeriesData"
									:x-axis-data="utilityBarXAxisData"
								/>
								<v-chart v-else class="panel-chart panel-chart--utility" :option="utilityTrendOption" autoresize />
							</article>

							<article class="panel-card panel-card--structure panel-card--utility-structure" v-loading="utilityLoading">
								<header class="panel-card__header panel-card__header--utility">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>费用结构</h3>
										</div>
									</div>
								</header>
								<div v-if="hasUtilityStructureData" class="structure-panel structure-panel--legend-bottom">
									<PieChartComponent
										:data="utilityStructureChartData"
										title="费用占比"
										:legend-data="utilityStructureLegendNames"
										unit="元"
										legend-position="bottom"
										:center="['50%', '44%']"
										:radius="['68%', '80%']"
									/>
								</div>
								<el-empty v-else description="暂无结构数据" />
							</article>
						</section>
					</template>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="energyUsageCostStatistics">
import { computed, reactive, ref, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import VChart from 'vue-echarts';
import { ArrowDown, ArrowUp, Download } from '@element-plus/icons-vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { handleBlobFile } from '/@/utils/other';
import { useThemeImage } from '/@/utils/themeImages';
import { useMessage } from '/@/hooks/message';
import ComparisonBarChart from '/@/views/energyEfficiencyAnalysis/lossAnalysis/comparisonBarChart.vue';
import HorizontalBarChart from '/@/components/Chart/horizontalBarChart.vue';
import PieChartComponent from '/@/components/Chart/pieChart.vue';
import {
	exportEnergyCostDetail,
	getEnergyCostDetailPage,
	getEnergyCostStats,
	getEnergyUtilityCost,
	isEnergyUsageCostStatisticsMockEnabled,
	type EnergyCostDateType,
	type EnergyCostDetailPageData,
	type EnergyCostDetailPageRecord,
	type EnergyCostEnergyTypeCode,
	type EnergyCostStatType,
	type EnergyCostStatsData,
	type EnergyCostTimeRange,
	type EnergyCostTrendRecord,
	type EnergyUtilityCostData,
} from '/@/api/energy/energyUsageCostStatistics';

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent]);

type PrimaryTabKey = 'overview' | 'electricity' | 'water' | 'gas';
type UtilityChartType = 'line' | 'bar' | 'area';
type UtilityEnergyTabKey = Exclude<PrimaryTabKey, 'overview'>;
type EnergyTrendValueKey = keyof Pick<EnergyCostTrendRecord, 'elecCost' | 'waterCost' | 'gasCost'>;

interface MetricCardItem {
	key: string;
	label: string;
	displayValue: string;
	unit: string;
	cardMode?: 'overview-total' | 'overview-share' | 'default' | 'utility-summary';
	compareLabel?: string;
	compareRate: number | null;
	footnote?: string;
	sharePercentText?: string;
	progressRatio: number;
	icon: string;
	accent: string;
}

interface RingItem {
	key: string;
	label: string;
	value: number;
	displayValue: string;
	unit: string;
	ratio: number;
	color: string;
}

const primaryTabOptions: Array<{ label: string; value: PrimaryTabKey }> = [
	{ label: '用能费用总览', value: 'overview' },
	{ label: '用电费用总览', value: 'electricity' },
	{ label: '用水费用总览', value: 'water' },
	{ label: '用气费用总览', value: 'gas' },
];

const overviewDateTypeOptions: Array<{ label: string; value: EnergyCostDateType }> = [
	{ label: '日', value: 'DAY' },
	{ label: '月', value: 'MONTH' },
	{ label: '年', value: 'YEAR' },
];

const utilityTimeRangeOptions: Array<{ label: string; value: EnergyCostTimeRange }> = [
	{ label: '近30天', value: '30d' },
	{ label: '近90天', value: '90d' },
	{ label: '近180天', value: '180d' },
	{ label: '近1年', value: '1y' },
];

const utilityChartTypeOptions: Array<{ label: string; value: UtilityChartType }> = [
	{ label: '折线图', value: 'line' },
	{ label: '柱状图', value: 'bar' },
	{ label: '面积图', value: 'area' },
];

const overviewDateTypeToStatTypeMap: Record<EnergyCostDateType, EnergyCostStatType> = {
	DAY: 'day',
	MONTH: 'month',
	YEAR: 'year',
};

const utilityTabMeta = {
	electricity: {
		label: '用电',
		totalKey: 'totalElec',
		costKey: 'elecCost',
		priceKey: 'elecPrice',
		trendKey: 'elecCost',
	},
	water: {
		label: '用水',
		totalKey: 'totalWater',
		costKey: 'waterCost',
		priceKey: 'waterPrice',
		trendKey: 'waterCost',
	},
	gas: {
		label: '用气',
		totalKey: 'totalGas',
		costKey: 'gasCost',
		priceKey: 'gasPrice',
		trendKey: 'gasCost',
	},
} satisfies Record<
	UtilityEnergyTabKey,
	{
		label: string;
		totalKey: keyof Pick<EnergyUtilityCostData, 'totalElec' | 'totalWater' | 'totalGas'>;
		costKey: keyof Pick<EnergyUtilityCostData, 'elecCost' | 'waterCost' | 'gasCost'>;
		priceKey: keyof Pick<EnergyUtilityCostData, 'elecPrice' | 'waterPrice' | 'gasPrice'>;
		trendKey: EnergyTrendValueKey;
	}
>;

const activePrimaryTab = ref<PrimaryTabKey>('overview');
const overviewDateType = ref<EnergyCostDateType>('MONTH');
const utilityTimeRange = ref<EnergyCostTimeRange>('30d');
const utilityChartTypeState = reactive<Record<UtilityEnergyTabKey, UtilityChartType>>({
	electricity: 'line',
	water: 'bar',
	gas: 'bar',
});

const padNumber = (value: number) => String(value).padStart(2, '0');
const getDefaultPickerValue = (dateType: EnergyCostDateType) => {
	const now = new Date();
	const year = now.getFullYear();
	const month = padNumber(now.getMonth() + 1);
	const day = padNumber(now.getDate());
	if (dateType === 'YEAR') return `${year}`;
	if (dateType === 'MONTH') return `${year}-${month}`;
	return `${year}-${month}-${day}`;
};

const overviewDateValue = ref(getDefaultPickerValue(overviewDateType.value));

const detailQuery = reactive({
	pageNum: 1,
	pageSize: 10,
});

const overviewData = ref<EnergyCostStatsData | null>(null);
const utilityData = ref<EnergyUtilityCostData | null>(null);
const detailPageData = ref<EnergyCostDetailPageData>({
	total: 0,
	pageNum: 1,
	pageSize: 10,
	list: [],
});

const overviewLoading = ref(false);
const utilityLoading = ref(false);
const detailLoading = ref(false);
const exportLoading = ref(false);

let overviewRequestToken = 0;
let utilityRequestToken = 0;
let detailRequestToken = 0;

const message = useMessage();
const storesThemeConfig = useThemeConfig();
const { getDarkColor, getLightColor, hexToRgb } = useChangeColor();

const electricityUsageImage = useThemeImage('electricityUsage');
const waterUsageImage = useThemeImage('waterUsage');
const gasUsageImage = useThemeImage('gasUsage');
const costImage = useThemeImage('cost');
const blendedUnitPriceImage = useThemeImage('blendedUnitPrice');
const statisticsDaysImage = useThemeImage('statisticsDays');
const metricCardBackgroundImage = useThemeImage('metricCardBackground');

const getErrorMessage = (error: unknown, fallback: string) => {
	const maybeError = error as { msg?: string; message?: string } | undefined;
	return maybeError?.msg || maybeError?.message || fallback;
};

const numericPrefixPattern = /^-?[\d,]+(?:\.\d+)?/;

const splitDisplayValue = (rawValue: string | number | null | undefined) => {
	const text = String(rawValue ?? '').trim();
	if (!text) {
		return {
			value: 0,
			displayValue: '--',
			unit: '',
		};
	}

	const matched = text.match(numericPrefixPattern);
	if (!matched) {
		return {
			value: 0,
			displayValue: text,
			unit: '',
		};
	}

	const numericText = matched[0];
	const value = Number(numericText.replace(/,/g, ''));
	const fractionDigits = numericText.includes('.') ? Math.min(numericText.split('.')[1].length, 2) : 0;
	return {
		value,
		displayValue: new Intl.NumberFormat('zh-CN', {
			maximumFractionDigits: fractionDigits,
			minimumFractionDigits: fractionDigits,
		}).format(value),
		unit: text
			.slice(numericText.length)
			.trim()
			.replace(/m3/g, 'm³'),
	};
};

const formatSignedPercent = (value: number | null | undefined) => {
	if (value === null || value === undefined || Number.isNaN(value)) return '--';
	return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const formatMetricRatioPercent = (value: number) => {
	if (!Number.isFinite(value) || value <= 0) return '0%';
	const rounded = value >= 10 ? Math.round(value) : Number(value.toFixed(1));
	return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
};

const formatCurrencyNumber = (value: number) => {
	return new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	}).format(value);
};

const formatPlainNumber = (value: number, digits = 0) => {
	return new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits,
	}).format(value);
};

const formatUsageValue = (value: number, unit: string) => {
	const digits = value >= 1000 ? 0 : 2;
	return `${formatPlainNumber(value, digits)}${unit}`;
};

const formatPriceValue = (value: number, unit: string) => `${formatPlainNumber(value, 3)}${unit}`;

const calculateRate = (currentValue: number, baseValue: number) => {
	if (!baseValue) return null;
	return Number((((currentValue - baseValue) / baseValue) * 100).toFixed(1));
};

const isOverviewTab = computed(() => activePrimaryTab.value === 'overview');
const currentUtilityTab = computed<UtilityEnergyTabKey>(() => (activePrimaryTab.value === 'overview' ? 'electricity' : activePrimaryTab.value));
const currentUtilityMeta = computed(() => utilityTabMeta[currentUtilityTab.value]);
const currentUtilityLabel = computed(() => currentUtilityMeta.value.label);
const utilityChartType = computed<UtilityChartType>({
	get: () => utilityChartTypeState[currentUtilityTab.value],
	set: (value) => {
		utilityChartTypeState[currentUtilityTab.value] = value;
	},
});

const overviewPickerType = computed(() => {
	if (overviewDateType.value === 'YEAR') return 'year';
	if (overviewDateType.value === 'MONTH') return 'month';
	return 'date';
});

const overviewPickerValueFormat = computed(() => {
	if (overviewDateType.value === 'YEAR') return 'YYYY';
	if (overviewDateType.value === 'MONTH') return 'YYYY-MM';
	return 'YYYY-MM-DD';
});

const overviewPickerPlaceholder = computed(() => {
	if (overviewDateType.value === 'YEAR') return '选择年份';
	if (overviewDateType.value === 'MONTH') return '选择月份';
	return '选择日期';
});

const overviewSummaryMetricLabel = computed(() => {
	if (overviewDateType.value === 'YEAR') return '当年总费用';
	if (overviewDateType.value === 'MONTH') return '当月总费用';
	return '当日总费用';
});

const buildOverviewStatValue = () => overviewDateValue.value.replace(/-/g, '');

const refreshOverviewStats = async () => {
	const requestToken = ++overviewRequestToken;
	overviewLoading.value = true;

	try {
		const response = await getEnergyCostStats({
			statType: overviewDateTypeToStatTypeMap[overviewDateType.value],
			statValue: buildOverviewStatValue(),
		});
		if (requestToken !== overviewRequestToken) return;
		overviewData.value = response.data;
	} catch (error) {
		if (requestToken !== overviewRequestToken) return;
		message.error(getErrorMessage(error, '用能费用统计数据加载失败'));
	} finally {
		if (requestToken === overviewRequestToken) {
			overviewLoading.value = false;
		}
	}
};

const refreshUtilityStats = async () => {
	const requestToken = ++utilityRequestToken;
	utilityLoading.value = true;

	try {
		const response = await getEnergyUtilityCost({
			timeRange: utilityTimeRange.value,
		});
		if (requestToken !== utilityRequestToken) return;
		utilityData.value = response.data;
	} catch (error) {
		if (requestToken !== utilityRequestToken) return;
		message.error(getErrorMessage(error, '分项费用统计数据加载失败'));
	} finally {
		if (requestToken === utilityRequestToken) {
			utilityLoading.value = false;
		}
	}
};

const refreshDetailPageData = async () => {
	const requestToken = ++detailRequestToken;
	detailLoading.value = true;

	try {
		const response = await getEnergyCostDetailPage({
			dateType: overviewDateType.value,
			statDate: overviewDateValue.value,
			pageNum: detailQuery.pageNum,
			pageSize: detailQuery.pageSize,
		});
		if (requestToken !== detailRequestToken) return;
		detailPageData.value = response.data;
	} catch (error) {
		if (requestToken !== detailRequestToken) return;
		message.error(getErrorMessage(error, '费用明细加载失败'));
	} finally {
		if (requestToken === detailRequestToken) {
			detailLoading.value = false;
		}
	}
};

watch(
	activePrimaryTab,
	(tab) => {
		if (tab === 'overview') {
			void refreshOverviewStats();
			void refreshDetailPageData();
			return;
		}

		if (!utilityData.value) {
			void refreshUtilityStats();
		}
	},
	{ immediate: true }
);

watch(overviewDateType, (value) => {
	overviewDateValue.value = getDefaultPickerValue(value);
});

watch(overviewDateValue, () => {
	detailQuery.pageNum = 1;
	if (!isOverviewTab.value) return;
	void refreshOverviewStats();
	void refreshDetailPageData();
});

watch(utilityTimeRange, () => {
	if (isOverviewTab.value) return;
	void refreshUtilityStats();
});

const handleCurrentPageChange = (pageNum: number) => {
	detailQuery.pageNum = pageNum;
	void refreshDetailPageData();
};

const handlePageSizeChange = (pageSize: number) => {
	detailQuery.pageSize = pageSize;
	detailQuery.pageNum = 1;
	void refreshDetailPageData();
};

const handleExport = async () => {
	exportLoading.value = true;
	try {
		const blob = await exportEnergyCostDetail({
			dateType: overviewDateType.value,
			statDate: overviewDateValue.value,
		});
		const extension = isEnergyUsageCostStatisticsMockEnabled() ? 'csv' : 'xlsx';
		handleBlobFile(blob, `energy-cost-detail-${buildOverviewStatValue()}.${extension}`);
		message.success('费用明细导出成功。');
	} catch (error) {
		message.error(getErrorMessage(error, '费用明细导出失败'));
	} finally {
		exportLoading.value = false;
	}
};

const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#1677FF');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.12));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);
const chartPalette = computed(() => currentTheme.value?.color?.chart || [primaryColor.value, '#00CAE8', '#E98A1D', '#7B61FF', '#5AD8A6']);

const toRgba = (color: string, alpha: number) => {
	const rgb = hexToRgb(color);
	if (!Array.isArray(rgb)) return color;
	return `rgba(${rgb.join(',')}, ${alpha})`;
};

const chartColorMap = computed(() => ({
	electricity: chartPalette.value[0] || primaryColor.value,
	water: chartPalette.value[1] || '#00CAE8',
	gas: chartPalette.value[2] || '#E98A1D',
	peak: chartPalette.value[0] || primaryColor.value,
	flat: chartPalette.value[1] || '#00CAE8',
	valley: '#F4B740',
}));

const dashboardVars = computed(() => {
	const primary = primaryColor.value;
	const isGreenSkin = storesThemeConfig.themeConfig.skin === 'light-green';
	const overviewShareColor = isGreenSkin ? '#4BA6A9' : primary;
	const overviewShareRgb = Array.isArray(hexToRgb(overviewShareColor)) ? hexToRgb(overviewShareColor).join(',') : '22, 119, 255';
	return {
		'--dashboard-primary': primary,
		'--dashboard-primary-deep': getDarkColor(primary, 0.12),
		'--dashboard-primary-soft': getLightColor(primary, 0.9),
		'--dashboard-primary-rgb': Array.isArray(hexToRgb(primary)) ? hexToRgb(primary).join(',') : '22, 119, 255',
		'--dashboard-gradient-start': gradientStart.value,
		'--dashboard-gradient-end': gradientEnd.value,
		'--dashboard-metric-card-image': `url("${metricCardBackgroundImage.value}")`,
		'--dashboard-title-bar-color': isGreenSkin ? '#4BA6A9' : '#1677FF',
		'--dashboard-title-bar-shadow': isGreenSkin
			? '0px 4px 10px 0px rgba(75,166,169,0.2)'
			: '0px 4px 10px 0px rgba(0, 148, 255, 0.2)',
		'--dashboard-overview-share-color': overviewShareColor,
		'--dashboard-overview-share-rgb': overviewShareRgb,
	};
});

const createRingItems = (entries: Array<{ key: string; label: string; rawValue: string | undefined; color: string }>): RingItem[] => {
	const parsedEntries = entries.map((item) => {
		const parsed = splitDisplayValue(item.rawValue);
		return {
			...item,
			value: parsed.value,
			displayValue: parsed.displayValue,
			unit: parsed.unit,
		};
	});

	const totalValue = parsedEntries.reduce((sum, item) => sum + item.value, 0);
	return parsedEntries.map((item) => ({
		key: item.key,
		label: item.label,
		value: item.value,
		displayValue: item.displayValue,
		unit: item.unit,
		ratio: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
		color: item.color,
	}));
};

const costStructureItems = computed(() =>
	createRingItems([
		{ key: 'electricity', label: '电费', rawValue: overviewData.value?.elecCost, color: chartColorMap.value.electricity },
		{ key: 'water', label: '水费', rawValue: overviewData.value?.waterCost, color: chartColorMap.value.water },
		{ key: 'gas', label: '燃气费', rawValue: overviewData.value?.gasCost, color: chartColorMap.value.gas },
	])
);

const peakPeriodItems = computed(() =>
	createRingItems([
		{ key: 'peak', label: '峰时段', rawValue: overviewData.value?.peak, color: chartColorMap.value.peak },
		{ key: 'flat', label: '平时段', rawValue: overviewData.value?.flat, color: chartColorMap.value.flat },
		{ key: 'valley', label: '谷时段', rawValue: overviewData.value?.valley, color: chartColorMap.value.valley },
	])
);

const utilityStructureItems = computed(() =>
	createRingItems([
		{ key: 'electricity', label: '电费', rawValue: utilityData.value?.elecCost, color: chartColorMap.value.electricity },
		{ key: 'water', label: '水费', rawValue: utilityData.value?.waterCost, color: chartColorMap.value.water },
		{ key: 'gas', label: '燃气费', rawValue: utilityData.value?.gasCost, color: chartColorMap.value.gas },
	])
);

const hasOverviewStructureData = computed(() => costStructureItems.value.some((item) => item.displayValue !== '--'));
const hasPeakStructureData = computed(() => peakPeriodItems.value.some((item) => item.displayValue !== '--'));
const hasUtilityStructureData = computed(() => utilityStructureItems.value.some((item) => item.displayValue !== '--'));

const createStructureChartData = (items: RingItem[]) =>
	items.map((item) => ({
		value: item.value,
		name: item.label,
		itemStyle: {
			color: item.color,
		},
	}));

const overviewStructureChartData = computed(() => createStructureChartData(costStructureItems.value));
const overviewStructureLegendNames = computed(() => costStructureItems.value.map((item) => item.label));

const peakStructureChartData = computed(() => createStructureChartData(peakPeriodItems.value));
const peakStructureLegendNames = computed(() => peakPeriodItems.value.map((item) => item.label));
const utilityStructureChartData = computed(() => createStructureChartData(utilityStructureItems.value));
const utilityStructureLegendNames = computed(() => utilityStructureItems.value.map((item) => item.label));

const trendLineShadowLayers = [
	{ width: 14, colorAlpha: 0.04, shadowBlur: 24, shadowAlpha: 0.12, shadowOffsetY: 10 },
	{ width: 10, colorAlpha: 0.07, shadowBlur: 16, shadowAlpha: 0.16, shadowOffsetY: 7 },
	{ width: 6, colorAlpha: 0.12, shadowBlur: 8, shadowAlpha: 0.12, shadowOffsetY: 4 },
];

const createTrendShadowSeries = (seriesName: string, color: string, data: number[]) =>
	trendLineShadowLayers.map((shadow, index) => ({
		type: 'line' as const,
		name: `${seriesName}-shadow-${index + 1}`,
		smooth: true,
		symbol: 'none',
		silent: true,
		animation: false,
		z: index + 1,
		data,
		lineStyle: {
			width: shadow.width,
			color: toRgba(color, shadow.colorAlpha),
			shadowBlur: shadow.shadowBlur,
			shadowColor: toRgba(color, shadow.shadowAlpha),
			shadowOffsetX: 0,
			shadowOffsetY: shadow.shadowOffsetY,
		},
		tooltip: {
			show: false,
		},
	}));

const currentMetricCards = computed<MetricCardItem[]>(() => {
	const accentMap = {
		cost: primaryColor.value,
		electricity: chartColorMap.value.electricity,
		water: chartColorMap.value.water,
		gas: chartColorMap.value.gas,
		price: getDarkColor(primaryColor.value, 0.12),
		days: getLightColor(primaryColor.value, 0.1),
	};

	if (isOverviewTab.value) {
		const totalCurrent = splitDisplayValue(overviewData.value?.totalCost).value;
		const totalYoy =
			splitDisplayValue(overviewData.value?.elecYoY).value +
			splitDisplayValue(overviewData.value?.waterYoY).value +
			splitDisplayValue(overviewData.value?.gasYoY).value;
		const shareRatioMap = {
			electricity: costStructureItems.value.find((item) => item.key === 'electricity')?.ratio ?? 0,
			water: costStructureItems.value.find((item) => item.key === 'water')?.ratio ?? 0,
			gas: costStructureItems.value.find((item) => item.key === 'gas')?.ratio ?? 0,
		};

		const metrics = [
			{
				key: 'totalCost',
				label: overviewSummaryMetricLabel.value,
				rawValue: overviewData.value?.totalCost,
				compareRate: calculateRate(totalCurrent, totalYoy),
				icon: costImage.value,
				accent: accentMap.cost,
				cardMode: 'overview-total' as const,
			},
			{
				key: 'electricityCost',
				label: '电费',
				rawValue: overviewData.value?.elecCost,
				compareRate: null,
				shareRatio: shareRatioMap.electricity,
				icon: electricityUsageImage.value,
				accent: accentMap.electricity,
				cardMode: 'overview-share' as const,
			},
			{
				key: 'waterCost',
				label: '水费',
				rawValue: overviewData.value?.waterCost,
				compareRate: null,
				shareRatio: shareRatioMap.water,
				icon: waterUsageImage.value,
				accent: accentMap.water,
				cardMode: 'overview-share' as const,
			},
			{
				key: 'gasCost',
				label: '燃气费',
				rawValue: overviewData.value?.gasCost,
				compareRate: null,
				shareRatio: shareRatioMap.gas,
				icon: gasUsageImage.value,
				accent: accentMap.gas,
				cardMode: 'overview-share' as const,
			},
		];

		return metrics.map((item) => {
			const parsed = splitDisplayValue(item.rawValue);
			return {
				key: item.key,
				label: item.label,
				displayValue: parsed.displayValue,
				unit: parsed.unit,
				cardMode: item.cardMode,
				compareLabel: '同比',
				compareRate: item.compareRate,
				sharePercentText: item.cardMode === 'overview-share' ? formatMetricRatioPercent(item.shareRatio ?? 0) : undefined,
				progressRatio: item.cardMode === 'overview-share' ? Math.min(Math.max((item.shareRatio ?? 0) / 100, 0), 1) : 0,
				icon: item.icon,
				accent: item.accent,
			};
		});
	}

	const currentMeta = currentUtilityMeta.value;
	const metrics = [
		{
			key: 'totalUsage',
			label: `总${currentUtilityLabel.value}量`,
			rawValue: utilityData.value?.[currentMeta.totalKey],
			footnote: '',
			icon: currentUtilityTab.value === 'electricity' ? electricityUsageImage.value : currentUtilityTab.value === 'water' ? waterUsageImage.value : gasUsageImage.value,
			accent: currentUtilityTab.value === 'electricity' ? accentMap.electricity : currentUtilityTab.value === 'water' ? accentMap.water : accentMap.gas,
		},
		{
			key: 'cost',
			label: '总费用',
			rawValue: utilityData.value?.[currentMeta.costKey],
			footnote: '',
			icon: costImage.value,
			accent: accentMap.cost,
		},
		{
			key: 'unitPrice',
			label: '综合单价',
			rawValue: utilityData.value?.[currentMeta.priceKey],
			footnote: '',
			icon: blendedUnitPriceImage.value,
			accent: accentMap.price,
		},
		{
			key: 'statDays',
			label: '统计天数',
			rawValue: utilityData.value?.statDays,
			footnote: '',
			icon: statisticsDaysImage.value,
			accent: accentMap.days,
		},
	];

	return metrics.map((item) => {
		const parsed = splitDisplayValue(item.rawValue);
		return {
			key: item.key,
			label: item.label,
			displayValue: parsed.displayValue,
			unit: parsed.unit,
			cardMode: 'utility-summary',
			compareRate: null,
			footnote: item.footnote,
			progressRatio: 0,
			icon: item.icon,
			accent: item.accent,
		};
	});
});

const getMetricCardStyle = (metric: MetricCardItem) => ({
	'--metric-accent': metric.accent,
	'--metric-accent-soft': toRgba(metric.accent, 0.16),
	'--metric-accent-strong': toRgba(metric.accent, 0.34),
});

const getCostRateClass = (value: number | null | undefined) => {
	if (value === null || value === undefined) return 'is-neutral';
	if (value <= 0) return 'is-good';
	return 'is-bad';
};

const getEnergyTypeTagClass = (energyTypeCode: EnergyCostEnergyTypeCode) => {
	if (energyTypeCode === 'ELECTRICITY') return 'is-electricity';
	if (energyTypeCode === 'WATER') return 'is-water';
	return 'is-gas';
};

const overviewTrendSubtitle = computed(() => {
	if (overviewDateType.value === 'DAY') return `${overviewDateValue.value} 费用变化趋势`;
	if (overviewDateType.value === 'MONTH') return `${overviewDateValue.value} 日费用趋势`;
	return `${overviewDateValue.value} 月费用趋势`;
});

const overviewTrendOption = computed<EChartsOption>(() => ({
	tooltip: {
		trigger: 'axis',
		backgroundColor: 'rgba(15, 23, 42, 0.92)',
		borderWidth: 0,
		padding: [10, 14],
		textStyle: {
			color: '#ffffff',
		},
		formatter: (params: any) => {
			if (!Array.isArray(params) || !params.length) return '';
			const visibleParams = params.filter((item: any) => !String(item.seriesName || '').includes('-shadow-'));
			const lines = visibleParams.map(
				(item: any) =>
					`${item.marker}${item.seriesName}：${formatCurrencyNumber(Number(item.data || 0))} 元`
			);
			return `${visibleParams[0]?.axisValue || params[0].axisValue}<br/>${lines.join('<br/>')}`;
		},
	},
	legend: {
		data: ['电费', '水费', '气费'],
		right: 0,
		top: 0,
		itemWidth: 10,
		itemHeight: 10,
		textStyle: {
			color: '#6A7382',
		},
	},
	grid: {
		left: 18,
		right: 18,
		top: 48,
		bottom: 16,
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: overviewData.value?.energyTrend.map((item) => item.statPeriod) ?? [],
		axisTick: {
			show: false,
		},
		axisLine: {
			lineStyle: {
				color: toRgba(primaryColor.value, 0.16),
			},
		},
		axisLabel: {
			color: '#7B8794',
		},
	},
	yAxis: {
		type: 'value',
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			color: '#7B8794',
		},
		splitLine: {
			lineStyle: {
				color: 'rgba(206, 214, 229, 0.7)',
				type: 'dashed',
			},
		},
	},
	series: [
		...createTrendShadowSeries(
			'电费',
			chartColorMap.value.electricity,
			overviewData.value?.energyTrend.map((item) => splitDisplayValue(item.elecCost).value) ?? []
		),
		{
			name: '电费',
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: 8,
			data: overviewData.value?.energyTrend.map((item) => splitDisplayValue(item.elecCost).value) ?? [],
			lineStyle: {
				width: 3,
				color: chartColorMap.value.electricity,
			},
			itemStyle: {
				color: '#ffffff',
				borderColor: chartColorMap.value.electricity,
				borderWidth: 2,
			},
			z: 10,
		},
		...createTrendShadowSeries(
			'水费',
			chartColorMap.value.water,
			overviewData.value?.energyTrend.map((item) => splitDisplayValue(item.waterCost).value) ?? []
		),
		{
			name: '水费',
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: 8,
			data: overviewData.value?.energyTrend.map((item) => splitDisplayValue(item.waterCost).value) ?? [],
			lineStyle: {
				width: 3,
				color: chartColorMap.value.water,
			},
			itemStyle: {
				color: '#ffffff',
				borderColor: chartColorMap.value.water,
				borderWidth: 2,
			},
			z: 10,
		},
		...createTrendShadowSeries(
			'气费',
			chartColorMap.value.gas,
			overviewData.value?.energyTrend.map((item) => splitDisplayValue(item.gasCost).value) ?? []
		),
		{
			name: '气费',
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: 8,
			data: overviewData.value?.energyTrend.map((item) => splitDisplayValue(item.gasCost).value) ?? [],
			lineStyle: {
				width: 3,
				color: chartColorMap.value.gas,
			},
			itemStyle: {
				color: '#ffffff',
				borderColor: chartColorMap.value.gas,
				borderWidth: 2,
			},
			z: 10,
		},
	],
}));

const rankingList = computed(() => overviewData.value?.spaceRankList ?? []);
const rankingTitle = computed(() => '空间费用排名');
const rankingYAxisData = computed(() => rankingList.value.map((item) => item.spaceCode));
const rankingSeriesData = computed(() => rankingList.value.map((item) => splitDisplayValue(item.cost).value));

const overviewComparisonCategories = ['电费', '水费', '气费'];
const comparisonCurrentSeriesData = computed(() => [
	splitDisplayValue(overviewData.value?.elecCost).value,
	splitDisplayValue(overviewData.value?.waterCost).value,
	splitDisplayValue(overviewData.value?.gasCost).value,
]);

const yoyReferenceSeriesData = computed(() => [
	splitDisplayValue(overviewData.value?.elecYoY).value,
	splitDisplayValue(overviewData.value?.waterYoY).value,
	splitDisplayValue(overviewData.value?.gasYoY).value,
]);

const momReferenceSeriesData = computed(() => [
	splitDisplayValue(overviewData.value?.elecLast).value,
	splitDisplayValue(overviewData.value?.waterLast).value,
	splitDisplayValue(overviewData.value?.gasLast).value,
]);

const currentUtilityCostLabel = computed(() => {
	if (currentUtilityTab.value === 'water') return '水费';
	if (currentUtilityTab.value === 'gas') return '燃气费';
	return '电费';
});

const utilityTrendTitle = computed(() => `${currentUtilityLabel.value}费用趋势`);
const utilityBarXAxisData = computed(() => utilityData.value?.energyTrend.map((item) => item.statPeriod) ?? []);
const utilityBarSeriesData = computed(() =>
	utilityData.value?.energyTrend.map((item) => Number((splitDisplayValue(item[currentUtilityMeta.value.trendKey]).value / 10000).toFixed(2))) ?? []
);

const utilityTrendOption = computed<EChartsOption>(() => {
	const trendKey = currentUtilityMeta.value.trendKey;
	const trendColor =
		currentUtilityTab.value === 'electricity'
			? chartColorMap.value.electricity
			: currentUtilityTab.value === 'water'
				? chartColorMap.value.water
				: chartColorMap.value.gas;
	const trendData = utilityData.value?.energyTrend ?? [];
	const seriesData = trendData.map((item) => Number((splitDisplayValue(item[trendKey]).value / 10000).toFixed(2)));
	const utilitySeriesName = currentUtilityCostLabel.value;
	const areaOpacity = utilityChartType.value === 'area' ? 0.28 : 0.14;

	const baseSeries =
	{
		name: utilitySeriesName,
		type: 'line' as const,
		smooth: true,
		symbol: 'circle',
		symbolSize: 8,
		data: seriesData,
		lineStyle: {
			width: 3,
			color: trendColor,
		},
		itemStyle: {
			color: '#ffffff',
			borderColor: trendColor,
			borderWidth: 2,
		},
		z: 10,
		areaStyle: {
			color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: toRgba(trendColor, areaOpacity) },
				{ offset: 1, color: toRgba(trendColor, 0.02) },
			]),
		},
	};

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
				const current = Array.isArray(params)
					? params.find((item: any) => !String(item.seriesName || '').includes('-shadow-')) || params[0]
					: params;
				return `${current.axisValue}<br/>${utilitySeriesName}：${formatPlainNumber(Number(current.value || 0), 2)} 万元`;
			},
		},
		legend: {
			data: [utilitySeriesName],
			left: 'center',
			bottom: 0,
			selectedMode: false,
			icon: 'circle',
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: '#7B8794',
				fontSize: 12,
			},
		},
		grid: {
			left: 18,
			right: 18,
			top: 40,
			bottom: 42,
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: trendData.map((item) => item.statPeriod),
			axisTick: {
				show: false,
			},
			axisLine: {
				lineStyle: {
					color: toRgba(primaryColor.value, 0.16),
				},
			},
			axisLabel: {
				color: '#7B8794',
				margin: 14,
			},
		},
		yAxis: {
			type: 'value',
			name: '费用(万元)',
			nameLocation: 'end',
			nameRotate: 0,
			nameGap: 18,
			nameTextStyle: {
				color: '#7B8794',
				fontSize: 12,
				padding: [0, 0, 10, -4],
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
			splitLine: {
				lineStyle: {
					color: 'rgba(206, 214, 229, 0.85)',
					type: 'dashed',
				},
			},
		},
		series: [...createTrendShadowSeries(utilitySeriesName, trendColor, seriesData), baseSeries],
	};
});

const detailRows = computed<EnergyCostDetailPageRecord[]>(() => detailPageData.value.list || []);
</script>

<style scoped lang="scss">
.layout-padding {
	position: relative !important;
	height: auto !important;
	min-height: 100% !important;
	overflow: visible !important;
}

.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}

.cost-dashboard-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.cost-dashboard {
	min-height: 100%;
	padding: 8px 0 10px;
	display: flex;
	flex-direction: column;
	gap: 18px;
	background: transparent;
}

.cost-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
}

.cost-toolbar__tabs,
.cost-toolbar__filters,
.filter-pill-group {
	display: inline-flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 12px;
}

.cost-toolbar__tab,
.filter-pill {
	height: 36px;
	padding: 0 18px;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.14);
	border-radius: 12px;
	background: #ffffff;
	color: var(--theme-text-primaryTitle);
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}

.cost-toolbar__tab:hover,
.filter-pill:hover {
	transform: translateY(-1px);
	border-color: rgba(var(--dashboard-primary-rgb), 0.24);
	box-shadow: 0 10px 24px rgba(var(--dashboard-primary-rgb), 0.08);
}

.cost-toolbar__tab.is-active,
.filter-pill.is-active {
	border-color: transparent;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
}

.cost-toolbar__date-picker {
	width: 156px;
}

.filter-pill-group--compact {
	gap: 8px;
}

.filter-pill-group--compact .filter-pill {
	height: 32px;
	padding: 0 14px;
	font-size: 13px;
}

.metric-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 14px;
}

.metric-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 90px;
	align-items: center;
	min-height: 112px;
	padding: 16px 18px;
	border-radius: 20px;
	background: #ffffff;
	background-image: var(--dashboard-metric-card-image);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	overflow: hidden;
}

.metric-card--overview {
	height: 110px;
	min-height: 0;
	padding: clamp(14px, 0.83333vw, 16px) clamp(16px, 1.04167vw, 20px);
	grid-template-columns: minmax(0, 1fr) 90px;
	border-radius: clamp(16px, 1.04167vw, 20px);
	background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
	background-image: var(--dashboard-metric-card-image);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	border: 1px solid rgba(86, 133, 214, 0.08);
}

.metric-card--utility-summary {
	height: 110px;
	min-height: 0;
	padding: clamp(14px, 0.83333vw, 16px) clamp(16px, 1.04167vw, 20px);
	grid-template-columns: minmax(0, 1fr) 90px;
	border-radius: clamp(16px, 1.04167vw, 20px);
	background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
	background-image: var(--dashboard-metric-card-image);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	border: 1px solid rgba(86, 133, 214, 0.08);
}

.metric-card__content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: 8px;
	min-width: 0;
}

.metric-card--overview .metric-card__content {
	gap: clamp(4px, 0.3125vw, 6px);
}

.metric-card--utility-summary .metric-card__content {
	gap: clamp(4px, 0.3125vw, 6px);
}

.metric-card__label {
	margin: 0;
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-primaryTitle);
}

.metric-card--overview .metric-card__label {
	font-size: 14px;
	line-height: 1.2;
	color: #293548;
}

.metric-card--utility-summary .metric-card__label {
	font-size: 14px;
	line-height: 1.2;
	color: #293548;
}

.metric-card__value {
	display: flex;
	align-items: flex-end;
	gap: 6px;
	min-width: 0;
	line-height: 1;
}

.metric-card__value span {
	min-width: 0;
	font-size: 28px;
	font-weight: 800;
	letter-spacing: -0.04em;
	color: var(--theme-text-system);
	word-break: keep-all;
}

.metric-card--overview .metric-card__value span {
	font-size: 24px;
	letter-spacing: -0.03em;
	color: #233248;
}

.metric-card--utility-summary .metric-card__value span {
	font-size: 24px;
	letter-spacing: -0.03em;
	color: #233248;
}

.metric-card__value small {
	margin-bottom: 4px;
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-dataAssist);
}

.metric-card--overview .metric-card__value small {
	margin-bottom: 3px;
	font-size: clamp(14px, 0.83333vw, 16px);
	font-weight: 700;
	color: #738198;
}

.metric-card--utility-summary .metric-card__value small {
	margin-bottom: 3px;
	font-size: clamp(14px, 0.83333vw, 16px);
	font-weight: 700;
	color: #738198;
}

.metric-card__summary-spacer {
	flex: 1;
	min-height: 20px;
}

.metric-card__footer {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-height: 18px;
}

.metric-card__footer-label,
.metric-card__footnote {
	font-size: 12px;
	font-weight: 600;
	color: #7b8794;
}

.metric-card__trend {
	display: inline-flex;
	align-items: center;
	gap: 2px;
	font-size: 14px;
	font-weight: 700;
}

.metric-card__trend.is-good {
	color: #46b538;
}

.metric-card__trend.is-bad {
	color: #f85a5a;
}

.metric-card__trend.is-neutral {
	color: #7b8794;
}

.metric-card__compare {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	min-height: 16px;
}

.metric-card__compare-icon {
	width: 0;
	height: 0;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
}

.metric-card__compare-icon.is-up {
	border-bottom: 8px solid #f85a5a;
}

.metric-card__compare-icon.is-down {
	border-top: 8px solid #46b538;
}

.metric-card__compare-label {
	font-size: 12px;
	font-weight: 700;
	color: #7b8794;
}

.metric-card__compare-value {
	font-size: 13px;
	font-weight: 800;
}

.metric-card__compare-value.is-good {
	color: #46b538;
}

.metric-card__compare-value.is-bad {
	color: #f85a5a;
}

.metric-card__compare-value.is-neutral {
	color: #7b8794;
}

.metric-card__share-row {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: auto;
}

.metric-card__share-label {
	flex: none;
	font-size: 12px;
	font-weight: 700;
	color: #7b8794;
	white-space: nowrap;
}

.metric-card__share-label strong {
	margin-left: 4px;
	font-size: 13px;
	font-weight: 800;
	color: var(--dashboard-overview-share-color);
}

.metric-card__progress {
	position: relative;
	width: 100%;
	height: 4px;
	border-radius: 999px;
	background: rgba(var(--dashboard-primary-rgb), 0.12);
	overflow: hidden;
}

.metric-card__progress span {
	display: block;
	height: 100%;
	border-radius: inherit;
	background: linear-gradient(90deg, var(--metric-accent-soft), var(--metric-accent));
	box-shadow: 0 4px 12px var(--metric-accent-strong);
}

.metric-card__progress--inline {
	flex: 1;
	height: 12px;
	min-width: 0;
	background: rgba(173, 191, 211, 0.75);
}

.metric-card--overview-share .metric-card__progress--inline span {
	min-width: 10px;
	background: linear-gradient(90deg, var(--dashboard-overview-share-color), var(--dashboard-overview-share-color));
	box-shadow: 0 4px 10px rgba(var(--dashboard-overview-share-rgb), 0.18);
}

.metric-card__visual {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.metric-card--overview .metric-card__visual {
	align-self: stretch;
}

.metric-card--utility-summary .metric-card__visual {
	align-self: stretch;
}

.metric-card__icon-shell {
	width: 84px;
	height: 84px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.metric-card--overview .metric-card__icon-shell {
	width: 90px;
	height: 90px;
}

.metric-card--utility-summary .metric-card__icon-shell {
	width: 90px;
	height: 90px;
}

.metric-card__icon {
	width: 100%;
	height: 100%;
	object-fit: contain;
	filter: drop-shadow(0 8px 14px var(--metric-accent-soft));
}

.metric-card--overview .metric-card__icon {
	filter: drop-shadow(0 10px 18px rgba(var(--dashboard-primary-rgb), 0.14));
}

.metric-card--utility-summary .metric-card__icon {
	filter: drop-shadow(0 10px 18px rgba(var(--dashboard-primary-rgb), 0.14));
}

.dashboard-grid {
	display: grid;
	gap: 14px;
}

.dashboard-grid--primary,
.dashboard-grid--utility {
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: clamp(12px, 0.83333vw, 16px);
}

.dashboard-grid--secondary {
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: clamp(12px, 0.83333vw, 16px);
}

.dashboard-grid--analysis {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-grid--primary .panel-card--trend,
.dashboard-grid--utility .panel-card--trend {
	grid-column: span 3;
}

.dashboard-grid--primary .panel-card--structure,
.dashboard-grid--utility .panel-card--structure {
	grid-column: span 1;
}

.dashboard-grid--secondary .panel-card--peak {
	grid-column: span 1;
}

.dashboard-grid--secondary .panel-card--ranking {
	grid-column: span 3;
}

.panel-card {
	position: relative;
	padding: 22px 24px;
	border-radius: 28px;
	background: #ffffff;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
	overflow: hidden;
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

.panel-card__header--table {
	align-items: center;
}

.panel-card__header--utility {
	align-items: center;
	margin-bottom: 14px;
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
	border-radius: 999px;
	background: var(--dashboard-title-bar-color, #1677FF);
	box-shadow: var(--dashboard-title-bar-shadow, 0px 4px 10px 0px rgba(0, 148, 255, 0.2));
}

.panel-card__title-block h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	line-height: 1.2;
	color: var(--theme-text-system);
}

.panel-card__title-block p {
	margin: 6px 0 0;
	font-size: 13px;
	color: var(--theme-text-dataAssist);
}

.panel-card__actions {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
}

.panel-chart {
	width: 100%;
}

.panel-chart--trend,
.panel-chart--utility {
	height: 320px;
}

.panel-card--utility-trend {
	padding-bottom: 18px;
}

.panel-card--utility-trend .panel-chart--utility {
	height: 430px;
}

.panel-card--utility-structure {
	padding-bottom: 20px;
}

.structure-panel {
	position: relative;
	z-index: 1;
	min-height: 320px;
}

.structure-panel :deep(.chart) {
	min-height: 320px;
}

.structure-panel--legend-bottom {
	min-height: 380px;
}

.structure-panel--legend-bottom :deep(.chart),
.structure-panel--legend-bottom :deep(.chart-shell) {
	min-height: 380px;
}

.analysis-comparison {
	height: 100%;
}

.utility-phase-comparison {
	height: 430px;
}

.utility-phase-comparison :deep(.chart-container) {
	height: 100%;
	min-height: 0;
	padding: 0;
	background: transparent;
	border: none;
	border-radius: 0;
}

.utility-phase-comparison :deep(.chart-title) {
	display: none;
}

.utility-phase-comparison :deep(.chart) {
	height: 100% !important;
	min-height: 0;
}

.analysis-comparison :deep(.chart-container) {
	height: 100%;
	min-height: 0;
	border-radius: 28px;
}

.analysis-comparison :deep(.chart) {
	min-height: 280px;
}

.analysis-comparison :deep(.chart-title),
.panel-card--ranking :deep(.chart-title) {
	display: inline-flex;
	align-items: center;
	gap: 12px;
	margin: 0 0 18px;
	font-size: 18px;
	font-weight: 700;
	color: var(--theme-text-system);
}

.analysis-comparison :deep(.chart-title::before),
.panel-card--ranking :deep(.chart-title::before) {
	content: '';
	flex: none;
	width: 4px;
	height: 22px;
	border-radius: 999px;
	background: var(--dashboard-title-bar-color, #1677FF);
	box-shadow: var(--dashboard-title-bar-shadow, 0px 4px 10px 0px rgba(0, 148, 255, 0.2));
}

.panel-chart--ring {
	height: 220px;
}

.panel-chart--ranking {
	height: 240px;
}

.ring-panel {
	display: grid;
	grid-template-columns: minmax(0, 210px) minmax(0, 1fr);
	align-items: center;
	gap: 18px;
}

.ring-panel--compact {
	grid-template-columns: minmax(0, 188px) minmax(0, 1fr);
}

.ring-panel__chart-shell {
	position: relative;
	width: 100%;
	height: 220px;
}

.ring-panel__overlay {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

.ring-panel__overlay span {
	font-size: 12px;
	font-weight: 600;
	color: #7b8794;
}

.ring-panel__overlay strong {
	margin-top: 6px;
	font-size: 22px;
	font-weight: 800;
	line-height: 1;
	color: var(--theme-text-system);
}

.ring-panel__overlay small {
	margin-top: 4px;
	font-size: 12px;
	font-weight: 600;
	color: #7b8794;
}

.ring-legend {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.ring-legend__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 12px;
	border-radius: 16px;
	background: rgba(var(--dashboard-primary-rgb), 0.04);
}

.ring-legend__meta {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
}

.ring-legend__dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	flex-shrink: 0;
}

.ring-legend__label {
	font-size: 14px;
	font-weight: 600;
	color: #4a5568;
}

.ring-legend__stats {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2px;
}

.ring-legend__stats strong {
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-system);
}

.ring-legend__stats small {
	font-size: 12px;
	color: #7b8794;
}

.panel-card--table {
	padding: 0;
	background: transparent;
	border: none;
	border-radius: 0;
}

.panel-card--table .panel-card__header {
	margin-bottom: 16px;
}

.table-export-btn {
	height: 40px;
	padding: 0 18px;
	border: 1px solid #9aa8bb;
	border-radius: 14px;
	background: #ffffff;
	color: #5b6780;
	font-size: 14px;
	font-weight: 700;
	box-shadow: none;
}

.table-export-btn:hover,
.table-export-btn:focus {
	border-color: #7f90aa;
	color: #44516a;
	background: #ffffff;
}

.table-export-btn :deep(.el-icon) {
	margin-right: 6px;
	font-size: 16px;
}

.table-shell {
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 0;
	background: #ffffff;
	border: 1px solid #e1e9f4;
	border-radius: 16px;
	overflow: hidden;
}

.energy-type-tag {
	display: inline;
	min-width: 0;
	height: auto;
	padding: 0;
	border-radius: 0;
	font-size: 15px;
	font-weight: 500;
	color: #5c667b;
}

.energy-type-tag.is-electricity,
.energy-type-tag.is-water,
.energy-type-tag.is-gas {
	background: transparent;
	color: #5c667b;
}

.cost-amount {
	color: #ef4444;
	font-weight: 700;
}

.rate-tag {
	font-size: 13px;
	font-weight: 700;
}

.rate-tag.is-good {
	color: #46b538;
}

.rate-tag.is-bad {
	color: #ef4444;
}

.rate-tag.is-neutral {
	color: #7b8794;
}

.table-pagination {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
	padding: 0 18px 18px;
}

.table-pagination__total {
	font-size: 16px;
	font-weight: 500;
	color: #586378;
}

:deep(.detail-table) {
	--el-table-border-color: #e6edf6;
	--el-table-header-bg-color: #f8f9fa;
	--el-table-row-hover-bg-color: #fafcff;
	--el-table-current-row-bg-color: #fafcff;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
}

:deep(.detail-table::before),
:deep(.detail-table .el-table__inner-wrapper::before) {
	display: none;
}

:deep(.detail-table .el-table__header th.el-table__cell) {
	height: 58px;
	padding: 0 14px;
	background: #f8f9fa;
	color: #4d5669;
	font-size: 15px;
	font-weight: 700;
	border-bottom: 1px solid #e6edf6;
}

:deep(.detail-table .el-table__row td.el-table__cell) {
	height: 62px;
	padding: 0 14px;
	color: #6a7488;
	font-size: 15px;
	border-bottom: 1px solid #edf2f8;
}

:deep(.detail-table .el-table__row:last-child td.el-table__cell) {
	border-bottom: none;
}

:deep(.detail-table .cell) {
	line-height: 1.4;
}

:deep(.table-pagination .el-pagination) {
	gap: 10px;
}

:deep(.table-pagination .el-pagination__sizes .el-input__wrapper) {
	height: 36px;
	border-radius: 4px;
	box-shadow: 0 0 0 1px #e1e9f4 inset;
}

:deep(.table-pagination .btn-prev),
:deep(.table-pagination .btn-next),
:deep(.table-pagination .el-pager li) {
	min-width: 36px;
	height: 36px;
	border: 1px solid #e1e9f4;
	border-radius: 4px;
	background: #ffffff;
	color: #667388;
	box-shadow: none;
}

:deep(.table-pagination .el-pager li.is-active) {
	border-color: #4d8dff;
	color: #4d8dff;
	background: #ffffff;
}

:deep(.table-pagination .el-pagination__jump) {
	margin-left: 6px;
	color: #667388;
}

:deep(.table-pagination .el-pagination__editor.el-input .el-input__wrapper) {
	height: 36px;
	border-radius: 4px;
	box-shadow: 0 0 0 1px #e1e9f4 inset;
}

:deep(.cost-toolbar__date-picker .el-input__wrapper) {
	border-radius: 12px;
	box-shadow: 0 0 0 1px rgba(var(--dashboard-primary-rgb), 0.12) inset;
}

@media screen and (max-width: 1440px) {
	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.dashboard-grid--primary,
	.dashboard-grid--utility,
	.dashboard-grid--secondary {
		grid-template-columns: minmax(0, 1fr);
	}

	.dashboard-grid--primary .panel-card--trend,
	.dashboard-grid--primary .panel-card--structure,
	.dashboard-grid--utility .panel-card--trend,
	.dashboard-grid--utility .panel-card--structure,
	.dashboard-grid--secondary .panel-card--peak,
	.dashboard-grid--secondary .panel-card--ranking {
		grid-column: auto;
	}
}

@media screen and (max-width: 992px) {
	.dashboard-grid--analysis {
		grid-template-columns: minmax(0, 1fr);
	}

	.ring-panel,
	.ring-panel--compact {
		grid-template-columns: minmax(0, 1fr);
	}

	.ring-panel__chart-shell {
		max-width: 260px;
		margin: 0 auto;
	}

	.analysis-comparison :deep(.chart) {
		min-height: 240px;
	}
}

@media screen and (max-width: 768px) {
	.cost-dashboard {
		padding-bottom: 64px;
	}

	.metric-grid {
		grid-template-columns: minmax(0, 1fr);
	}

	.metric-card {
		grid-template-columns: minmax(0, 1fr) 78px;
	}

	.cost-toolbar__tabs,
	.cost-toolbar__filters {
		width: 100%;
	}

	.panel-card {
		padding: 18px;
		border-radius: 22px;
	}

	.panel-card--table {
		padding: 0;
		border-radius: 0;
	}

	.panel-card--utility-trend .panel-chart--utility {
		height: 320px;
	}

	.panel-card__header {
		flex-direction: column;
		align-items: stretch;
	}

	.utility-phase-comparison {
		height: 320px;
	}

	.table-pagination {
		flex-direction: column;
		align-items: flex-start;
	}

	:deep(.table-pagination .el-pagination) {
		flex-wrap: wrap;
	}
}
</style>
